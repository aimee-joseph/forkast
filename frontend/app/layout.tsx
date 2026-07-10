import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forkast",
  description: "Restaurant analytics for modern businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0f1117",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
