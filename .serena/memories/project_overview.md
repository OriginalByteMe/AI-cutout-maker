## Project overview
- Next.js 16 (pages router) frontend for an AI cutout generator; Mantine UI + Tailwind utility classes.
- Wraps pages in `layouts/layout.tsx` with `MantineProvider` and `AppShell`, navbar header. Theme customization lives in `theme.ts` (custom Loader binding).
- Key areas: `components/` (UI incl. NavBar, ColorSchemeToggle, cutout UI pieces), `hooks/` (upload/cutout helpers, warming), `pages/` (home, upload flow, dynamic cutout view), `styles/` (global.css, loader module), `layouts/` (layout wrapper), `theme.ts` (Mantine theme overrides).
- Tooling: Yarn 4 (berry), TypeScript, ESLint (mantine + Next + jest/testing-library), Prettier, Jest/RTL, Storybook. Tailwind configured via `tailwind.config.js` content scan.
- Uses Mantine core/carousel/hooks, Tabler icons, react-icons, framer-motion, axios, files-ui for upload.
