# AstroSci Club — Jadavpur University

> Exploring the cosmos from the heart of Jadavpur University

The official website for **AstroSci**, the astronomy and astrophotography club at Jadavpur University, Kolkata. Founded in 2018, we're a community of astronomers, astrophotographers, and space enthusiasts charting the universe together.

---

## What's Inside

- **Landing page** with an animated starfield and hero section
- **Event countdown** timer for upcoming observation nights and workshops
- **Photo of the Week** — showcasing astrophotography from our members
- **Gallery** of member-submitted images (nebulae, galaxies, eclipses, and more)
- **Nebula Digest** — our club magazine preview
- **Join page** for new members to sign up

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Fonts | Orbitron, Space Mono (Google Fonts) |

## Getting Started

**Prerequisites:** Node.js 18+ and npm

1. Clone the repo:

   ```bash
   git clone https://github.com/Archemasachika7/astrosci-website.git
   cd astrosci-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint across the codebase |

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout (metadata, fonts, global styles)
│   ├── page.tsx            # Home page — assembles all sections
│   ├── globals.css         # Tailwind directives and custom CSS
│   └── join/
│       └── page.tsx        # Membership sign-up page
├── components/
│   ├── Navbar.tsx           # Responsive navigation bar
│   ├── HeroSection.tsx      # Animated hero with starfield canvas
│   ├── EventCountdown.tsx   # Live countdown timer
│   ├── POTWSection.tsx      # Photo of the Week section
│   ├── POTWPreview.tsx      # POTW preview card
│   ├── WidgetSection.tsx    # Info widgets
│   ├── GalleryPreview.tsx   # Astrophotography gallery grid
│   ├── MagazinePreview.tsx  # Nebula Digest magazine preview
│   ├── JoinSection.tsx      # Call-to-action to join the club
│   ├── StarBackground.tsx   # Full-page twinkling star canvas
│   └── Footer.tsx           # Footer with social links
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## Contributing

We welcome contributions from club members and the wider community. Feel free to open an issue or submit a pull request — whether it's a bug fix, a new feature, or a design tweak.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Connect With Us

Find us on Instagram, Twitter/X, YouTube, and LinkedIn — links are in the site footer.

## License

This project is maintained by the AstroSci Club, Jadavpur University.
