"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "var(--bg-page)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "13px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          marginLeft: "220px",
          flex: 1,
          backgroundColor: "var(--bg-page)",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
