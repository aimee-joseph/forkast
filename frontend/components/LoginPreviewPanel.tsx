"use client";

import { motion } from "framer-motion";

export default function LoginPreviewPanel() {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#111111",
        position: "relative",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderLeft: "0.5px solid rgba(255,255,255,0.08)",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "26px",
          lineHeight: 1.4,
          color: "#f2f2f0",
          maxWidth: "420px",
          width: "100%",
          marginBottom: "40px",
          textAlign: "left",
        }}
      >
        The data was always there. Nobody was{" "}
        <span style={{ fontStyle: "italic", color: "#d98a5f" }}>reading</span> it.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          backgroundColor: "#0a0a0a",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "16px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            Jul–Dec 2024
          </span>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#d98a5f",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: "6px",
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "4px",
              }}
            >
              REVENUE
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#f2f2f0",
                fontWeight: 500,
              }}
            >
              ₹37.9L
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: "6px",
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "4px",
              }}
            >
              ORDERS
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#f2f2f0",
                fontWeight: 500,
              }}
            >
              3,860
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: "6px",
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "4px",
              }}
            >
              PEAK
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#f2f2f0",
                fontWeight: 500,
              }}
            >
              Sat
            </div>
          </div>
        </div>

        <svg viewBox="0 0 340 50" style={{ width: "100%", height: 50 }}>
          <motion.polyline
            points="0,40 34,36 68,38 102,28 136,25 170,30 204,18 238,15 272,20 306,8 340,10"
            fill="none"
            stroke="#d98a5f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
