# Repository guide

## Product intent

This repository is a personal technology brand site for interviewers, investors,
and competition judges. The homepage is curated proof of value, not a chronological
blog feed. Closed-source products receive the highest visual priority, followed by
learning projects, concise engineering notes, and personal design principles.

## Stack and commands

- Astro 7, TypeScript, Markdown/MDX, and plain CSS.
- `npm run dev`: local development server.
- `npm run check`: Astro and TypeScript validation.
- `npm run build`: production static build; required before handoff.
- `npm run new:note -- <slug>`: scaffold a technical note.
- `npm run new:project -- <slug>`: scaffold a learning project.
- `npm run new:product -- <slug>`: scaffold a closed-source product case study.

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.

## Architecture boundaries

- Content belongs in `src/content/**`; never hard-code individual articles or
  projects into page components.
- Collection metadata and validation belong in `src/content.config.ts`.
- Content selection and sorting belong in `src/utils/content.ts`.
- Site identity, navigation, links, and profile placeholders belong in
  `src/data/site.ts`.
- Layouts own page shells; components own reusable presentation; pages only compose
  data and components.
- Global visual decisions belong in `src/styles/tokens.css`. Avoid one-off colors,
  spacing values, and shadows inside components when a token can express them.
- All internal links must use `withBase()` so project-style GitHub Pages paths keep
  working after `base` is configured.

## Content rules

- Use Markdown for short notes and MDX only when a case study needs components.
- Keep slugs lowercase ASCII kebab-case.
- A new content file must become routable and discoverable without editing a page.
- Use `draft: true` for incomplete content. Do not hide unfinished work with CSS.
- `featured` controls homepage inclusion; `priority` controls curated ordering.
- Do not invent performance, adoption, revenue, award, or user metrics.
- For closed-source work, publish only sanitized architecture, screenshots, decisions,
  and verified outcomes. Never publish secrets, customer data, private repository URLs,
  proprietary source, or confidential algorithms.

## UI and accessibility

- Preserve the hierarchy: identity + flagship product above the fold, then evidence,
  products, learning work, notes, principles, and contact.
- Keep motion restrained and support `prefers-reduced-motion`.
- Maintain keyboard focus states, semantic landmarks, useful alt text, and readable
  contrast. Do not make hover the only way to reveal essential information.
- Validate desktop and mobile layouts. Avoid adding a UI framework unless the user
  explicitly chooses one and the benefit outweighs the added coupling.

## Change discipline

- Prefer the smallest coherent change and preserve unrelated user edits.
- Do not commit generated `dist/`, `.astro/`, credentials, or private project assets.
- Update `README.md`, content templates, and schemas together when the authoring
  workflow changes.
- Before finishing implementation work, run `npm run check` and `npm run build`.
  Report any check that could not be run and why.
