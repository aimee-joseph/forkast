"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getReports, compareReports } from "@/lib/api";
import ComparisonChart from "@/components/ComparisonChart";

interface ReportOption {
  id: string;
  filename: string;
  report_name?: string;
}

interface Item {
  item_name: string;
  total_revenue: number;
  quantity: number;
}

interface CompareReportData {
  id: string;
  filename: string;
  report_name?: string;
  date_range_start: string;
  date_range_end: string;
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  peak_day: string;
  top_items: Item[];
  revenue_by_day_of_week: Record<string, number>;
}

interface ComparisonResponse {
  report_a: CompareReportData;
  report_b: CompareReportData;
}

export default function ComparePage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportOption[]>([]);
  const [reportAId, setReportAId] = useState("");
  const [reportBId, setReportBId] = useState("");
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserReports() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/");
          return;
        }
        const reportsData = await getReports(session.user.id);
        setReports(reportsData);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    fetchUserReports();
  }, [router]);

  const handleCompare = async () => {
    if (!reportAId || !reportBId || reportAId === reportBId) return;
    setComparing(true);
    setError("");
    try {
      const data = await compareReports(reportAId, reportBId);
      setComparisonData(data);
    } catch (err: any) {
      setError(err.message || "Failed to compare reports");
    } finally {
      setComparing(false);
    }
  };

  const formatRevenue = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isButtonDisabled = !reportAId || !reportBId || reportAId === reportBId || comparing;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)",
          color: "var(--text-muted)",
          fontSize: "13px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", fontFamily: "inherit" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
        Compare reports
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 32px 0" }}>
        Select two reports to compare performance
      </p>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#ef4444",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {/* Selector Section */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          padding: "24px",
          border: "0.5px solid var(--border-card)",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Report A
            </label>
            <select
              value={reportAId}
              onChange={(e) => setReportAId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--input-border)",
                fontSize: "13px",
                backgroundColor: "var(--input-bg)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            >
              <option value="">Select a report...</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.report_name || r.filename}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Report B
            </label>
            <select
              value={reportBId}
              onChange={(e) => setReportBId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--input-border)",
                fontSize: "13px",
                backgroundColor: "var(--input-bg)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            >
              <option value="">Select a report...</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.report_name || r.filename}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={isButtonDisabled}
          style={{
            width: "100%",
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: isButtonDisabled ? "not-allowed" : "pointer",
            opacity: isButtonDisabled ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {comparing ? "Comparing..." : "Compare"}
        </button>
      </div>

      {/* Results Section */}
      {comparisonData && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header comparison banners */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                padding: "16px 20px",
                border: "0.5px solid var(--border-card)",
                borderLeft: "4px solid #f59e0b",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "4px",
                }}
              >
                Report A
              </div>
              <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                {comparisonData.report_a.report_name || comparisonData.report_a.filename}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                {comparisonData.report_a.date_range_start} to {comparisonData.report_a.date_range_end}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                padding: "16px 20px",
                border: "0.5px solid var(--border-card)",
                borderLeft: "4px solid #94a3b8",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "4px",
                }}
              >
                Report B
              </div>
              <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                {comparisonData.report_b.report_name || comparisonData.report_b.filename}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                {comparisonData.report_b.date_range_start} to {comparisonData.report_b.date_range_end}
              </div>
            </div>
          </div>

          {/* Key Metrics Comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "10px",
                padding: "16px 20px",
                border: "0.5px solid var(--border-card)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "12px",
                }}
              >
                Total Revenue
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>A</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {formatRevenue(comparisonData.report_a.total_revenue)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>B</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {formatRevenue(comparisonData.report_b.total_revenue)}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "10px",
                padding: "16px 20px",
                border: "0.5px solid var(--border-card)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "12px",
                }}
              >
                Total Orders
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>A</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {comparisonData.report_a.total_orders}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>B</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {comparisonData.report_b.total_orders}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "10px",
                padding: "16px 20px",
                border: "0.5px solid var(--border-card)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "12px",
                }}
              >
                Avg Order Value
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>A</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {formatRevenue(comparisonData.report_a.avg_order_value)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>B</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {formatRevenue(comparisonData.report_b.avg_order_value)}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "10px",
                padding: "16px 20px",
                border: "0.5px solid var(--border-card)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "12px",
                }}
              >
                Peak Day
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>A</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {comparisonData.report_a.peak_day}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>B</span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {comparisonData.report_b.peak_day}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Chart Card */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              padding: "20px 24px",
              border: "0.5px solid var(--border-card)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              Revenue Comparison by Day of Week
            </div>
            <ComparisonChart
              dataA={comparisonData.report_a.revenue_by_day_of_week}
              dataB={comparisonData.report_b.revenue_by_day_of_week}
              labelA={comparisonData.report_a.report_name || comparisonData.report_a.filename}
              labelB={comparisonData.report_b.report_name || comparisonData.report_b.filename}
            />
          </div>

          {/* Top Items Side-by-Side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                padding: "20px 24px",
                border: "0.5px solid var(--border-card)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "16px",
                }}
              >
                Top Items - {comparisonData.report_a.report_name || comparisonData.report_a.filename}
              </div>
              {comparisonData.report_a.top_items.length === 0 ? (
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No item data</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {comparisonData.report_a.top_items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {index + 1}. {item.item_name}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                          {formatRevenue(item.total_revenue)}
                        </span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "6px", fontSize: "11px" }}>
                          ({item.quantity} sold)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                padding: "20px 24px",
                border: "0.5px solid var(--border-card)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "16px",
                }}
              >
                Top Items - {comparisonData.report_b.report_name || comparisonData.report_b.filename}
              </div>
              {comparisonData.report_b.top_items.length === 0 ? (
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No item data</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {comparisonData.report_b.top_items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {index + 1}. {item.item_name}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                          {formatRevenue(item.total_revenue)}
                        </span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "6px", fontSize: "11px" }}>
                          ({item.quantity} sold)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
