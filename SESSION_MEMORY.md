# Project-Onelito 2 — Session Memory

Purpose: start each session by reading this handoff and the current project documents. Verify actual source before relying on this summary.

Last reviewed: 2026-10-27

## Start here

1. Confirm project root is `C:\Users\user\Documents\Project-Onelito 2`; do not use similarly named `Project-Onelito` folder.
2. Read `.hermes.md`, `SESSION_MEMORY.md`, `PROGRESS.md`, `PRD.md`, `DESIGN.md`, `UI_DESIGN_GUIDELINES.md`, and `NEXT_STEPS.md` before project work.
3. Check Git status and inspect source before making claims or edits.
4. User expects Bahasa Indonesia, incremental UI changes, exact adherence to feedback, and no unrelated changes.
5. Before code, database/schema, external-service, or deployment changes, explain scope, files, risks, and unresolved decisions; wait for explicit approval. Do not commit/push unless explicitly asked.
6. Record every project change in `PROGRESS.md` with date, description, changed files, and real verification.

## Verified application state

- Local React 18 + Vite + TypeScript UI prototype. No backend, auth, database, Supabase, Cloudinary, server persistence, or deployment unless later verified in code/config.
- Fish records and CRUD are in-memory; reload resets them. Light/Dark preference alone persists in `localStorage`.
- Main sections: `Rekap Ikan` and `Setting`. Setting page has prototype cards/actions; do not imply placeholder actions perform real backup/account functions.
- Responsive desktop sidebar/header and mobile drawer. Preserve Light/Dark themes and contained horizontal table scrolling; no page-level horizontal overflow.
- Current table columns: Fish, Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit.
- Owner input: dropdown of existing owners plus separate `+ Owner Baru`; reject duplicate names case-insensitively. In `All Owners`, owner name appears below fish name.
- T&C cell has short preview and Detail button; full terms open in dialog.
- Delete uses in-app confirmation modal. Input/edit modal has theme-aware scrollbar and body scroll lock. Toast remains centered; new message replaces prior timeout/exit.
- PDF is generated and downloaded directly via jsPDF + jspdf-autotable; requires one selected owner and includes full terms and proportional images. PDF is only retained export; do not restore Excel/CSV without explicit request.
- Check `src/App.tsx`, `src/App.css`, `src/index.css`, `package.json`, `PRD.md`, and `DESIGN.md` for current exact behavior before changing it.

## UI design and motion source of truth

- `UI_DESIGN_GUIDELINES.md` is the project-specific source of truth for visual style, component patterns, animation rules, accessibility, and verification. Read it before UI work.
- Preserve existing finance-dashboard style: clean, calm, modern, data-focused; token-based colors; consistent typography, spacing, radii, borders, and shadows; Light/Dark pairing.
- Motion must be subtle, meaningful, interruptible, responsive, and reduced-motion aware. Avoid blinking, endless pulses, excessive bounce, and decorative animation.
- Current motion patterns documented: Rekap Ikan section/table stagger; full-period vertical fade/scale/light blur transition; Setting heading and staggered card entrance; button hover/press/focus; period tabs and floating menu; modal enter/exit and close controls; centered toast enter/exit; breadcrumb label and single underline behavior.
- Breadcrumb: `Workspace/` stays fixed; section label fades and gently expands from the left; one underline spans actual breadcrumb width and transitions smoothly. Never add second underline. Verify CSS overrides, since a duplicate global pseudo-element rule previously overrode the intended animation.
- CSS-only micro-interactions do not warrant a new dependency by default.

## Project documents

- `.hermes.md`: working rules and concise verified app facts.
- `PRD.md`: product scope; distinguishes local prototype from future online requirements.
- `DESIGN.md`: design tokens and verified UI structure; check against active CSS if values disagree.
- `UI_DESIGN_GUIDELINES.md`: detailed visual/motion/component rules; use for new components and future UI changes.
- `NEXT_STEPS.md`: current status, remaining review, and future phases; online integrations require separate approval.
- `PROGRESS.md`: chronological history; preserve earlier entries and append new verified changes.

## Verification

- Required checks: `npm run build`, `npm run lint`, `git diff --check`.
- `npm run lint` currently runs TypeScript check (`tsc -b --pretty`).
- Vite may warn about a JavaScript chunk above 500 kB; build can still succeed. PDF libraries are lazy-loaded; verify actual PDF output if export code changes.
- Do not claim browser/UI behavior verified unless browser inspection actually confirms it.

## Current handoff

- UI animation/style rules have been added to `UI_DESIGN_GUIDELINES.md`; documentation summaries are synchronized in `.hermes.md`, `DESIGN.md`, and `NEXT_STEPS.md`.
- These documentation updates are recorded in `PROGRESS.md`; re-check status to confirm exact files and pending changes.
- An untracked PDF reference may exist: `rekap-ikan-2026-10-24.pdf`. Do not modify, stage, or delete it.
- No app-code change is requested by this memory update. Continue only from the user's next explicit task.
