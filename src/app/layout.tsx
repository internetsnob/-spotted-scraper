import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotted — What Happens",
  description:
    "The best live music, food, and outdoor events happening this week in the Texas Hill Country. Curated weekly by locals.",
  openGraph: {
    title: "Spotted — What Happens",
    description:
      "The best live music, food, and outdoor events happening this week in the Texas Hill Country. Curated weekly by locals.",
    url: "https://www.spottedds.com",
    siteName: "Spotted",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotted — What Happens",
    description:
      "The best live music, food, and outdoor events happening this week in the Texas Hill Country. Curated weekly by locals.",
  },
  alternates: {
    canonical: "https://www.spottedds.com",
  },
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
