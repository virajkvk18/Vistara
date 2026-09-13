import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VISTARA — National Digital Infrastructure for Land Governance",
  description:
    "Visual Integrated Spatial Terrain & Acquisition Research Architecture. A national digital infrastructure for land governance (SIH26019).",
  keywords: ["VISTARA", "land governance", "geospatial", "SIH26019"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
              fontSize: "13px",
              fontFamily: "var(--font-geist-sans)",
            },
          }}
          theme="dark"
        />
      </body>
    </html>
  );
}