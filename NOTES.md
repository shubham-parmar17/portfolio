# Engineering Notes

- B01: Reverted to the original vibrant electric cobalt blue theme (`--bg: #2038E8;` and `--ink: #F4F2EC;`) with high-contrast surfaces (`--pmute: #232c7a;`).
- B02: Restored the horizontal sliding roadmap rail (`.jTrack` + `.jCard`) with arrow controls (`←` / `→`), smooth horizontal scroll snapping, and programmatic navigation locking to eliminate scroll observer race conditions.
- B03: Preserved single source of truth in `src/data.js` with honest student role ("Computer Science & Engineering Student" at Chandigarh University, graduating 2028), structured skill taxonomy, and verified projects.
- B04: Verified full WCAG 2 AA compliance (0 violations via axe-core) and responsive layouts across mobile (375px), tablet (768px), and desktop (1440px).
- B05: Production build minification enabled with esbuild, producing an optimized bundle (~343 kB / 121 kB gzip).
