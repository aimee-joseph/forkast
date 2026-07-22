"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getReport, getInsights, generateInsights, renameReport } from "@/lib/api";
import RevenueChart from "@/components/RevenueChart";
import DayOfWeekChart from "@/components/DayOfWeekChart";
import MenuPerformance from "@/components/MenuPerformance";
import AIInsights from "@/components/AIInsights";
import { exportReportPDF } from "@/lib/exportPDF";
import { Pencil, Check, X } from "lucide-react";

interface Item {
  item_name: string;
  total_revenue: number;
  quantity: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface Report {
  id: string;
  filename: string;
  report_name?: string;
  date_range_start: string;
  date_range_end: string;
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  peak_day: string;
  daily_revenue: DailyRevenue[];
  top_items: Item[];
  bottom_items: Item[];
  revenue_by_day_of_week: Record<string, number>;
}

interface Insights {
  report_id: string;
  bullets: string[] | null;
  generated_at?: string;
}

export default function ReportDashboard() {
  const { report_id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [isPencilHovered, setIsPencilHovered] = useState(false);

  const reportIdStr = (Array.isArray(report_id) ? report_id[0] : report_id) ?? "";

  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/");
          return;
        }
        setUserId(session.user.id);

        const [reportData, insightsData] = await Promise.all([
          getReport(reportIdStr),
          getInsights(reportIdStr),
        ]);

        setReport(reportData);
        setInsights(insightsData);
      } catch (err: any) {
        setError(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [reportIdStr, router]);

  const handleGenerateInsights = async () => {
    if (!userId || !reportIdStr) return;
    setGenerating(true);
    setError("");

    try {
      await generateInsights(reportIdStr, userId);
      const updatedInsights = await getInsights(reportIdStr);
      setInsights(updatedInsights);
    } catch (err: any) {
      setError(err.message || "Failed to generate insights");
    } finally {
      setGenerating(false);
    }
  };

  const handleRenameSave = async () => {
    if (!editedName.trim() || !reportIdStr) return;
    setSavingName(true);
    try {
      await renameReport(reportIdStr, editedName.trim());
      setReport((prev) => (prev ? { ...prev, report_name: editedName.trim() } : prev));
      setIsEditingName(false);
    } catch (err: any) {
      setError(err.message || "Failed to rename report");
    } finally {
      setSavingName(false);
    }
  };

  const handleExport = async () => {
    if (!report) return;
    setExporting(true);
    try {
      await exportReportPDF(
        "report-export-area",
        `forkast-${(report.report_name || report.filename).replace(".csv", "")}-report.pdf`
      );
    } catch (err: any) {
      setError(err.message || "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!report || loading) return;
    const shouldExport = searchParams.get("export") === "true";
    if (shouldExport) {
      const timer = setTimeout(async () => {
        await handleExport();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [report, loading]);

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

  if (error || !report) {
    return (
      <div style={{ padding: "32px" }}>
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#ef4444",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {error || "Report not found"}
        </div>
      </div>
    );
  }

  const hasInsights = insights && insights.bullets && insights.bullets.length > 0;

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
          {!isEditingName ? (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#0f1117", margin: 0 }}>
                {report.report_name || report.filename}
              </h1>
              <button
                onClick={() => {
                  setIsEditingName(true);
                  setEditedName(report.report_name || report.filename);
                }}
                onMouseEnter={() => setIsPencilHovered(true)}
                onMouseLeave={() => setIsPencilHovered(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: isPencilHovered ? "#555555" : "#aaaaaa",
                  cursor: "pointer",
                  padding: "4px",
                  marginLeft: "6px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Pencil size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSave();
                  else if (e.key === "Escape") setIsEditingName(false);
                }}
                style={{
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#0f1117",
                  border: "none",
                  borderBottom: "1.5px solid #f59e0b",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "inherit",
                  minWidth: "200px",
                }}
                autoFocus
              />
              <button
                onClick={handleRenameSave}
                disabled={savingName}
                style={{
                  background: "none",
                  border: "none",
                  color: "#22c55e",
                  cursor: savingName ? "not-allowed" : "pointer",
                  opacity: savingName ? 0.5 : 1,
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
          <p style={{ color: "#888888", fontSize: "13px", margin: 0 }}>
            {report.date_range_start} to {report.date_range_end} &bull; {report.total_orders} orders
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              border: "0.5px solid #e5e5e5",
              backgroundColor: "#ffffff",
              color: "#555555",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: exporting ? "not-allowed" : "pointer",
              opacity: exporting ? 0.7 : 1,
            }}
          >
            {exporting ? "Exporting..." : "Export"}
          </button>
          <button
            onClick={handleGenerateInsights}
            disabled={generating}
            style={{
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: generating ? "not-allowed" : "pointer",
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating
              ? "Generating..."
              : hasInsights
              ? "Regenerate insights"
              : "Generate insights"}
          </button>
        </div>
      </div>

      <div id="report-export-area">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "32px",
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
              Total Revenue
            </div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
              {formatRevenue(report.total_revenue)}
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
              Total Orders
            </div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
              {report.total_orders}
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
              Avg Order Value
            </div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
              {formatRevenue(report.avg_order_value)}
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
              Peak Day
            </div>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#0f1117" }}>
              {report.peak_day}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px 24px",
              border: "0.5px solid #ebebeb",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#888888",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              Daily Revenue
            </div>
            <RevenueChart data={report.daily_revenue} />
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px 24px",
              border: "0.5px solid #ebebeb",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#888888",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              Revenue by Day of Week
            </div>
            <DayOfWeekChart data={report.revenue_by_day_of_week} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px 24px",
              border: "0.5px solid #ebebeb",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#888888",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              Menu Performance
            </div>
            <MenuPerformance 
              topItems={report.top_items} 
              bottomItems={report.bottom_items}
              totalRevenue={report.total_revenue}
            />
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px 24px",
              border: "0.5px solid #ebebeb",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#888888",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              AI Insights
            </div>
            <AIInsights bullets={insights?.bullets ?? null} />
          </div>
        </div>
      </div>
    </div>
  );
}
