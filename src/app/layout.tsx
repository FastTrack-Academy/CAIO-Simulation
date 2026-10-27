import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "CAIO & CJAIO Exam Prep",
  description: "Interactive exam simulator, personalized question review book, and learning performance tracking for CAIO and CJAIO students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
