import type { Metadata, Viewport } from "next";

import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#171717",
};

export const metadata: Metadata = {
  title: "VODS MEME | Internet English",
  description: "Learn the English the internet actually uses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
