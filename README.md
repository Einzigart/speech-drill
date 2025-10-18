# SpeechDrill

SpeechDrill is a practice studio for teleprompter-style public speaking drills. The app ships with a curated catalog of speeches, adaptive playback controls, and a responsive reader that highlights progress word by word so you can rehearse at any difficulty level.

## Highlights
- Advanced teleprompter workspace with animated playback, word-level tracking, and theme toggle (light or dark).
- Difficulty presets that auto-adjust scroll speed, typography, and highlighting to match learner levels.
- Speech library with filters for difficulty and category plus quick randomization to introduce variety.
- Auto-fit typography that adapts to viewport size while keeping readability and pacing balanced.
- Session metrics for pace, remaining words, and estimated time left to keep practice runs focused.

## Tech Stack
- Next.js App Router with React Server Components for routing and layouts.
- Bun as the JavaScript runtime and package manager.
- Tailwind CSS via shadcn/ui primitives for design consistency.
- Framer Motion for micro-interactions across the workspace.

## Getting Started

Install dependencies:
```bash
bun install
```

Run the development server:
```bash
bun run dev
```
Visit `http://localhost:3000` to open the Teleprompter workspace.

## Available Scripts
- `bun run dev` – Turbopack development server with fast refresh.
- `bun run lint` – Next.js ESLint and Tailwind checks; required before submitting changes.
- `bun run build` – Production bundle (runs type checking and static generation).
- `bun run start` – Serves the compiled build for production-like verification.

## Project Structure
- `src/app` – App Router entry points, including the main teleprompter route.
- `src/components/ui` – Shared shadcn/ui primitives.
- `src/components/teleprompter` – Teleprompter feature components and hooks.
- `src/components/speech` – Speech library and selection UI.
- `src/lib` – Domain utilities, configuration, and typed helpers.
- `src/data/speeches.json` – Curated dataset of practice speeches.

## Development Workflow
1. Implement changes in `src/` using TypeScript-first React components.
2. Run `bun run lint` and `bun run build` to validate formatting, types, and build output.
3. Manually QA the teleprompter: verify playback controls, slider behavior, theme toggles, and random speech selection.
4. When opening a PR, include a concise summary plus screenshots or screen recordings for UI changes.

## License
SpeechDrill is released under the MIT License. See `LICENSE` for details.
