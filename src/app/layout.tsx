import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotted — Scraper Dashboard",
  description: "Review and curate scraped events for Spotted In & Around",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
