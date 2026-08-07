"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSent, setForgotSent] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/dashboard");
            }
        }
        checkSession();
    }, [router]);

    const getFriendlyError = (message: string): string => {
        if (message.includes("Invalid login credentials"))
            return "Incorrect email or password. Please try again.";
        if (message.includes("Email not confirmed"))
            return "Please confirm your email before signing in.";
        if (message.includes("User already registered"))
            return "An account with this email already exists. Sign in instead.";
        if (message.includes("Password should be at least"))
            return "Password must be at least 6 characters.";
        return message;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            if (mode === "signup") {
                if (!restaurantName.trim()) {
                    throw new Error("Restaurant name is required");
                }
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            restaurant_name: restaurantName,
                        },
                    },
                });

                if (signUpError) throw signUpError;

                setSuccessMessage(
                    "Check your email for a confirmation link. Click it to activate your account."
                );
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(getFriendlyError(err.message || "An error occurred"));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                forgotEmail,
                { redirectTo: `${window.location.origin}/auth/reset-password` }
            );
            if (error) throw error;
            setForgotSent(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    const safeDark = mounted && isDark;

    const getInputStyle = (field: string): React.CSSProperties => ({
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        borderRadius: "8px",
        border: `1px solid ${focusedField === field ? "#f59e0b" : safeDark ? "rgba(255,255,255,0.12)" : "#e5e5e5"}`,
        fontSize: "14px",
        marginBottom: "12px",
        outline: "none",
        fontFamily: "inherit",
        backgroundColor: safeDark ? "rgba(255,255,255,0.05)" : "#ffffff",
        color: safeDark ? "#f0f0f0" : "#0f1117",
        transition: "border-color 0.2s",
    });

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
            <div
                style={{
                    backgroundColor: safeDark ? "#1e2129" : "#ffffff",
                    borderRadius: "12px",
                    padding: "36px",
                    width: "380px",
                    boxShadow: safeDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)",
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
                <p
                    style={{
                        color: safeDark ? "rgba(255,255,255,0.4)" : "#888888",
                        fontSize: "13px",
                        margin: "0 0 24px 0",
                    }}
                >
                    {mode === "login"
                        ? "Sign in to your account"
                        : mode === "signup"
                            ? "Create your account"
                            : "Reset your password"}
                </p>

                {mode === "forgot" ? (
                    <div>
                        {!forgotSent ? (
                            <form onSubmit={handleForgotPassword}>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    onFocus={() => setFocusedField("forgotEmail")}
                                    onBlur={() => setFocusedField(null)}
                                    style={getInputStyle("forgotEmail")}
                                    required
                                />

                                <button
                                    type="submit"
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
                                    {loading ? "Please wait..." : "Send reset link"}
                                </button>
                            </form>
                        ) : (
                            <div
                                style={{
                                    color: "#22c55e",
                                    fontSize: "13px",
                                    textAlign: "center",
                                    marginBottom: "16px",
                                }}
                            >
                                If an account exists with this email, a reset link has been sent.
                            </div>
                        )}

                        <div
                            style={{
                                marginTop: "20px",
                                textAlign: "center",
                                fontSize: "13px",
                            }}
                        >
                            <span
                                onClick={() => {
                                    setMode("login");
                                    setForgotSent(false);
                                    setError("");
                                }}
                                style={{ color: "#f59e0b", cursor: "pointer", fontWeight: 500 }}
                            >
                                Back to login
                            </span>
                        </div>
                    </div>
                ) : successMessage ? (
                    <div
                        style={{
                            color: "#155724",
                            backgroundColor: "#d4edda",
                            border: "1px solid #c3e6cb",
                            padding: "12px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            textAlign: "center",
                        }}
                    >
                        {successMessage}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <input
                                type="text"
                                placeholder="Restaurant Name"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                onFocus={() => setFocusedField("restaurant")}
                                onBlur={() => setFocusedField(null)}
                                style={getInputStyle("restaurant")}
                                required
                            />
                        )}

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            style={getInputStyle("email")}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            style={getInputStyle("password")}
                            required
                        />

                        {mode === "login" && (
                            <div style={{ textAlign: "right", marginTop: "-4px", marginBottom: "16px" }}>
                                <span
                                    onClick={() => {
                                        setMode("forgot");
                                        setError("");
                                    }}
                                    style={{
                                        color: "#f59e0b",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        fontWeight: 500,
                                    }}
                                >
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
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
                            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
                        </button>
                    </form>
                )}

                {error && (
                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>
                        {error}
                    </div>
                )}

                {!successMessage && mode !== "forgot" && (
                    <div
                        style={{
                            marginTop: "20px",
                            textAlign: "center",
                            fontSize: "13px",
                            color: safeDark ? "rgba(255,255,255,0.4)" : "#888888",
                        }}
                    >
                        {mode === "login" ? (
                            <span>
                                Don't have an account?{" "}
                                <span
                                    onClick={() => {
                                        setMode("signup");
                                        setError("");
                                    }}
                                    style={{ color: "#f59e0b", cursor: "pointer", fontWeight: 500 }}
                                >
                                    Sign up
                                </span>
                            </span>
                        ) : (
                            <span>
                                Already have an account?{" "}
                                <span
                                    onClick={() => {
                                        setMode("login");
                                        setError("");
                                    }}
                                    style={{ color: "#f59e0b", cursor: "pointer", fontWeight: 500 }}
                                >
                                    Sign in
                                </span>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
