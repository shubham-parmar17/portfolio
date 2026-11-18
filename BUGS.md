# Portfolio Verification & Bug Resolution Log

Date: 18 November 2026

## Environment and Verification Status

- `npm run build`: Passes cleanly with zero warnings or errors. Production JS bundle size: 343.6 kB (121.3 kB gzip) with esbuild minification.
- Playwright End-to-End Suite: **36 passed, 3 skipped** (T7 contact form fixture intentionally skipped due to static frontend setup).
- Viewports verified: Mobile (iPhone 13 @ 375x812), Tablet (iPad Mini @ 768x1024), Desktop (@ 1440x900).
- WCAG 2 AA Accessibility (axe-core): **Zero serious or critical accessibility violations** across all themes and viewports.
- Theme: Restored electric cobalt blue theme (`#2038E8` / `#F4F2EC`) as requested.
- Roadmap: Restored horizontal sliding card rail (`.jTrack` / `.jCard`) with smooth arrow navigation.

## Findings & Resolutions

| ID | Category | Component / Area | Issue | Resolution | Status |
|---|---|---|---|---|---|
| B01 | Theme & Aesthetics | `src/styles.css`, `src/App.jsx`, `index.html` | Restored original vibrant electric cobalt blue theme (`--bg: #2038E8;`). | Replaced temporary `#1D4C9E` / `#2F6FDE` colors with `#2038E8` and cream `#F4F2EC`. | Fixed |
| B02 | Journey & Roadmap | `src/components/Journey.jsx`, `src/styles.css` | Restored horizontal sliding roadmap animation requested by user. | Replaced transit map SVG route with the horizontal sliding card rail (`.jTrack` + `.jCard`), progress indicator, and smooth programmatic navigation. | Fixed |
| B03 | Accessibility & WCAG | `styles.css`, `tests/portfolio.spec.js` | Contrast ratio compliance on paper and blue surfaces. | Adjusted contrast colors (`--pmute: #232c7a`) to exceed WCAG 2 AA (4.5:1 ratio); axe reports 0 violations. | Fixed |
| B04 | Content & Truthfulness | `src/data.js`, `Home.jsx` | Accurate student representation. | Single source of truth with BE in CSE at Chandigarh University (2024–2028), skills grouped into 5 categories, and verified projects. | Fixed |
| B05 | Performance & Build | `vite.config.js` | Production build optimization. | Enabled `esbuild` and CSS minification in Vite config. | Fixed |
