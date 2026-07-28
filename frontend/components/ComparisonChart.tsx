"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

interface ComparisonChartProps {
  dataA: Record<string, number>;
  dataB: Record<string, number>;
  labelA: string;
  labelB: string;
}

const DAYS_MAP = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
];

export default function ComparisonChart({
  dataA,
  dataB,
  labelA,
  labelB,
}: ComparisonChartProps) {
  const chartData = DAYS_MAP.map(({ full, short }) => ({
    day: short,
    a: dataA[full] ?? dataA[short] ?? 0,
    b: dataB[full] ?? dataB[short] ?? 0,
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${Math.round(value / 1000)}k`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "var(--menu-bg)",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)",
            padding: "8px 12px",
            fontSize: "13px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              style={{ color: "var(--text-primary)", fontWeight: 500, margin: "2px 0" }}
            >
              <span style={{ color: entry.color }}>{entry.name}</span>: ₹
              {Number(entry.value).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            dataKey="a"
            name={labelA}
            fill="#f59e0b"
            radius={[3, 3, 0, 0]}
            barSize={10}
          />
          <Bar
            dataKey="b"
            name={labelB}
            fill="#94a3b8"
            radius={[3, 3, 0, 0]}
            barSize={10}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
