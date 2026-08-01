"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          setStatus("error");
        } else {
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch {
        setStatus("error");
      }
    }
    verifyAuth();
  }, [router]);

  const safeDark = mounted && resolvedTheme === "dark";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
      `}</style>
      <div
        style={{
          backgroundColor: safeDark ? "#1e2129" : "#ffffff",
          borderRadius: "12px",
          padding: "36px",
          width: "380px",
          boxShadow: safeDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: safeDark ? "#f0f0f0" : "#0f1117",
            margin: "0 0 4px 0",
          }}
        >
          Forkast
        </h1>

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            margin: "20px auto 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: 600,
            backgroundColor:
              status === "success"
                ? "rgba(34,197,94,0.1)"
                : status === "error"
                ? "rgba(239,68,68,0.1)"
                : "rgba(245,158,11,0.1)",
            color:
              status === "success"
                ? "#22c55e"
                : status === "error"
                ? "#ef4444"
                : "#f59e0b",
            animation: status === "loading" ? "pulse 1.5s infinite" : "none",
          }}
        >
          {status === "success" ? "✓" : status === "error" ? "✕" : "●"}
        </div>

        <h2
          style={{
            fontSize: "16px",
            fontWeight: 500,
            marginTop: "16px",
            marginBottom: 0,
            color: status === "loading" ? "var(--text-muted)" : "var(--text-primary)",
          }}
        >
          {status === "loading"
            ? "Verifying your email..."
            : status === "success"
            ? "Email confirmed!"
            : "Confirmation link invalid or expired"}
        </h2>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginTop: "8px",
            marginBottom: 0,
          }}
        >
          {status === "loading"
            ? ""
            : status === "success"
            ? "Redirecting you to your dashboard..."
            : "This link may have already been used."}
        </p>

        {status === "error" && (
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              border: "none",
              padding: "11px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Back to login
          </button>
        )}
      </div>
    </div>
  );
}
