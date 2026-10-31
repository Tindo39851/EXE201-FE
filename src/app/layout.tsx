import type { Metadata } from "next";
import { Exo_2, Be_Vietnam_Pro, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import "@livekit/components-styles";

const exo2 = Exo_2({
  subsets: ["latin", "vietnamese"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800"],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "GameTrust — Find Your Squad",
  description: "The Premier Competitive Player Matching Platform",
};

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body
        className={`${exo2.variable} ${beVietnamPro.variable} ${shareTechMono.variable} bg-gt-bg text-gt-text font-rajdhani antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
