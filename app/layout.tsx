import type { Metadata } from "next";
import "./globals.css";
import MathBackground from "@/components/MathBackground";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.clubName} – ${siteConfig.university}`,
  description: "The JU Maths Society at Jadavpur University — a community decoding the universe's language through problem-solving, proof, and the elegance of mathematics.",
  keywords: ["mathematics", "problem solving", "Jadavpur University", "maths society", "competitive programming", "olympiad"],
  icons: {
    icon: siteConfig.assets.favicon,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: "#000000", color: "white" }}>
        <MathBackground />
        {children}
      </body>
    </html>
  );
}
