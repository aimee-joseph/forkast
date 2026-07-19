import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query
import pandas as pd
from pydantic import BaseModel
from supabase import create_client, Client

load_dotenv()

_supabase_url = os.getenv("SUPABASE_URL")
_supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not _supabase_url or not _supabase_key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")

supabase: Client = create_client(_supabase_url, _supabase_key)

router = APIRouter()


@router.get("/reports/{user_id}/summary")
async def get_summary(user_id: str):
    try:
        resp = (
            supabase.table("reports")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {e}")

    reports = resp.data
    if not reports:
        return {"total_reports": 0, "total_orders_analysed": 0, "most_recent_report_date": None}

    total_orders_analysed = sum(r.get("total_orders", 0) or 0 for r in reports)
    most_recent_report_date = reports[0].get("created_at")

    return {
        "total_reports": len(reports),
        "total_orders_analysed": total_orders_analysed,
        "most_recent_report_date": most_recent_report_date,
    }


@router.get("/reports/{user_id}")
async def get_reports(user_id: str):
    try:
        resp = (
            supabase.table("reports")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {e}")

    return resp.data


@router.get("/report/{report_id}")
async def get_report(report_id: str):
    try:
        report_resp = (
            supabase.table("reports")
            .select("*")
            .eq("id", report_id)
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
            .eq("report_id", report_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sales records: {e}")

    rows = sales_resp.data
    if not rows:
        return {
            **report,
            "top_items": [],
            "bottom_items": [],
            "revenue_by_day_of_week": {},
            "daily_revenue": [],
        }

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

    daily = (
        df.groupby(df["date"].dt.date)["total_price"]
        .sum()
        .reset_index()
        .rename(columns={"date": "date", "total_price": "revenue"})
        .sort_values("date")
    )
    daily_revenue = [
        {"date": str(row["date"]), "revenue": round(float(row["revenue"]), 2)}
        for _, row in daily.iterrows()
    ]

    return {
        **report,
        "top_items": top_items,
        "bottom_items": bottom_items,
        "revenue_by_day_of_week": revenue_by_day_of_week,
        "daily_revenue": daily_revenue,
    }


@router.delete("/report/{report_id}")
async def delete_report(report_id: str):
    try:
        supabase.table("insights").delete().eq("report_id", report_id).execute()
        supabase.table("sales_records").delete().eq("report_id", report_id).execute()
        resp = supabase.table("reports").delete().eq("id", report_id).execute()
        if not resp.data:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete report: {e}")


class RenameRequest(BaseModel):
    report_name: str


@router.patch("/report/{report_id}/rename")
async def rename_report(report_id: str, req: RenameRequest):
    try:
        resp = (
            supabase.table("reports")
            .update({"report_name": req.report_name})
            .eq("id", report_id)
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=404, detail="Report not found")
        return resp.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rename report: {e}")


def _get_report_compare_data(report_id: str) -> dict:
    try:
        report_resp = (
            supabase.table("reports")
            .select("*")
            .eq("id", report_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found: {e}")

    report = report_resp.data
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found")

    try:
        sales_resp = (
            supabase.table("sales_records")
            .select("*")
            .eq("report_id", report_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sales records for {report_id}: {e}")

    rows = sales_resp.data
    all_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    if not rows:
        return {
            "id": report.get("id"),
            "report_name": report.get("report_name"),
            "filename": report.get("filename"),
            "date_range_start": report.get("date_range_start"),
            "date_range_end": report.get("date_range_end"),
            "total_revenue": 0.0,
            "total_orders": 0,
            "avg_order_value": 0.0,
            "peak_day": "N/A",
            "top_items": [],
            "revenue_by_day_of_week": {day: 0.0 for day in all_days},
        }

    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    df["total_price"] = pd.to_numeric(df["total_price"], errors="coerce")
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")

    total_revenue = round(float(df["total_price"].sum()), 2)
    total_orders = int(df["order_id"].nunique()) if "order_id" in df.columns else 0
    avg_order_value = round(float(total_revenue / total_orders), 2) if total_orders > 0 else 0.0

    df["day_of_week"] = df["date"].dt.day_name()
    revenue_by_dow = df.groupby("day_of_week")["total_price"].sum()
    peak_day = str(revenue_by_dow.idxmax()) if not revenue_by_dow.empty else "N/A"
    revenue_by_day_of_week = {day: round(float(revenue_by_dow.get(day, 0)), 2) for day in all_days}

    item_stats = (
        df.groupby("item_name")
        .agg(total_revenue=("total_price", "sum"), quantity=("quantity", "sum"))
        .reset_index()
        .sort_values("total_revenue", ascending=False)
    )
    top_items = item_stats.head(5).to_dict(orient="records")
    for item in top_items:
        item["total_revenue"] = round(float(item["total_revenue"]), 2)
        item["quantity"] = int(item["quantity"])

    return {
        "id": report.get("id"),
        "report_name": report.get("report_name"),
        "filename": report.get("filename"),
        "date_range_start": report.get("date_range_start"),
        "date_range_end": report.get("date_range_end"),
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "avg_order_value": avg_order_value,
        "peak_day": peak_day,
        "top_items": top_items,
        "revenue_by_day_of_week": revenue_by_day_of_week,
    }


@router.get("/compare")
async def compare_reports(report_a: str = Query(...), report_b: str = Query(...)):
    try:
        data_a = _get_report_compare_data(report_a)
        data_b = _get_report_compare_data(report_b)
        return {
            "report_a": data_a,
            "report_b": data_b,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compare reports: {e}")

