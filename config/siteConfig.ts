/**
 * Central configuration file for the JU Maths Society website.
 *
 * Administrators can update logos, emails, social links, and other
 * site-wide values here and the changes will propagate across every
 * component that imports this config.
 */

export const siteConfig = {
  clubName: "JU Maths Society",
  shortName: "JMS",
  tagline: "Decoding the Universe's Language",
  university: "Jadavpur University",

  email: "astrosciclubjadavpur@gmail.com",

  // Homepage countdown target — point this at your next flagship event
  // (Math Olympiad, hackathon, contest). Edit the date/label any time.
  nextEvent: {
    label: "JU Math Olympiad",
    date: "2026-08-15T09:00:00+05:30",
  },

  social: {
    instagram: "https://www.instagram.com/astrosciclubju?igsh=ZmwwZWJ2bmhmdGhl",
    twitter: "",
    youtube: "",
    linkedin: "https://www.linkedin.com/company/astrosciclub-jadavpur-university/posts/?feedView=all",
    github: "",
  },

  assets: {
    logo: "https://rwjfnuszkhoznfrjzqfr.supabase.co/storage/v1/object/public/logos/unnamed-removebg-preview.png",
    favicon: "https://rwjfnuszkhoznfrjzqfr.supabase.co/storage/v1/object/public/logos/unnamed-removebg-preview.png",
    banner: "/assets/club-banner.png",
    paymentQr: "https://rwjfnuszkhoznfrjzqfr.supabase.co/storage/v1/object/public/logos/IMG-20260315-WA00501.jpg",
  },
};
