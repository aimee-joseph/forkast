"use client";

import Link from "next/link";

export default function PrivacyPage() {
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
          maxWidth: "680px",
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

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            color: "#f2f2f0",
            marginBottom: "8px",
          }}
        >
          Privacy Policy
        </h1>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "40px",
          }}
        >
          Last updated: February 2026
        </p>

        <div
          style={{
            backgroundColor: "#111111",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
          }}
        >
          <section>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              1. Overview
            </h2>
            <p style={{ margin: 0 }}>
              Forkast is built as an open, developer side-project designed to help restaurant owners analyze POS sales CSV exports. We prioritize user privacy and minimum data retention.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              2. Data Collection & Processing
            </h2>
            <p style={{ margin: 0 }}>
              When you upload a sales CSV file, it is processed securely to calculate operational metrics, item popularity, and revenue trends. Your raw sales data is stored securely in association with your account and is never sold, leased, or shared with third parties.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              3. Account Information
            </h2>
            <p style={{ margin: 0 }}>
              We collect your email address and restaurant name upon account creation for authentication purposes via Supabase Auth.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              4. Third-Party Services
            </h2>
            <p style={{ margin: 0 }}>
              Forkast utilizes AI language models (via Groq) to generate sales recommendations. Only aggregated metrics (e.g. peak hours, top menu categories) are processed; individual personal identifiers are not submitted to third-party model endpoints.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
