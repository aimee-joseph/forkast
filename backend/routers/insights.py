import json
import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
from supabase import create_client, Client

from utils.gemini import generate_insights

load_dotenv()

_supabase_url = os.getenv("SUPABASE_URL")
_supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not _supabase_url or not _supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")

supabase: Client = create_client(_supabase_url, _supabase_key)

router = APIRouter()


class GenerateRequest(BaseModel):
    report_id: str
    user_id: str


@router.post("/generate")
async def generate(req: GenerateRequest):
    try:
        report_resp = (
            supabase.table("reports")
            .select("*")
            .eq("id", req.report_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Report not found: {e}")

    report = report_resp.data

    try:
        sales_resp = (
            supabase.table("sales_records")
            .select("*")
            .eq("report_id", req.report_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sales records: {e}")

    rows = sales_resp.data
    if not rows:
        raise HTTPException(status_code=400, detail="No sales records found for this report")

    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    df["total_price"] = pd.to_numeric(df["total_price"], errors="coerce")
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")

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

    df["day_of_week"] = df["date"].dt.day_name()
    revenue_by_dow = df.groupby("day_of_week")["total_price"].sum()
    all_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    revenue_by_day_of_week = {day: round(float(revenue_by_dow.get(day, 0)), 2) for day in all_days}

    stats = {
        "date_range_start": report.get("date_range_start", str(df["date"].min().date())),
        "date_range_end": report.get("date_range_end", str(df["date"].max().date())),
        "total_revenue": float(report.get("total_revenue", 0)),
        "total_orders": int(report.get("total_orders", 0)),
        "avg_order_value": float(report.get("avg_order_value", 0)),
        "peak_day": report.get("peak_day", revenue_by_dow.idxmax()),
        "top_items": top_items,
        "bottom_items": bottom_items,
        "revenue_by_day_of_week": revenue_by_day_of_week,
    }

    try:
        bullets = generate_insights(stats)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        supabase.table("insights").insert({
            "report_id": req.report_id,
            "user_id": req.user_id,
            "bullets": json.dumps(bullets),
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save insights: {e}")

    return {"report_id": req.report_id, "bullets": bullets}


@router.get("/{report_id}")
async def get_insights(report_id: str):
    try:
        resp = (
            supabase.table("insights")
            .select("*")
            .eq("report_id", report_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch insights: {e}")

    if not resp.data:
        return {"report_id": report_id, "bullets": None}

    row = resp.data[0]
    bullets = json.loads(row["bullets"]) if isinstance(row["bullets"], str) else row["bullets"]

    return {
        "report_id": report_id,
        "bullets": bullets,
        "generated_at": row.get("created_at"),
    }
