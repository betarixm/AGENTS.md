# AGENTS.md

Off-the-shelf `AGENTS.md` composer for AI coding agents.  
Select guides, reorder them, and export markdown instructions through route-based output.

## Features

- Curated guide library (`src/data/guides/*.md`)
- Drag-and-drop guide ordering
- Dynamic export route:
  - `/AGENTS.md` (all guides)
  - `/:key/AGENTS.md` (selected guides)
- Copy-ready `curl` command generation
- Built with Astro + React + Tailwind CSS v4 + Motion

## Getting Started

```bash
bun install
bun dev
```

Open `http://localhost:4321`.

## Scripts

```bash
bun dev      # start dev server
bun build    # production build
bun preview  # preview build
bun astro    # astro cli
```

## Project Structure

```text
.
├── src/
│   ├── components/
│   │   └── guide-composer.tsx
│   ├── data/
│   │   └── guides/
│   │       ├── clean-code.md
│   │       ├── javascript.md
│   │       ├── next.js.md
│   │       ├── react.md
│   │       └── typescript.md
│   ├── lib/
│   │   ├── compose-markdown.ts
│   │   └── guide-route-combinations.ts
│   └── pages/
│       ├── index.astro
│       ├── AGENTS.md.ts
│       └── [key]/AGENTS.md.ts
├── public/
└── package.json
```

## How It Works

1. Guides are loaded from Astro content collections.
2. Users select and reorder guides in the composer UI.
3. The app builds a route path and provides a `curl` command.
4. Markdown is composed on demand via `AGENTS.md` routes.

## License

MIT
