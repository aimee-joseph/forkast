import os
import re

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    raise RuntimeError("GEMINI_API_KEY not set in environment")

genai.configure(api_key=_api_key)
_model = genai.GenerativeModel("gemini-1.5-flash")


def generate_insights(stats: dict) -> list[str]:
    prompt = (
        "You are a restaurant business analyst. "
        "Given the following sales data, provide exactly 4 short, specific, actionable "
        "bullet points for the restaurant owner. "
        "Plain text only, no markdown, no preamble, no numbering. "
        "Use a dash (-) to start each bullet.\n\n"
        f"Date range: {stats['date_range_start']} to {stats['date_range_end']}\n"
        f"Total revenue: ₹{stats['total_revenue']:,.2f}\n"
        f"Total orders: {stats['total_orders']}\n"
        f"Average order value: ₹{stats['avg_order_value']:,.2f}\n"
        f"Peak day: {stats['peak_day']}\n\n"
        "Top selling items:\n"
        + "\n".join(
            f"  - {item['item_name']}: ₹{item['total_revenue']:,.2f} "
            f"({item['quantity']} sold)"
            for item in stats["top_items"]
        )
        + "\n\nBottom selling items:\n"
        + "\n".join(
            f"  - {item['item_name']}: ₹{item['total_revenue']:,.2f} "
            f"({item['quantity']} sold)"
            for item in stats["bottom_items"]
        )
        + "\n\nRevenue by day of week:\n"
        + "\n".join(
            f"  - {day}: ₹{rev:,.2f}"
            for day, rev in stats["revenue_by_day_of_week"].items()
        )
    )

    try:
        response = _model.generate_content(prompt)
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {e}")

    if not response.text:
        raise RuntimeError("Gemini returned an empty response")

    lines = [
        re.sub(r"^[\s\-\d.*•]+", "", line).strip()
        for line in response.text.strip().splitlines()
        if line.strip()
    ]

    return lines[:4]
