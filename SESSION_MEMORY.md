# Project-Onelito 2 — Session Memory

Purpose: read this file at the start of each new session so work continues in the correct folder with current status, decisions, and constraints.

Last reviewed: 2026-10-24

## Start here

1. Confirm working directory is `C:\Users\user\Documents\Project-Onelito 2`. Do not use the similarly named `Project-Onelito` folder.
2. Read `.hermes.md`, this file, `PROGRESS.md`, `PRD.md`, `DESIGN.md`, and `NEXT_STEPS.md` before making changes.
3. Check actual source/status before claiming a feature exists; documents can lag code.
4. Record every project change in `PROGRESS.md` with date, summary, changed files, and verification.
5. Before code, database/schema, external-service, or deployment changes: explain findings, proposed changes, files, and risks; wait for explicit user approval. Preserve user files. Do not alter Supabase, Cloudinary, or deployment without separate approval.

## Project identity and current state

- Product: Koi House — Rekap Pembelian Ikan Jepang (Fish Finance Dashboard).
- Stack: React 18, Vite, TypeScript, CSS, Lucide React. `npm run build` runs TypeScript + Vite; `npm run lint` currently runs TypeScript check (`tsc -b --pretty`).
- Current phase: local UI prototype. No connected backend, database, authentication, Supabase, Cloudinary, or deployment.
- Fish records and CRUD use in-memory React state; do not imply records persist after page reload. Light/Dark choice is saved in `localStorage` (`fish-theme`).
- The `Settings` sidebar item is a placeholder; it shows a toast. Do not describe it as functional settings.
- No external database or cloud service has been modified as part of this project work.

## Current interface and behavior

- Dashboard title: `Rekap Pembelian Ikan Jepang`.
- Desktop: left Koi House sidebar; `Rekap Ikan` and `Settings`; right-side top bar says `Workspace/Rekap Ikan` and holds Light/Dark toggle. Mobile: responsive sidebar drawer.
- Main actions: add fish, search/filter table, PDF/print.
- Table columns in order: Fish (image/name), Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit (edit/delete actions).
- Owner appears in filter and summary, not as table column. Sorting supports name, owner, total. Filters include owner and certificate status. Search checks fish name and owner.
- Dealer Fee percentage and amount belong together at right side of Dealer Fee cell; current CSS uses a compact flex group with 4px gap. Keep them visually associated; do not put the percentage at far left of the cell or reserve a large empty track.
- T&C table cell shows short one-line preview and adjacent `Detail` button. The dialog shows full T&C and fish name.
- Sample terms, preserve exact text:
  - `Free azukari 1 season until September 2027`
  - `Breeder guarantee 100%`
  - `Free entry fish & handling fish AJKS 2027`
- Sample records populate these terms. Edits are local state only.
- PDF button requires one owner; selecting `All Owners` shows a message instead. It calls `window.print()`; this is browser print-to-PDF, not a dedicated PDF generator. Print stylesheet hides thumbnail images and edit/delete actions. Actual print output is unverified; do not claim PDF includes images or complete layout until tested.
- Excel and CSV export were removed by user request. Do not restore unless explicitly asked.
- Table is wide and horizontally scrollable inside its container; preserve no page-level horizontal overflow.
- User prefers iterative UI changes based on their feedback, concise Bahasa Indonesia, and exact reference matching. For current project, inspect first; explain proposed code/database changes and wait for explicit approval. Subtle purposeful motion only.

## Project documents

- `.hermes.md`: active folder, feature truth, approval gates, progress logging rules.
- `PRD.md`: requirements. Distinguish implemented local prototype from future online MVP. It still needs a final consistency audit: duplicate section numbering exists; some MVP/cloud requirements are target-state requirements and need clear status labels; PDF is browser print and images are currently hidden.
- `DESIGN.md`: last updated 2026-10-24 to identify current local UI, actual palette, compact typography, table columns/T&C, fee association, owner summary, and print behavior. Read it before UI work.
- `NEXT_STEPS.md`: phase guide. Current UI is largely implemented; review print output, persistence behavior, validation, accessibility, and viewport behavior before planning integrations. Do not treat planned integrations as implemented. Audit remaining phase statements for consistency.
- `PROGRESS.md`: chronological log plus current project snapshot. Preserve history; add new entries, do not replace the full log.

## Known project requirements and product decisions

- Owner is free text; one full-access account is target if/when authentication is approved.
- Calculations: `Harga Rupiah = Harga Yen × Kurs` when both are supplied; otherwise Harga Rupiah may be entered manually. `Dealer Fee = Harga Rupiah × persen / 100`. `Total = Harga Rupiah + Dealer Fee + Shipping Cost`; blank shipping cost means Rp0. Do not round fee unless requirement changes.
- T&C is per fish. Certificate status is per fish.
- Desired image behavior: JPG/JPEG/PNG, max 10 MB before compression; whole image without cropping; table thumbnail and detail preview. Cloudinary remains only a future target, not a live integration.
- User removed Excel export; PDF remains the only export action.
- Automatic cloud backup was removed from MVP. Stock sheet, OCR, notifications, complex roles/analytics and similar items are deferred per PRD.

## Verification history and next work

- Most recent source change before latest documentation work: Dealer Fee grouping CSS. `npm run build` and `npm run lint` passed.
- Documentation edits were made to `.hermes.md`, `DESIGN.md`, `NEXT_STEPS.md`, `PRD.md`, `PROGRESS.md`; `DESIGN.md` was further updated. Build/lint passed after initial document sync; rerun for any new source changes. Document-only edits do not change app runtime.
- First useful next action: audit `PRD.md` and `NEXT_STEPS.md` for duplicate numbering and stale implementation claims, then update `PROGRESS.md` with the handoff-file creation. Do not change app code or connect services unless user asks and approves.
