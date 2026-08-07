"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "form" | "success" | "error">("loading");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    async function verifyResetLink() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          setStatus("error");
        } else {
          setStatus("form");
        }
      } catch {
        setStatus("error");
      }
    }
    verifyResetLink();
  }, []);

  const getInputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${focusedField === field ? "#d98a5f" : "rgba(255,255,255,0.12)"}`,
    fontSize: "14px",
    marginBottom: "12px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#f2f2f0",
    transition: "border-color 0.2s",
  });

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      await supabase.auth.signOut();
      setStatus("success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

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

        {status === "loading" && (
          <div>
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
                backgroundColor: "rgba(245,158,11,0.1)",
                color: "#f59e0b",
                animation: "pulse 1.5s infinite",
              }}
            >
              ●
            </div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                marginTop: "16px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Verifying reset link...
            </h2>
          </div>
        )}

        {status === "form" && (
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#f2f2f0",
                marginTop: "16px",
                marginBottom: 0,
              }}
            >
              Set new password
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                marginTop: "4px",
                marginBottom: "24px",
              }}
            >
              Enter your new password below.
            </p>

            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("newPassword")}
                required
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("confirmPassword")}
                required
              />

              {error && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "-4px",
                    marginBottom: "12px",
                    textAlign: "left",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#d98a5f",
                  color: "#2c1608",
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
                {loading ? "Please wait..." : "Update password"}
              </button>
            </form>
          </div>
        )}

        {status === "success" && (
          <div>
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
                backgroundColor: "rgba(34,197,94,0.1)",
                color: "#22c55e",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                marginTop: "16px",
                color: "#f2f2f0",
              }}
            >
              Password updated!
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                marginTop: "8px",
              }}
            >
              Your password has been updated. Please sign in with your new password.
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
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
                backgroundColor: "rgba(239,68,68,0.1)",
                color: "#ef4444",
              }}
            >
              ✕
            </div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                marginTop: "16px",
                color: "#f2f2f0",
              }}
            >
              Reset link invalid or expired
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                marginTop: "8px",
              }}
            >
              Please request a new password reset.
            </p>
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
          </div>
        )}
      </div>
    </div>
  );
}
