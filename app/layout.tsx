import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Body face. Geist is a neutral grotesque with a taller x-height than Inter,
 * so long paragraphs stay readable at the sizes used across the site.
 */
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

/**
 * Display face. Bricolage Grotesque is a variable grotesque with genuine
 * character in its terminals, and it replaced Fraunces for two reasons: the
 * old face's WONK axis swapped in eccentric alternates that made descenders
 * (notably `j` and `g`) read as broken, and a warm variable serif is one of
 * the most over-used display choices going. Do not pass `weight` to a
 * variable font request; set weight through CSS instead.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz"],
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
      className={`${geist.variable} ${bricolage.variable} ${jetBrainsMono.variable}`}
    >
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
