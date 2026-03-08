import type { Metadata } from "next";
import "./globals.css";
import StarfieldBackground from "@/components/StarfieldBackground";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `${siteConfig.clubName} – ${siteConfig.university}`,
  description: "Exploring the cosmos from the heart of Jadavpur University. A community of astronomers, astrophotographers, and space enthusiasts.",
  keywords: ["astronomy", "astrophotography", "Jadavpur University", "space", "stargazing"],
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
      <body style={{ backgroundColor: "#020617", color: "white" }}>
        <StarfieldBackground />
        {children}
      </body>
    </html>
  );
}
