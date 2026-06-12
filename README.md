# AI Cutout Maker — Frontend

Next.js 16 (App Router) frontend for the [AI Image Cutout Maker backend](https://github.com/OriginalByteMe/AI_Image_cutout_maker), powered by SAM 3 on Modal.

Describe what you want cut out of your images and videos — every matching subject comes back as a transparent PNG, a WhatsApp-ready sticker (512x512 WebP), or a transparent-background WebM for videos.

## Pages

- `/` — landing page
- `/studio` — bulk image cutouts: drop many images, add subject prompts, tune the confidence threshold, download individual PNGs/stickers or everything as a zip
- `/video` — video cutouts: upload a clip, describe a subject, poll the async job, preview & download the alpha WebM

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Mantine 9** for UI, **@tabler/icons-react** for icons
- **TanStack Query 5** for mutations/polling
- **Zod 4** validates every API response at runtime (`lib/api.ts` is the single typed API client)
- **Vitest + Testing Library** for tests, **ESLint 9 (flat config) + Prettier** for hygiene

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your Modal gateway URL
npm run dev
```

`NEXT_PUBLIC_API_URL` should point at the deployed Modal gateway, e.g.
`https://<workspace>--cutout-generator-api.modal.run`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `start` | production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run format` / `format:check` | Prettier |
| `npm run check` | format check + lint + typecheck + tests (what CI runs) |

## CI

`.github/workflows/ci.yml` runs format check, lint, typecheck, tests and a production build on every push/PR.

## Note on zip downloads

"Download all as zip" fetches the presigned S3 URLs from the browser, so the S3 bucket needs a CORS rule allowing `GET` from your frontend origin. Single-file downloads and previews work without it.
