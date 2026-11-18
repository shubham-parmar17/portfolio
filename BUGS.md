# Portfolio Verification & Bug Resolution Log

Date: 18 November 2026

## Environment and Verification Status

- `npm run build`: Passes cleanly with zero warnings or errors. Production JS bundle size reduced from 662 kB to 344 kB (121 kB gzip) with esbuild minification enabled.
- Playwright End-to-End Suite: **36 passed, 3 skipped** (contact form fixture skipped as intended).
- All 3 device profiles verified: Mobile (iPhone 13 @ 375x812), Tablet (iPad Mini @ 768x1024), Desktop (@ 1440x900).
- WCAG 2 AA Accessibility (axe-core): **Zero serious or critical accessibility violations** across all viewports.
- Layout & Responsiveness: Zero horizontal overflow on any viewport; CLS (Cumulative Layout Shift) < 0.1.

## Findings & Resolutions

| ID | Category | Component / Area | Issue | Resolution | Status |
|---|---|---|---|---|---|
| B01 | Content & Alignment | `src/data.js`, `Home.jsx` | Discrepancy between role/bio/stack and user specifications. | Updated role to "Computer Science & Engineering Student", bio to match studies at Chandigarh University (graduating 2028), skills grouped into Languages, Frontend, Backend, Databases, Tools. | Fixed |
| B02 | Structure & Content | New `Education.jsx`, `Home.jsx` | Missing Education and comprehensive About Me sections. | Added dedicated Education component highlighting BE in CSE at Chandigarh University (2024–2028) and expanded About section with background, technical focus, and goals. | Fixed |
| B03 | Navigation & UX | `App.jsx`, `Bits.jsx`, `Home.jsx` | Missing in-page section navigation to Projects, Roadmap, Skills, Education, About, and Contact. | Implemented responsive `SectionLink` components and hero CTA buttons with Lenis smooth-scrolling integration. | Fixed |
| B04 | Accessibility & WCAG | `styles.css`, `Journey.jsx` | Low contrast ratios on `.projNum`, `.subhead`, roadmap stops, and animated text. | Standardized text contrast to exceed WCAG 2 AA (4.5:1 ratio threshold); eliminated low-opacity states on foreground content. | Fixed |
| B05 | Interaction & Roadmap | `Journey.jsx` | Programmatic phase navigation desynchronized when scrolling on desktop/tablet viewports. | Integrated ScrollTrigger target calculations with navigation lock flag to prevent observer race conditions. | Fixed |
| B06 | Performance & Build | `vite.config.js` | Production build generated unminified JavaScript (662 kB). | Enabled `esbuild` minification and CSS minification in Vite, cutting bundle size down to 344 kB (121 kB gzip). | Fixed |
| B07 | Security & Standards | `index.html` | Outdated meta titles, descriptions, and unstructured JSON-LD. | Updated meta tags to match actual student role and verified `rel="noopener noreferrer"` across all external links. | Fixed |
