"use client";

interface MenuItem {
  item_name: string;
  total_revenue: number;
  quantity: number;
}

interface MenuPerformanceProps {
  topItems: MenuItem[];
  bottomItems: MenuItem[];
}

export default function MenuPerformance({
  topItems,
  bottomItems,
}: MenuPerformanceProps) {
  const s1Items = topItems.slice(0, 5);
  const s2Items = bottomItems;

  const maxRevenueS1 = Math.max(...s1Items.map((i) => i.total_revenue), 1);
  const maxRevenueS2 = Math.max(...s2Items.map((i) => i.total_revenue), 1);

  const formatValue = (val: number) => {
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  const renderSection = (
    title: string,
    items: MenuItem[],
    maxRevenue: number,
    fillColor: string
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
            const widthPct = Math.min(
              100,
              Math.max(0, (item.total_revenue / maxRevenue) * 100)
            );
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
                  {formatValue(item.total_revenue)}
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
      {renderSection("Top items", s1Items, maxRevenueS1, "#f59e0b")}
      <div
        style={{
          borderBottom: "1px solid #f0f0f0",
          margin: "16px 0",
        }}
      />
      {renderSection("Slow movers", s2Items, maxRevenueS2, "#e5e5e5")}
    </div>
  );
}
