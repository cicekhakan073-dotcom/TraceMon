import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TraceMon | Parallel Copy Trading on Monad",
  description:
    "Decentralized parallel mirror trading protocol powered by Monad's 10,000 TPS execution engine. Copy top traders instantly with isolated vaults and zero state conflicts.",
  openGraph: {
    title: "TraceMon | Parallel Copy Trading on Monad",
    description:
      "Copy top traders instantly with Monad's 10,000 TPS parallel execution. Isolated vaults, real-time analytics, zero state conflicts.",
    type: "website",
    siteName: "TraceMon",
  },
  twitter: {
    card: "summary_large_image",
    title: "TraceMon | Parallel Copy Trading on Monad",
    description:
      "Copy top traders instantly with Monad's 10,000 TPS parallel execution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0B0F] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
