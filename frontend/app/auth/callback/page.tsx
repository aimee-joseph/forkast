"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function verifyAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === "SIGNED_IN" && session) {
              setStatus("success");
              subscription.unsubscribe();
              setTimeout(() => {
                router.push("/dashboard");
              }, 2000);
            } else if (event === "TOKEN_REFRESHED") {
              // ignore
            } else if (!session) {
              setStatus("error");
              subscription.unsubscribe();
            }
          }
        );

        setTimeout(() => {
          setStatus((prev) => {
            if (prev === "loading") {
              subscription.unsubscribe();
              return "error";
            }
            return prev;
          });
        }, 5000);

      } catch {
        setStatus("error");
      }
    }
    verifyAuth();
  }, [router]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
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
          backgroundColor: "#111111",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "36px",
          width: "380px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#f2f2f0",
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
            color: status === "loading" ? "rgba(255,255,255,0.4)" : "#f2f2f0",
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
            color: "rgba(255,255,255,0.4)",
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
            onClick={() => router.push("/login")}
            style={{
              width: "100%",
              backgroundColor: "#d98a5f",
              color: "#2c1608",
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
