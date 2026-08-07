"use client";

import Link from "next/link";

export default function Home() {
  const scrollToComparison = () => {
    document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f2f2f0",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 48px",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontSize: "15px", fontWeight: 500, color: "#f2f2f0" }}>
          Forkast
        </div>

        <div style={{ display: "flex", gap: "28px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
          <span>Product</span>
          <span>Pricing</span>
          <span>Docs</span>
        </div>

        <Link
          href="/login"
          style={{
            backgroundColor: "#d98a5f",
            color: "#2c1608",
            fontSize: "13px",
            fontWeight: 500,
            padding: "7px 16px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Start free
        </Link>
      </nav>

      <section style={{ padding: "80px 48px 60px" }}>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "52px",
            lineHeight: 1.15,
            color: "#f2f2f0",
            maxWidth: "620px",
            margin: 0,
          }}
        >
          Your sales data is{" "}
          <em style={{ fontStyle: "italic", color: "#d98a5f" }}>talking</em>. Most
          owners never hear it.
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "440px",
            lineHeight: 1.6,
            marginTop: "20px",
            marginBottom: "28px",
          }}
        >
          Upload a CSV from your POS. Forkast reads every order, finds the
          patterns, and tells you what to do about them — in minutes, not
          spreadsheets.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <Link
            href="/login"
            style={{
              backgroundColor: "#d98a5f",
              color: "#2c1608",
              fontSize: "14px",
              fontWeight: 500,
              padding: "11px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Start free &rarr;
          </Link>

          <button
            onClick={scrollToComparison}
            style={{
              border: "0.5px solid rgba(255,255,255,0.15)",
              color: "#f2f2f0",
              fontSize: "14px",
              padding: "11px 20px",
              borderRadius: "8px",
              fontFamily: "monospace",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            &gt;_ See a sample report
          </button>
        </div>

        <div style={{ fontSize: "12px", color: "#d98a5f" }}>
          &#x2198; free forever for your first 3 reports
        </div>
      </section>

      <section id="comparison" style={{ padding: "0 48px 80px" }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "#d98a5f",
            marginBottom: "12px",
            marginTop: "20px",
          }}
        >
          01 — WHAT CHANGES
        </div>

        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            color: "#f2f2f0",
            maxWidth: "520px",
            marginBottom: "24px",
            marginTop: 0,
          }}
        >
          A spreadsheet tells you what happened. Forkast tells you what to do.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#f2f2f0" }}>
                Spreadsheets
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                manual
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Revenue this month</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                ₹15,98,967
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Top dish</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                unclear
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Slow day pattern</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                not tracked
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
              }}
            >
              <span>Action to take</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                —
              </strong>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(217,138,95,0.3)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#d98a5f",
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#d98a5f" }}>
                Forkast
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#d98a5f",
                  border: "0.5px solid rgba(217,138,95,0.3)",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                automatic
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Revenue this month</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                ₹15,98,967
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Top dish</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                Butter Chicken · 14%
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Slow day pattern</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                Mondays −68%
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                padding: "6px 0",
              }}
            >
              <span>Action to take</span>
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                weekday combo deal
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 48px 80px" }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "#d98a5f",
            marginBottom: "12px",
            marginTop: "20px",
          }}
        >
          02 — HOW IT WORKS
        </div>

        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            color: "#f2f2f0",
            maxWidth: "560px",
            marginBottom: "16px",
            marginTop: "20px",
          }}
        >
          From CSV to decision in three steps.
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "480px",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          No POS integration, no IT setup. Export what you already have and upload it.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "14px",
          }}
        >
          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#d98a5f",
                marginBottom: "16px",
              }}
            >
              01
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              Upload your CSV
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              Export sales data from your POS — Petpooja, Posist, or a plain spreadsheet all work.
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#d98a5f",
                marginBottom: "16px",
              }}
            >
              02
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              Map your columns
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              Tell Forkast which column is what, once. It remembers the pattern for every future upload.
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#d98a5f",
                marginBottom: "16px",
              }}
            >
              03
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              Get your insights
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              Revenue trends, menu performance, and AI-generated recommendations — ready in under a minute.
            </div>
          </div>
        </div>

        <div style={{ marginTop: "60px" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "#d98a5f",
            }}
          >
            03 — FEATURES
          </div>

          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "32px",
              color: "#f2f2f0",
              marginTop: "20px",
              marginBottom: "32px",
              maxWidth: "500px",
            }}
          >
            Built for how restaurants actually think.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "12px",
            }}
          >
            <div
              style={{
                backgroundColor: "#111111",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#f2f2f0",
                  marginBottom: "6px",
                }}
              >
                Menu engineering
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                See which dishes earn their place on the menu, not just which sell most.
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#111111",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#f2f2f0",
                  marginBottom: "6px",
                }}
              >
                Period comparison
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                Put any two reports side by side and see exactly what shifted.
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#111111",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#f2f2f0",
                  marginBottom: "6px",
                }}
              >
                PDF export
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                Turn any report into a clean, shareable document in one click.
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#111111",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#f2f2f0",
                  marginBottom: "6px",
                }}
              >
                Dark mode, always
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                Built dark first, because most restaurant owners check numbers late at night.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 48px 60px", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "40px",
            lineHeight: 1.2,
            color: "#f2f2f0",
            margin: 0,
          }}
        >
          Stop guessing.
          <br />
          Start knowing.
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "16px",
            marginBottom: "32px",
          }}
        >
          Free for your first 3 reports. No credit card required.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Link
            href="/login"
            style={{
              backgroundColor: "#d98a5f",
              color: "#2c1608",
              fontSize: "14px",
              fontWeight: 500,
              padding: "11px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Start free &rarr;
          </Link>

          <button
            style={{
              border: "0.5px solid rgba(255,255,255,0.15)",
              color: "#f2f2f0",
              fontSize: "14px",
              padding: "11px 20px",
              borderRadius: "8px",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            Read the docs
          </button>
        </div>
      </section>

      <footer
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          padding: "40px 48px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginBottom: "8px",
              }}
            >
              Forkast
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.5,
                maxWidth: "220px",
              }}
            >
              Restaurant analytics, made simple.
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "12px",
              }}
            >
              PRODUCT
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Features
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Pricing
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Changelog
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "12px",
              }}
            >
              COMPANY
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              About
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Blog
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Contact
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "12px",
              }}
            >
              LEGAL
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Privacy
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
              Terms
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          <div>© 2026 Forkast. All rights reserved.</div>
          <div>Made with Antigravity</div>
        </div>
      </footer>
    </div>
  );
}
