"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Upload, FileText, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserInfo {
  email: string;
  name: string;
  initials: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email || "";
        const restaurantName = session.user.user_metadata?.restaurant_name || email;
        const initials = email ? email.substring(0, 2).toUpperCase() : "US";
        setUser({ email, name: restaurantName, initials });
      }
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || "";
        const restaurantName = session.user.user_metadata?.restaurant_name || email;
        const initials = email ? email.substring(0, 2).toUpperCase() : "US";
        setUser({ email, name: restaurantName, initials });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: BarChart2 },
    { label: "Upload data", href: "/upload", icon: Upload },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      style={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#0f1117",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "0.5px solid rgba(255, 255, 255, 0.07)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "0.5px solid rgba(255, 255, 255, 0.07)",
        }}
      >
        <div style={{ color: "#ffffff", fontSize: "15px", fontWeight: 500 }}>
          Forkast
        </div>
        <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "11px", marginTop: "2px" }}>
          Restaurant analytics
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          let itemStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            padding: "8px 10px",
            gap: "9px",
            fontSize: "13px",
            textDecoration: "none",
            borderRadius: "6px",
            transition: "background-color 0.2s, color 0.2s",
            cursor: "pointer",
          };

          if (isActive) {
            itemStyle = {
              ...itemStyle,
              color: "#f59e0b",
              backgroundColor: "rgba(245, 158, 11, 0.12)",
            };
          } else {
            itemStyle = {
              ...itemStyle,
              color: "rgba(255, 255, 255, 0.45)",
              backgroundColor: hoveredIndex === idx ? "rgba(255, 255, 255, 0.08)" : "transparent",
            };
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={itemStyle}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "16px 12px",
          borderTop: "0.5px solid rgba(255, 255, 255, 0.07)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {user.initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "10px", marginTop: "1px" }}>
                Free plan
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 10px",
            gap: "9px",
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.45)",
            backgroundColor: isLogoutHovered ? "rgba(255, 255, 255, 0.08)" : "transparent",
            border: "none",
            borderRadius: "6px",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
