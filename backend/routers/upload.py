import json
import os

from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
import pandas as pd
from supabase import create_client, Client

from utils.parser import get_column_preview, parse_csv

load_dotenv()

_supabase_url = os.getenv("SUPABASE_URL")
_supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not _supabase_url or not _supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")

supabase: Client = create_client(_supabase_url, _supabase_key)

router = APIRouter()


@router.post("/preview")
async def preview(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = get_column_preview(contents)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/process")
async def process(
    file: UploadFile = File(...),
    column_map: str = Form(...),
    user_id: str = Form(...),
):
    try:
        mapping = json.loads(column_map)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="column_map must be valid JSON")

    try:
        contents = await file.read()
        rows = parse_csv(contents, mapping)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])

    total_revenue = float(df["total_price"].sum())
    total_orders = int(df["order_id"].nunique())
    avg_order_value = round(total_revenue / total_orders, 2) if total_orders else 0.0

    df["day_of_week"] = df["date"].dt.day_name()
    revenue_by_dow = df.groupby("day_of_week")["total_price"].sum()
    peak_day = revenue_by_dow.idxmax()

    all_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    revenue_by_day_of_week = {day: round(float(revenue_by_dow.get(day, 0)), 2) for day in all_days}

    item_stats = (
        df.groupby("item_name")
        .agg(total_revenue=("total_price", "sum"), quantity=("quantity", "sum"))
        .reset_index()
        .sort_values("total_revenue", ascending=False)
    )
    top_items = item_stats.head(10).to_dict(orient="records")
    bottom_items = item_stats.tail(5).to_dict(orient="records")

    for item_list in [top_items, bottom_items]:
        for item in item_list:
            item["total_revenue"] = round(float(item["total_revenue"]), 2)
            item["quantity"] = int(item["quantity"])

    stats = {
        "date_range_start": str(df["date"].min().date()),
        "date_range_end": str(df["date"].max().date()),
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "avg_order_value": avg_order_value,
        "peak_day": peak_day,
        "top_items": top_items,
        "bottom_items": bottom_items,
        "revenue_by_day_of_week": revenue_by_day_of_week,
    }

    try:
        report_resp = (
            supabase.table("reports")
            .insert({
                "user_id": user_id,
                "filename": file.filename,
                "date_range_start": stats["date_range_start"],
                "date_range_end": stats["date_range_end"],
                "total_revenue": stats["total_revenue"],
                "total_orders": stats["total_orders"],
                "avg_order_value": stats["avg_order_value"],
                "peak_day": stats["peak_day"],
            })
            .execute()
        )
        if not report_resp.data:
            raise HTTPException(status_code=500, detail="Failed to create report row")
        report_id = report_resp.data[0]["id"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save report: {e}")

    import math
    sales_records = []
    for row in rows:
        record = {**row, "report_id": report_id, "user_id": user_id}
        record["date"] = str(record["date"])
        cleaned = {}
        for k, v in record.items():
            if isinstance(v, float) and math.isnan(v):
                cleaned[k] = None
            else:
                cleaned[k] = v
        sales_records.append(cleaned)

    print(f"Inserting {len(sales_records)} sales records...")
    print(f"Sample record: {sales_records[0] if sales_records else 'EMPTY'}")
    try:
        supabase.table("sales_records").insert(sales_records).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save sales records: {e}")

    return {**stats, "report_id": report_id}
