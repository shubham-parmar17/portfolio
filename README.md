# Portfolio — Shubham

Personal portfolio built with React, Vite, React Router, GSAP ScrollTrigger, and Lenis.

## Run locally

```bash
npm install
npm run dev       # Start the development server
npm run build     # Build the site to ./dist
npm run preview   # Preview the production build
npm test          # Build and run the Playwright suite
npm run test:ui   # Run Playwright in interactive mode
npm run lighthouse # Run Lighthouse CI
```

## Project structure

- Content: `src/data/` (`profile.js`, `projects.js`, `roadmap.js`, and `skills.js`)
- Views: `src/pages/Home.jsx` and `src/pages/Case.jsx`
- Components: `src/components/`
- Design tokens and themes: `src/styles.css`
- Browser checks: `tests/portfolio.spec.js` and `playwright.config.js`

## Features

- Two persistent themes using the Transit Map color system.
- Expandable project rows and dedicated case study routes.
- An animated, pinned roadmap on desktop, a vertical scroll rail on mobile, and a static reduced-motion version.
- Skills and education sections, responsive navigation, and a GitHub contact fallback.
- Keyboard focus styling, skip navigation, reduced-motion support, and Playwright/axe checks.

The content uses the existing portfolio facts. Email and LinkedIn are blank in `src/data/profile.js` until those details are provided.

## Deployment

Run `npm run build` to create `dist/`. Hash routing allows static hosting without server rewrite rules.
