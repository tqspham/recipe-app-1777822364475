import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rustic Recipe Collection",
  description: "Discover, create, and save your favorite recipes in a warm, inviting farmhouse-inspired recipe collection app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--color-background)] text-[var(--color-text)]">{children}</body>
    </html>
  );
}
