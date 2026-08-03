import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

/**
 * Fraunces is a variable display serif. Requesting the SOFT, WONK, and opsz
 * axes lets globals.css tune headline warmth per size via
 * font-variation-settings. Do not add `weight` to a variable font request.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phillipkaraya-portfolio.vercel.app"),
  title: {
    default: "Phillip Karaya — AI Solutions Engineer",
    template: "%s · Phillip Karaya",
  },
  description:
    "Forward-deployed AI engineer. I build AI systems that solve real problems for real businesses: autonomous agents, evaluated retrieval, and platforms teams use every day.",
  openGraph: {
    type: "website",
    siteName: "Phillip Karaya",
    title: "Phillip Karaya — AI Solutions Engineer",
    description:
      "Forward-deployed AI engineer. I build AI systems that solve real problems for real businesses: autonomous agents, evaluated retrieval, and platforms teams use every day.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${jetBrainsMono.variable}`}
    >
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
