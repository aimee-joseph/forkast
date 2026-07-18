"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface DayOfWeekChartProps {
  data: Record<string, number>;
}

const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  const chartData = DAYS_ORDER.map((day) => ({
    day,
    revenue: data[day] || 0,
  }));

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { day, revenue } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            padding: "8px 12px",
            fontSize: "13px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ color: "#888888", marginBottom: "4px" }}>{day}</div>
          <div style={{ color: "#0f1117", fontWeight: 500 }}>
            Revenue: ₹
            {revenue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="day"
            tick={{ fontSize: 11, fill: "#888888" }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={10}>
            {chartData.map((entry, index) => {
              const isPeak = entry.revenue === maxRevenue && maxRevenue > 0;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isPeak ? "#f59e0b" : "#f0ede8"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
