# Youtube Queue App

## Docs

- Product spec & features: `docs/PRD.md` — read this before building anything new
- Architecture decisions: `docs/ARCHITECTURE.md` (if it exists)

## Stack

- React 19 + TypeScript, Nextjs, Tailwind, Neon Postgres
- Vitest + React Testing Library

## Structure

src/components/ # UI only, no logic
src/hooks/ # all stateful logic goes here
src/types/ # shared types, no inline `any`
src/utils/ # pure functions

## Commands

- Dev: `npm run dev`
- Test: `npm run test`
- Build: `npm run build`

## Rules

- Functional components only
- Tailwind only — no CSS modules
- IDs via crypto.randomUUID()

## Known gotchas

- YouTube IFrame API loads via global script tag + `onYouTubeIframeAPIReady` callback.
  Use a custom hook (useYouTubePlayer) to encapsulate this. Do not instantiate
  players directly in components.
