"use client";

import { useState } from "react";

interface MenuItem {
  item_name: string;
  total_revenue: number;
  quantity: number;
}

interface MenuPerformanceProps {
  topItems: MenuItem[];
  bottomItems: MenuItem[];
  totalRevenue: number;
}

export default function MenuPerformance({
  topItems,
  bottomItems,
  totalRevenue,
}: MenuPerformanceProps) {
  const [viewMode, setViewMode] = useState<"revenue" | "percent">("revenue");

  const s1Items = topItems.slice(0, 5);
  const s2Items = bottomItems;

  const allItems = [...s1Items, ...s2Items];
  const sharedMax = Math.max(...allItems.map((i) => i.total_revenue), 1);

  const formatValue = (val: number) => {
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  const renderSection = (
    title: string,
    items: MenuItem[],
    maxRevenue: number,
    fillColor: string,
    viewMode: "revenue" | "percent",
    totalRevenue: number
  ) => {
    return (
      <div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 500,
            color: "#888888",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item, idx) => {
            const widthPct =
              viewMode === "percent"
                ? (item.total_revenue / totalRevenue) * 100
                : Math.min(
                    100,
                    Math.max(0, (item.total_revenue / maxRevenue) * 100)
                  );
            const valueLabel =
              viewMode === "percent"
                ? ((item.total_revenue / totalRevenue) * 100).toFixed(1) + "%"
                : formatValue(item.total_revenue);

            return (
              <div
                key={`${item.item_name}-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  height: "20px",
                }}
              >
                <div
                  title={item.item_name}
                  style={{
                    fontSize: "12px",
                    color: "#0f1117",
                    fontWeight: 500,
                    maxWidth: "140px",
                    minWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.item_name}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "6px",
                    backgroundColor: "#f0ede8",
                    borderRadius: "3px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${widthPct}%`,
                      backgroundColor: fillColor,
                      borderRadius: "3px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#888888",
                    textAlign: "right",
                    minWidth: "64px",
                  }}
                >
                  {valueLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        <button
          onClick={() => setViewMode("revenue")}
          style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
            backgroundColor: viewMode === "revenue" ? "#f59e0b" : "transparent",
            color: viewMode === "revenue" ? "#ffffff" : "#888888",
            border: viewMode === "revenue" ? "none" : "0.5px solid #e5e5e5",
          }}
        >
          ₹ Revenue
        </button>
        <button
          onClick={() => setViewMode("percent")}
          style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
            backgroundColor: viewMode === "percent" ? "#f59e0b" : "transparent",
            color: viewMode === "percent" ? "#ffffff" : "#888888",
            border: viewMode === "percent" ? "none" : "0.5px solid #e5e5e5",
          }}
        >
          % Share
        </button>
      </div>
      {renderSection(
        "Top items",
        s1Items,
        sharedMax,
        "#f59e0b",
        viewMode,
        totalRevenue
      )}
      <div
        style={{
          borderBottom: "1px solid #f0f0f0",
          margin: "16px 0",
        }}
      />
      {renderSection(
        "Slow movers",
        s2Items,
        sharedMax,
        "#94a3b8",
        viewMode,
        totalRevenue
      )}
    </div>
  );
}
