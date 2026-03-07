import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstroSci Club – Jadavpur University",
  description: "Exploring the cosmos from the heart of Jadavpur University. A community of astronomers, astrophotographers, and space enthusiasts.",
  keywords: ["astronomy", "astrophotography", "Jadavpur University", "space", "stargazing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: "#020617", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
