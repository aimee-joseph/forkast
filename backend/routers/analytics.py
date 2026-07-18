import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
import pandas as pd
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
        return {"total_reports": 0, "combined_total_revenue": 0.0, "most_recent_report_date": None}

    combined_total_revenue = round(sum(r.get("total_revenue", 0) or 0 for r in reports), 2)
    most_recent_report_date = reports[0].get("created_at")

    return {
        "total_reports": len(reports),
        "combined_total_revenue": combined_total_revenue,
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

