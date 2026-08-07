"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login");
        return;
      }
      setEmail(session.user.email || "");
      setRestaurantName(session.user.user_metadata?.restaurant_name || "");
      setLoading(false);
    }
    loadSession();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { restaurant_name: restaurantName },
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const getInputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${focusedField === field ? "#f59e0b" : "var(--input-border)"}`,
    fontSize: "14px",
    marginBottom: "12px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-primary)",
    transition: "border-color 0.2s",
  });

  const getDisabledInputStyle = (): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--input-border)",
    fontSize: "14px",
    marginBottom: "12px",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "var(--bg-page)",
    color: "var(--text-faint)",
    cursor: "not-allowed",
  });

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
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
          Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
          Manage your account and restaurant details
        </p>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          padding: "24px",
          border: "0.5px solid var(--border-card)",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 20px 0",
            paddingBottom: "12px",
            borderBottom: "0.5px solid var(--border-subtle)",
          }}
        >
          Restaurant details
        </h2>

        <form onSubmit={handleSave}>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "6px" }}>
            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Restaurant name
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              onFocus={() => setFocusedField("restaurantName")}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle("restaurantName")}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginBottom: "6px" }}>
            <label
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Email address
            </label>
            <input type="email" value={email} style={getDisabledInputStyle()} disabled />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "auto",
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              border: "none",
              padding: "9px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          {success && (
            <div style={{ color: "#22c55e", fontSize: "13px", marginTop: "12px" }}>
              Settings saved.
            </div>
          )}

          {error && (
            <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "12px" }}>
              {error}
            </div>
          )}
        </form>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          padding: "24px",
          border: "0.5px solid var(--border-card)",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#ef4444",
            margin: "0 0 20px 0",
            paddingBottom: "12px",
            borderBottom: "0.5px solid var(--border-subtle)",
          }}
        >
          Account
        </h2>

        <div>
          <button
            type="button"
            onClick={() => setShowDeleteMessage(true)}
            style={{
              border: "0.5px solid #ef4444",
              color: "#ef4444",
              backgroundColor: "var(--bg-card)",
              padding: "9px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Delete account
          </button>

          {showDeleteMessage && (
            <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>
              Delete account coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
