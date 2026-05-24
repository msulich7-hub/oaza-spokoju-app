import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oaza Spokoju — AI Architecture Copilot",
  description:
    "AI-powered dashboard do zarządzania projektem architektonicznym domu w Cieszynie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
