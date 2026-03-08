<div align="center">

# 🔭 AstroSci — Jadavpur University

### The Official Platform of Jadavpur University's Astronomy & Astrophotography Club

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

**A full-stack, real-time astronomy club platform** built with the Next.js 14 App Router, Supabase for auth & data, and a NASA-inspired space-engineering design system — featuring live ISS tracking, moon phase calculations, astronomical event calendars, member dashboards, and immersive 3D/WebGL experiences.

[🚀 Getting Started](#-getting-started) · [🏗️ Architecture](#️-architecture) · [📖 API Reference](#-api-reference) · [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
- [Design System](#-design-system)
- [Security Model](#-security-model)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🌌 Public-Facing Pages

| Feature | Description |
|---|---|
| **Immersive Landing Page** | Procedurally generated WebGL starfield background, animated hero with club logo, profile greeting, and section previews |
| **Live Astronomy Widgets** | Real-time **ISS Tracker** (5-second refresh via [wheretheiss.at](https://wheretheiss.at)), **Moon Phase Calculator** (synodic cycle math — no API), and **Astronomical Event Calendar** |
| **Photo of the Week (POTW)** | Curated astrophotography showcase with photographer credits, pulled from Supabase |
| **NASA APOD Integration** | Dedicated `/nasa-apod` page consuming NASA's Astronomy Picture of the Day API |
| **Club Events** | Upcoming observation nights, workshops, and lectures with countdown timers and poster images |
| **Nebula Digest Magazine** | Browse and download club magazine issues (covers + PDFs stored in Supabase Storage) |
| **Team Page** | Public roster of core team members with designations, fetched from the `profiles` table (role = `admin`) |
| **Membership Tiers** | Free, Monthly, Annual, and Core tier display with plan-based color coding |
| **Support Page** | Dedicated support and contact page |

### 🔐 Authenticated Member Area

| Feature | Description |
|---|---|
| **Auth System** | Email/password + hCaptcha bot protection, powered by Supabase Auth |
| **Route Guards** | `AuthGuard` component redirects unauthenticated users to `/auth?tab=signup` on protected routes |
| **Member Gallery** | Upload and browse astrophotography; images stored in Supabase Storage with public RLS |
| **Member Projects** | Project showcase with thumbnails, PDFs, and author attribution |
| **Profile Management** | Avatar upload, name editing, and plan/tier display via `ProfileForm` and `ProfileImageUpload` |
| **Member Directory** | Browse other members with interactive star-map visualization (`MemberStarMap`) |

### 🎨 Immersive UI/UX

| Feature | Description |
|---|---|
| **3D Solar System** | Interactive Three.js / React Three Fiber solar system model (`SolarSystem3D`, `Planet3D`) |
| **2D Constellation Map** | Canvas-based constellation viewer with star tooltips (`ConstellationMap2D`, `StarTooltip`) |
| **Starfield Background** | Full-viewport procedural starfield rendered on every page |
| **Framer Motion Animations** | Page transitions, section reveals, hover effects, and scroll-triggered animations |
| **Feedback Form** | In-app feedback collection on the landing page |

---

## 🛠 Tech Stack

### Core Framework

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | [Next.js](https://nextjs.org/) (App Router) | `14.2.3` | Server/client rendering, file-based routing, API routes, image optimization |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.x` | End-to-end type safety across components, API routes, and utilities |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `3.4.1` | Utility-first CSS with custom space-engineering design tokens |
| **CSS Processing** | [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer) | `8.x` / `10.x` | Vendor prefixing and Tailwind compilation |

### Backend & Data

| Layer | Technology | Purpose |
|---|---|---|
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | Relational data for profiles, gallery, POTW, events, magazines, projects, astronomy events |
| **Authentication** | Supabase Auth | Email/password auth with session management and JWT tokens |
| **Storage** | Supabase Storage | Public buckets for avatars, gallery images, POTW images, event posters, magazine assets |
| **Bot Protection** | [hCaptcha](https://www.hcaptcha.com/) | CAPTCHA verification on signup with server-side validation (`/api/verify-captcha`) |
| **API Routes** | Next.js Route Handlers | `/api/astronomy-events` (event generation), `/api/verify-captcha` (hCaptcha verification) |

### Frontend Libraries

| Library | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | `18.x` | Component model and hooks |
| [Framer Motion](https://www.framer.com/motion/) | `11.1.9` | Declarative animations, page transitions, scroll reveals |
| [Three.js](https://threejs.org/) | `0.160.0` | WebGL 3D rendering engine |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | `8.15.12` | React reconciler for Three.js |
| [@react-three/drei](https://github.com/pmndrs/drei) | `9.92.7` | Helper components for R3F (orbits, lights, geometries) |
| [@hcaptcha/react-hcaptcha](https://github.com/hCaptcha/react-hcaptcha) | `2.0.2` | hCaptcha React integration |

### Development Tooling

| Tool | Purpose |
|---|---|
| [ESLint](https://eslint.org/) + `eslint-config-next` | Static analysis and Next.js best-practice linting |
| [TypeScript Compiler](https://www.typescriptlang.org/) (`tsc`) | Type checking at build time |
| [PostCSS](https://postcss.org/) | CSS pipeline for Tailwind |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (Browser)                             │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Next.js App  │  │ React Three  │  │   Framer     │  │ Supabase   │  │
│  │  Router (RSC  │  │ Fiber + Drei │  │   Motion     │  │ JS Client  │  │
│  │  + Client)    │  │ (3D Scenes)  │  │ (Animations) │  │ (Auth/DB)  │  │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  └──────┬─────┘  │
│         │                                                      │        │
└─────────┼──────────────────────────────────────────────────────┼────────┘
          │  Server Components                                   │
          │  + API Route Handlers                                │  REST
          ▼                                                      ▼
┌─────────────────────┐                          ┌──────────────────────┐
│   Next.js Server    │                          │      Supabase        │
│                     │                          │                      │
│  /api/astronomy-    │◄────── fetch ──────────► │  PostgreSQL (RLS)    │
│       events        │                          │  Auth (JWT)          │
│  /api/verify-       │                          │  Storage (Buckets)   │
│       captcha       │                          │                      │
└─────────────────────┘                          └──────────────────────┘
          │                                                │
          │  External APIs                                 │  Storage Buckets
          ▼                                                ▼
┌─────────────────────┐                          ┌──────────────────────┐
│  wheretheiss.at     │                          │  profiles/           │
│  (ISS position)     │                          │  gallery/            │
│                     │                          │  potw/               │
│  NASA APOD API      │                          │  events/             │
│  (apod.nasa.gov)    │                          │  magazines/          │
└─────────────────────┘                          └──────────────────────┘
```

### Routing Model

The application uses the **Next.js 14 App Router** with a hybrid rendering strategy:

- **Server Components** — used by default for pages and layouts; data fetching happens at the server level  
- **Client Components** — marked with `"use client"` for interactive widgets (3D scenes, animations, auth forms, real-time data)  
- **API Route Handlers** — `/api/*` endpoints for server-side logic (event generation, CAPTCHA verification)

### Auth Flow

```
User ──► /auth (AuthTabs → LoginForm / SignupForm)
              │
              ├─ hCaptcha widget ──► /api/verify-captcha ──► hCaptcha API
              │
              └─ Supabase Auth (email/password)
                    │
                    ├─ onAuthStateChange ──► ensureProfile() (client-side fallback)
                    │
                    └─ AuthGuard (protected routes) ──► redirect to /auth if unauthenticated
```

---

## 📁 Project Structure

```
astrosci-website/
│
├── app/                              # Next.js 14 App Router
│   ├── layout.tsx                    # Root layout — metadata, fonts, StarfieldBackground
│   ├── page.tsx                      # Landing page — assembles all dashboard sections
│   ├── globals.css                   # Tailwind directives, CSS variables, custom animations
│   │
│   ├── api/                          # Server-side API routes
│   │   ├── astronomy-events/
│   │   │   └── route.ts             # GET — generates upcoming astronomical events
│   │   └── verify-captcha/
│   │       └── route.ts             # POST — server-side hCaptcha token verification
│   │
│   ├── astronomy/page.tsx            # Full astronomy dashboard (Moon, ISS, Calendar)
│   ├── auth/page.tsx                 # Authentication page (login / signup tabs)
│   ├── events/page.tsx               # Club events listing
│   ├── gallery/page.tsx              # 🔒 Member astrophotography gallery
│   ├── join/page.tsx                 # Membership sign-up page
│   ├── magazine/page.tsx             # 🔒 Nebula Digest magazine browser
│   ├── members/page.tsx              # 🔒 Member directory with star map
│   ├── nasa-apod/page.tsx            # NASA Astronomy Picture of the Day
│   ├── potw/page.tsx                 # 🔒 Photo of the Week archive
│   ├── profile/page.tsx              # 🔒 User profile management
│   ├── projects/page.tsx             # 🔒 Member project showcase
│   ├── support/page.tsx              # Support and contact page
│   └── team/page.tsx                 # Public team roster
│
├── components/                       # Reusable React components
│   │
│   │  # ── Navigation & Layout ──
│   ├── Navbar.tsx                    # Responsive navigation bar
│   ├── Footer.tsx                    # Site footer with social links
│   ├── StarfieldBackground.tsx       # Full-viewport procedural starfield (WebGL)
│   ├── StarBackground.tsx            # Alternative twinkling star canvas
│   │
│   │  # ── Landing Page Sections ──
│   ├── HeroSection.tsx               # Animated hero with logo and headline
│   ├── ProfileGreeting.tsx           # Personalized welcome for logged-in users
│   ├── DashboardGalleryPreview.tsx   # Gallery preview cards on homepage
│   ├── DashboardPOTWPreview.tsx      # POTW preview on homepage
│   ├── DashboardMagazinePreview.tsx  # Magazine preview on homepage
│   ├── ClubEventsSection.tsx         # Upcoming events with countdown
│   ├── EventCountdown.tsx            # Countdown timer component
│   ├── MembershipCards.tsx           # Membership tier cards
│   ├── FeedbackForm.tsx              # In-app feedback form
│   ├── JoinSection.tsx               # CTA section for new members
│   ├── WidgetSection.tsx             # Info widget container
│   │
│   │  # ── Astronomy Widgets ──
│   ├── AstronomyPreview.tsx          # Compact astronomy widget previews (homepage)
│   ├── AstronomyCalendar.tsx         # Full astronomical event calendar
│   ├── AstronomicalCalendarWidget.tsx # Calendar widget (timeline format)
│   ├── MoonPhaseWidget.tsx           # Real-time moon phase (synodic cycle math)
│   ├── ISSTrackerWidget.tsx          # Live ISS position tracker (5-second refresh)
│   │
│   │  # ── 3D / Visual ──
│   ├── SolarSystem3D.tsx             # Interactive Three.js solar system
│   ├── Planet3D.tsx                  # Individual planet 3D model
│   ├── ConstellationMap2D.tsx        # Canvas-based constellation viewer
│   ├── StarTooltip.tsx               # Tooltip for constellation stars
│   │
│   │  # ── Auth & Profile ──
│   ├── AuthCard.tsx                  # Auth page card wrapper
│   ├── AuthGuard.tsx                 # Protected route wrapper (redirect if unauthed)
│   ├── AuthTabs.tsx                  # Login / Signup tab switcher
│   ├── LoginForm.tsx                 # Email/password login form
│   ├── SignupForm.tsx                # Registration form with hCaptcha
│   ├── LoginSuccessAnimation.tsx     # Post-login success animation
│   ├── ProfileCard.tsx               # User profile display card
│   ├── ProfileForm.tsx               # Profile editing form
│   ├── ProfileImageUpload.tsx        # Avatar upload component
│   │
│   │  # ── Member Features ──
│   ├── GalleryPreview.tsx            # Gallery image grid
│   ├── POTWPreview.tsx               # POTW display card
│   ├── POTWSection.tsx               # POTW section wrapper
│   ├── MagazinePreview.tsx           # Magazine issue card
│   ├── MemberProfileCard.tsx         # Member directory profile card
│   └── MemberStarMap.tsx             # Interactive member star-map visualization
│
├── config/
│   └── siteConfig.ts                 # Central config — club name, email, social links, assets
│
├── lib/
│   ├── supabaseClient.ts             # Supabase client init, ensureProfile(), auth listener
│   └── memberUtils.ts                # Plan/tier label & color resolvers
│
├── supabase/                         # Database migration scripts
│   ├── profiles-migration.sql        # profiles table, RLS policies, auth trigger
│   └── tables-migration.sql          # gallery, potw, magazines, club_events, astronomy_events
│
├── public/
│   ├── assets/
│   │   ├── logo.svg                  # Club logo (SVG)
│   │   ├── favicon.svg               # Browser favicon
│   │   └── club-banner.png           # Club banner image
│   └── constellation-map/
│       └── index.html                # Standalone constellation map viewer
│
├── .env.example                      # Environment variable template
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js config (image domains, remote patterns)
├── tailwind.config.ts                # Tailwind config (custom colors, fonts)
├── tsconfig.json                     # TypeScript compiler options
├── postcss.config.js                 # PostCSS plugins (Tailwind, Autoprefixer)
└── package.json                      # Dependencies and scripts
```

> 🔒 = Route protected by `AuthGuard` — requires Supabase authentication

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum Version |
|---|---|
| **Node.js** | `18.0.0` |
| **npm** | `9.0.0` |
| **Supabase Project** | Free tier or above |
| **hCaptcha Account** | Free tier (for signup CAPTCHA) |

### 1. Clone the Repository

```bash
git clone https://github.com/Archemasachika7/astrosci-website.git
cd astrosci-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your credentials (see [Environment Variables](#-environment-variables) below).

### 4. Run Database Migrations

Open the **SQL Editor** in your [Supabase Dashboard](https://supabase.com/dashboard) and execute the migration files **in order**:

1. `supabase/profiles-migration.sql` — Creates the `profiles` table, RLS policies, and the `on_auth_user_created` trigger
2. `supabase/tables-migration.sql` — Creates `gallery`, `potw`, `magazines`, `club_events`, and `astronomy_events` tables with RLS

### 5. Create Storage Buckets

In your Supabase Dashboard under **Storage**, create the following **public** buckets:

| Bucket | Purpose |
|---|---|
| `profiles` | User avatar images |
| `gallery` | Astrophotography uploads |
| `potw` | Photo of the Week images |
| `events` | Event poster images |
| `magazines` | Magazine covers and PDF files |
| `logos` | Club logo and branding assets |

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file from the provided template:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL (e.g., `https://abcdefgh.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase `anon` / public key (JWT starting with `eyJ…`) |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | ✅ | hCaptcha site key from your [dashboard](https://dashboard.hcaptcha.com) |
| `HCAPTCHA_SECRET_KEY` | ✅ | hCaptcha secret key (server-side only — **never** exposed to the client) |

> **⚠️ Security Note:** Never commit `.env.local` or any file containing real credentials. The `.gitignore` already excludes `.env*.local`.

---

## 🗄 Database Setup

### Schema Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│   profiles   │    │   gallery    │    │  astronomy_events│
├──────────────┤    ├──────────────┤    ├──────────────────┤
│ id (uuid/PK) │    │ id (uuid/PK) │    │ id (uuid/PK)     │
│ name         │    │ image_url    │    │ title            │
│ role         │    │ caption      │    │ description      │
│ plan         │    │ uploaded_by  │───►│ event_date       │
│ designation  │    │ created_at   │    │ created_at       │
│ avatar_url   │    └──────────────┘    └──────────────────┘
│ created_at   │
└──────────────┘    ┌──────────────┐    ┌──────────────────┐
                    │     potw     │    │   club_events    │
                    ├──────────────┤    ├──────────────────┤
                    │ id (uuid/PK) │    │ id (uuid/PK)     │
                    │ image_url    │    │ title            │
                    │ title        │    │ description      │
                    │ photographer │    │ poster_url       │
                    │ week_date    │    │ location         │
                    └──────────────┘    │ event_date       │
                                        │ created_at       │
┌──────────────┐                        └──────────────────┘
│  magazines   │    ┌──────────────┐
├──────────────┤    │   projects   │
│ id (uuid/PK) │    ├──────────────┤
│ title        │    │ id (uuid/PK) │
│ issue        │    │ title        │
│ cover_image  │    │ description  │
│ pdf_url      │    │ thumbnail_url│
│ published_at │    │ pdf_url      │
└──────────────┘    │ author       │
                    │ created_at   │
                    └──────────────┘
```

### Row-Level Security (RLS)

All tables have RLS enabled with the following policy pattern:

| Operation | Policy |
|---|---|
| **SELECT** | Public — anyone can read (`using (true)`) |
| **INSERT** | Authenticated users only (`auth.role() = 'authenticated'`) |
| **UPDATE / DELETE** | Not permitted via RLS (admin operations handled through Supabase Dashboard) |

The `profiles` table has an additional policy allowing public read access to admin profiles for the `/team` page.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Create an optimized production build (type-checks + bundles) |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint with Next.js rules across the entire codebase |

---

## 📖 API Reference

### `GET /api/astronomy-events`

Returns an array of upcoming astronomical events (meteor showers, eclipses, equinoxes, solstices) for the current and next calendar year. Events are generated programmatically — no external API dependency.

**Response:**

```json
[
  {
    "title": "Perseid Meteor Shower",
    "description": "One of the best annual meteor showers...",
    "event_date": "2025-08-12T00:00:00.000Z"
  }
]
```

**Fallback:** Client components (`AstronomicalCalendarWidget`, `AstronomyCalendar`) fetch from this API first, then fall back to the Supabase `astronomy_events` table if the API is unreachable.

---

### `POST /api/verify-captcha`

Server-side hCaptcha token verification. Called during signup to validate the CAPTCHA response.

**Request Body:**

```json
{
  "token": "<hcaptcha-response-token>"
}
```

**Response:**

```json
{
  "success": true
}
```

---

## 🎨 Design System

### Color Palette (NASA-Inspired Space Engineering)

| Token | Hex | Usage |
|---|---|---|
| `space` | `#020617` | Page background, deep space black |
| `panel` | `#0f172a` | Card / panel backgrounds |
| `border` | `#1f2937` | Subtle borders and dividers |
| `muted` | `#e5e7eb` | Secondary text |
| `earth-blue` | `#2563eb` | Primary accent, CTA buttons, links |
| `orbit-blue` | `#38bdf8` | Secondary accent, highlights |
| `atmos-green` | `#10b981` | Success states, active indicators |
| `aurora-green` | `#22c55e` | Hover states, online indicators |

**Primary Gradient:** `from-[#2563eb] to-[#10b981]` (blue → green)

### Typography

| Role | Font Stack | CSS Class |
|---|---|---|
| **Headings** | Space Grotesk → Inter → Helvetica → sans-serif | `font-heading` |
| **Body** | Public Sans → Inter → system-ui → sans-serif | `font-body` |
| **Monospace** | DM Mono → JetBrains Mono → monospace | `font-mono` |

All fonts are loaded from Google Fonts with `display=swap` for optimal performance.

### Animations

| Animation | Engine | Description |
|---|---|---|
| Starfield | Canvas / WebGL | Procedurally generated twinkling star background on all pages |
| Page transitions | Framer Motion | Fade/slide animations between route changes |
| Section reveals | Framer Motion | Scroll-triggered entrance animations |
| Glow effects | CSS `@keyframes` | Pulsing blue glow on interactive elements (`.glow-blue`) |
| 3D solar system | Three.js / R3F | Interactive orbital model with camera controls |

---

## 🔒 Security Model

| Layer | Implementation |
|---|---|
| **Authentication** | Supabase Auth with email/password; JWT-based session tokens |
| **Bot Protection** | hCaptcha on signup form; server-side token validation via `/api/verify-captcha` |
| **Route Protection** | `AuthGuard` component checks `supabase.auth.getUser()` and redirects unauthenticated users |
| **Row-Level Security** | All Supabase tables enforce RLS; public SELECT, authenticated INSERT |
| **Client Validation** | `isSupabaseConfigured()` validates env vars before making API calls; graceful fallback with warning |
| **Profile Integrity** | `ensureProfile()` runs on every `SIGNED_IN` event as a fallback for the DB trigger |
| **Secret Management** | `HCAPTCHA_SECRET_KEY` is server-only; `NEXT_PUBLIC_*` prefix controls client exposure |
| **Image Domains** | `next.config.js` allowlists only `*.supabase.co`, `*.supabase.in`, and `apod.nasa.gov` |

---

## 🌍 Deployment

### Vercel (Recommended)

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add the environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js and configures the build

### Other Platforms

Any Node.js hosting that supports Next.js 14:

```bash
npm run build    # Generates .next/ production output
npm start        # Starts the production server on port 3000
```

Ensure all environment variables are set in your hosting platform's configuration.

---

## 🤝 Contributing

We welcome contributions from club members and the open-source community. Whether it's a bug fix, a new feature, a performance improvement, or a documentation update — every contribution matters.

### Development Workflow

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Develop** with the dev server running:
   ```bash
   npm run dev
   ```
5. **Lint** your changes:
   ```bash
   npm run lint
   ```
6. **Build** to verify there are no type errors:
   ```bash
   npm run build
   ```
7. **Commit** using clear, descriptive messages:
   ```bash
   git commit -m "feat: add real-time meteor shower alerts"
   ```
8. **Push** and open a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Convention

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvement |
| `chore:` | Build/tooling changes |

---

## 📬 Connect With Us

- **Email:** [astrosciclubjadavpur@gmail.com](mailto:astrosciclubjadavpur@gmail.com)
- **Social:** Find us on Instagram, Twitter/X, YouTube, LinkedIn, and GitHub — links are configured in `config/siteConfig.ts` and displayed in the site footer.

---

## 📄 License

This project is maintained by the **AstroSci Club, Jadavpur University**.  
Built with ❤️ under the stars of Kolkata.

---

<div align="center">

**[⬆ Back to Top](#-astrosci--jadavpur-university)**

</div>
