"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getReports } from "@/lib/api";

interface Report {
  id: string;
  filename: string;
  date_range_start: string;
  date_range_end: string;
  total_revenue: number;
  total_orders: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredReportId, setHoveredReportId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/");
          return;
        }

        const userId = session.user.id;
        const reportsData = await getReports(userId);
        setReports(reportsData);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [router]);

  const formatRevenue = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)",
          color: "rgba(0, 0, 0, 0.4)",
          fontSize: "13px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", fontFamily: "inherit" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#0f1117", margin: "0 0 4px 0" }}>
            Reports
          </h1>
          <p style={{ color: "#888888", fontSize: "13px", margin: 0 }}>
            All your uploaded reports
          </p>
        </div>

        <Link
          href="/upload"
          style={{
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          Upload new
        </Link>
      </div>

      <div>
        {reports.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "48px",
              border: "0.5px solid #ebebeb",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#888888", fontSize: "14px", margin: "0 0 20px 0" }}>
              No reports yet. Upload your first CSV to get started.
            </p>
            <Link
              href="/upload"
              style={{
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                border: "none",
                padding: "11px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              Upload data
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => router.push(`/dashboard/${report.id}`)}
                onMouseEnter={() => setHoveredReportId(report.id)}
                onMouseLeave={() => setHoveredReportId(null)}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  border: `0.5px solid ${hoveredReportId === report.id ? "#f59e0b" : "#ebebeb"}`,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "border-color 0.2s",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", color: "#0f1117", fontWeight: 500, marginBottom: "4px" }}>
                    {report.filename}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888888" }}>
                    {report.date_range_start} to {report.date_range_end}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", color: "#0f1117", fontWeight: 500, marginBottom: "4px" }}>
                    {formatRevenue(report.total_revenue)}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888888" }}>
                    {report.total_orders} orders
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
