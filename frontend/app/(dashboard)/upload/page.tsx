"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { previewCSV, processCSV } from "@/lib/api";

const STANDARD_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "item_name", label: "Item Name" },
  { key: "quantity", label: "Quantity" },
  { key: "unit_price", label: "Unit Price" },
  { key: "total_price", label: "Total Price" },
  { key: "order_id", label: "Order ID" },
];

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, any>[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({
    date: "",
    item_name: "",
    quantity: "",
    unit_price: "",
    total_price: "",
    order_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    async function getUserId() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login");
        return;
      }
      setUserId(session.user.id);
    }
    getUserId();
  }, [router]);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setError("");
    setLoading(true);

    try {
      const data = await previewCSV(selectedFile);
      setCsvColumns(data.columns);
      setPreviewRows(data.preview);

      const newMap: Record<string, string> = {};
      STANDARD_COLUMNS.forEach((col) => {
        const exactMatch = data.columns.find(
          (c) => c.toLowerCase() === col.label.toLowerCase() || c.toLowerCase() === col.key.toLowerCase()
        );
        newMap[col.key] = exactMatch || "";
      });
      setColumnMap(newMap);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to load CSV preview");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleMapChange = (key: string, value: string) => {
    setColumnMap((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProcess = async () => {
    if (!file || !userId) return;

    const unmapped = Object.entries(columnMap).filter(([_, val]) => !val);
    if (unmapped.length > 0) {
      setError("Please map all standard columns before processing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await processCSV(file, columnMap, userId);
      router.push(`/dashboard/${result.report_id}`);
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px", fontFamily: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
            Upload data
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
            Import your POS export to generate insights
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "13px", fontWeight: 500 }}>
          <span style={{ color: step === 1 ? "#f59e0b" : isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>1. Upload file</span>
          <span style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)" }}>&rarr;</span>
          <span style={{ color: step === 2 ? "#f59e0b" : isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>2. Map columns</span>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#ef4444",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {step === 1 && (
        <div>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={handleSelectClick}
            style={{
              border: `2px dashed ${dragOver ? "#f59e0b" : "var(--input-border)"}`,
              borderRadius: "12px",
              padding: "48px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "var(--bg-card)",
              transition: "border-color 0.2s",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              style={{ display: "none" }}
            />
            <p style={{ color: "var(--text-primary)", fontSize: "15px", fontWeight: 500, margin: "0 0 4px 0" }}>
              {loading ? "Reading file..." : "Drag and drop your CSV file here"}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
              or click to browse from your computer
            </p>
          </div>
        </div>
      )}

      {step === 2 && file && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
                CSV Preview: {file.name}
              </h2>
              <button
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setPreviewRows([]);
                  setCsvColumns([]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Change file
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-page)" }}>
                    {csvColumns.map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          borderBottom: "1px solid var(--border-subtle)",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, idx) => (
                    <tr key={idx}>
                      {csvColumns.map((col) => (
                        <td
                          key={col}
                          style={{
                            padding: "8px 12px",
                            color: "var(--text-primary)",
                            borderBottom: "1px solid var(--border-subtle)",
                          }}
                        >
                          {row[col] !== undefined ? String(row[col]) : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "16px" }}>
              Map CSV columns to standard fields
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {STANDARD_COLUMNS.map((col) => (
                <div key={col.key} style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: 500,
                      marginBottom: "6px",
                    }}
                  >
                    {col.label}
                  </label>
                  <select
                    value={columnMap[col.key]}
                    onChange={(e) => handleMapChange(col.key, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "var(--input-border)"}`,
                      fontSize: "13px",
                      backgroundColor: isDark ? "#2a2d36" : "var(--bg-card)",
                      color: isDark ? "#f0f0f0" : "var(--text-primary)",
                      outline: "none",
                    }}
                  >
                    <option value="">Select CSV Column...</option>
                    {csvColumns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={handleProcess}
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                border: "none",
                padding: "11px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Processing..." : "Process file"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
