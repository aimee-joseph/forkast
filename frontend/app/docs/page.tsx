"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f2f2f0",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "48px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          width: "100%",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#d98a5f",
            fontSize: "13px",
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-block",
            marginBottom: "32px",
          }}
        >
          &larr; Back to home
        </Link>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "#d98a5f",
            marginBottom: "8px",
          }}
        >
          DOCUMENTATION
        </div>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "40px",
            color: "#f2f2f0",
            marginBottom: "12px",
          }}
        >
          Using Forkast
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "48px",
            lineHeight: 1.6,
          }}
        >
          Everything you need to know about exporting POS data, mapping CSV columns, and interpreting AI-generated sales insights.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Section 1: Quickstart */}
          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#d98a5f",
                marginBottom: "8px",
              }}
            >
              01 — QUICKSTART
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#f2f2f0", margin: "0 0 12px 0" }}>
              How Forkast Works
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
              Forkast transforms raw Point-of-Sale (POS) order logs into actionable restaurant intelligence in three simple steps:
            </p>
            <ol
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                marginTop: "12px",
                marginBottom: 0,
                paddingLeft: "20px",
              }}
            >
              <li><strong>Upload CSV:</strong> Export itemized sales records from your POS system.</li>
              <li><strong>Map Columns:</strong> Identify which columns correspond to Date, Item Name, Quantity, and Price.</li>
              <li><strong>Analyze Report:</strong> Instant revenue charts, dish rankings, and AI action items are generated.</li>
            </ol>
          </div>

          {/* Section 2: Supported POS Systems */}
          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#d98a5f",
                marginBottom: "8px",
              }}
            >
              02 — COMPATIBILITY
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#f2f2f0", margin: "0 0 12px 0" }}>
              Supported POS Systems
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              Forkast requires no custom API integration or IT setup. It accepts itemized CSV or Excel exports from major POS platforms:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
                <strong style={{ color: "#f2f2f0" }}>Petpooja &amp; Posist</strong> — Standard item sales exports
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
                <strong style={{ color: "#f2f2f0" }}>Square &amp; Toast</strong> — Itemized sales reports
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
                <strong style={{ color: "#f2f2f0" }}>Custom Spreadsheets</strong> — Any CSV containing sales order history
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
                <strong style={{ color: "#f2f2f0" }}>Third-party Aggregators</strong> — Zomato / Swiggy order export logs
              </div>
            </div>
          </div>

          {/* Section 3: Column Mapping */}
          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#d98a5f",
                marginBottom: "8px",
              }}
            >
              03 — DATA STRUCTURE
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#f2f2f0", margin: "0 0 12px 0" }}>
              Column Mapping Guide
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              When uploading a new file format, Forkast prompts you to map key fields once. The layout is saved for future uploads:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ padding: "10px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#d98a5f", fontFamily: "monospace" }}>Date / Time</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Date order was placed (e.g. 2024-11-15 14:30)</span>
              </div>
              <div style={{ padding: "10px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#d98a5f", fontFamily: "monospace" }}>Item Name</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Menu item description (e.g. Butter Chicken)</span>
              </div>
              <div style={{ padding: "10px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#d98a5f", fontFamily: "monospace" }}>Quantity</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Number of units sold</span>
              </div>
              <div style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#d98a5f", fontFamily: "monospace" }}>Total / Unit Price</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Monetary revenue amount</span>
              </div>
            </div>
          </div>

          {/* Section 4: Key Insights */}
          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#d98a5f",
                marginBottom: "8px",
              }}
            >
              04 — FEATURES
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#f2f2f0", margin: "0 0 12px 0" }}>
              Key Analytics Features
            </h2>
            <ul style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
              <li><strong>Menu Engineering:</strong> Categorizes items by volume and revenue contribution.</li>
              <li><strong>Day-of-Week Trends:</strong> Highlights slow days and peak volume shifts.</li>
              <li><strong>Period Comparison:</strong> Compare any two reports side-by-side to track progress.</li>
              <li><strong>AI Executive Summary:</strong> Groq-powered narrative recommendations for boosting margins.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
