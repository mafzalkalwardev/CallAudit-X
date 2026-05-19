import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallAudit X – AI-Powered Call Auditing Platform",
  description: "Upload calls, get AI transcription and audit reports, verify findings, and track quality analytics. Built for sales, support, and QA teams.",
  keywords: "call auditing, AI transcription, QA analytics, call quality, sales coaching",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "CallAudit X",
    description: "AI-powered call auditing for teams that handle hundreds of calls.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
