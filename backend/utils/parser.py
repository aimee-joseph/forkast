from io import BytesIO

import pandas as pd

STANDARD_COLUMNS = ["date", "item_name", "quantity", "unit_price", "total_price", "order_id"]


def get_column_preview(file_bytes: bytes) -> dict:
    try:
        df = pd.read_csv(BytesIO(file_bytes), nrows=3)
    except Exception as e:
        raise ValueError(f"Failed to read CSV: {e}")

    return {
        "columns": df.columns.tolist(),
        "preview": df.fillna("").to_dict(orient="records"),
    }


def parse_csv(file_bytes: bytes, column_map: dict) -> list[dict]:
    missing = [col for col in STANDARD_COLUMNS if col not in column_map]
    if missing:
        raise ValueError(f"Missing mappings for: {', '.join(missing)}")

    try:
        df = pd.read_csv(BytesIO(file_bytes))
    except Exception as e:
        raise ValueError(f"Failed to read CSV: {e}")

    missing_in_file = [v for v in column_map.values() if v not in df.columns]
    if missing_in_file:
        raise ValueError(f"Columns not found in CSV: {', '.join(missing_in_file)}")

    df = df.rename(columns={v: k for k, v in column_map.items()})
    df = df[STANDARD_COLUMNS]

    df["date"] = _parse_dates(df["date"])
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").astype("Int64")
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce")
    df["total_price"] = pd.to_numeric(df["total_price"], errors="coerce")
    df["order_id"] = df["order_id"].astype(str)

    df = df.dropna(subset=["date", "item_name", "total_price"])

    return df.to_dict(orient="records")


def _parse_dates(series: pd.Series) -> pd.Series:
    for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%m/%d/%Y"):
        parsed = pd.to_datetime(series, format=fmt, errors="coerce")
        if parsed.notna().sum() > len(series) * 0.5:
            return parsed

    return pd.to_datetime(series, dayfirst=True, errors="coerce")
