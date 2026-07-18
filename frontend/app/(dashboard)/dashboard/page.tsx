"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getReports, getSummary, deleteReport } from "@/lib/api";

interface Report {
  id: string;
  filename: string;
  date_range_start: string;
  date_range_end: string;
  total_revenue: number;
  total_orders: number;
}

interface Summary {
  total_reports: number;
  total_orders_analysed: number;
  most_recent_report_date: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredReportId, setHoveredReportId] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/");
          return;
        }

        const email = session.user.email || "";
        const name = session.user.user_metadata?.restaurant_name || email;
        setRestaurantName(name);

        const userId = session.user.id;
        const [summaryData, reportsData] = await Promise.all([
          getSummary(userId),
          getReports(userId),
        ]);

        setSummary(summaryData);
        setReports(reportsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);



  const handleDelete = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    if (confirm("Delete this report? This cannot be undone.")) {
      try {
        await deleteReport(reportId);
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const summaryData = await getSummary(session.user.id);
          setSummary(summaryData);
        }
      } catch (err: any) {
        alert("Failed to delete report: " + (err.message || err));
      }
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

  const recentReports = reports.slice(0, 5);

  return (
    <div style={{ padding: "32px", fontFamily: "inherit" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#0f1117", margin: "0 0 4px 0" }}>
          Dashboard
        </h1>
        <p style={{ color: "#888888", fontSize: "13px", margin: 0 }}>
          {restaurantName ? `Welcome back, ${restaurantName}` : "Welcome back"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "20px 24px",
            border: "0.5px solid #ebebeb",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#888888",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            Total Reports
          </div>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
            {summary?.total_reports || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "20px 24px",
            border: "0.5px solid #ebebeb",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#888888",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            Orders Analysed
          </div>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
            {summary?.total_orders_analysed || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "20px 24px",
            border: "0.5px solid #ebebeb",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#888888",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px",
            }}
          >
            Most Recent Upload
          </div>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
            {formatDate(summary?.most_recent_report_date || null)}
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#0f1117", marginBottom: "16px" }}>
          Recent reports
        </h2>

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
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => router.push(`/dashboard/${report.id}`)}
                onMouseEnter={() => {
                  setHoveredReportId(report.id);
                  setHoveredAction(report.id);
                }}
                onMouseLeave={() => {
                  setHoveredReportId(null);
                  setHoveredAction(null);
                }}
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
                  position: "relative",
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

                {hoveredReportId === report.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                      display: "flex",
                      gap: "6px",
                      zIndex: 10,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "0.5px solid #ef4444",
                        backgroundColor: "white",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {reports.length > 5 && (
              <div style={{ marginTop: "12px" }}>
                <Link
                  href="/reports"
                  style={{
                    color: "#f59e0b",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  View all reports &rarr;
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
