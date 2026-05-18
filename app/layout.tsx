import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallAudit X",
  description: "AI-powered call auditing and analytics platform."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
