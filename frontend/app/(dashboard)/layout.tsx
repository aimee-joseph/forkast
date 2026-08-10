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
  const [slowLoad, setSlowLoad] = useState(false);

  useEffect(() => {
    const slowTimer = setTimeout(() => setSlowLoad(true), 4000);
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      } finally {
        clearTimeout(slowTimer);
      }
    }
    checkSession();
    return () => clearTimeout(slowTimer);
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "var(--bg-page)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "13px",
        }}
      >
        <span>Loading...</span>
        {slowLoad && (
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-faint)",
              marginTop: "8px",
            }}
          >
            Waking up the server, this can take a few seconds...
          </div>
        )}
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
