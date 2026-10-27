# Project-Onelito 2 — Session Memory

Purpose: read this file at the start of each new session so work continues in the correct folder with current status, decisions, and constraints.

Last reviewed: 2026-10-27

## Current implementation snapshot — verified against source

- App is a local React 18 + Vite + TypeScript prototype; no backend/auth/database/cloud storage/deployment. Fish CRUD and records are in memory; reload resets records. Theme preference alone persists in localStorage.
- Owner input is a dropdown for existing owners plus a separate `+ Owner Baru` link; duplicate new names are rejected case-insensitively. Edit preselects record owner. Under `All Owners`, owner appears beneath fish name.
- Input/edit form modal has theme-aware scrollbar and body scroll lock. Delete action opens in-app confirmation. Toast uses centered own animation and replaces previous timeout when another message arrives.
- Export is direct PDF download through jsPDF + jspdf-autotable, not `window.print()`. A4 landscape, requires one owner, includes full T&C, owner/date/count/grand total and proportional images up to 20 × 20 mm. PDF only; no Excel/CSV.
- Table columns remain Fish, Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit. Dealer Fee percentage sits near fee nominal in a stable compact group.
- `npm run build` and `npm run lint` are the required checks; lint script currently runs TypeScript check. Build warns about a >500 kB JS chunk but succeeds.

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
- Dealer Fee percentage and amount belong together on the right side of Dealer Fee cell with a fixed compact alignment; keep them visually associated and do not reserve a large empty track.
- T&C table cell shows short one-line preview and adjacent `Detail` button. The dialog shows full T&C and fish name.
- Sample terms, preserve exact text:
  - `Free azukari 1 season until September 2027`
  - `Breeder guarantee 100%`
  - `Free entry fish & handling fish AJKS 2027`
- Sample records populate these terms. Edits are local state only.
- PDF button requires one owner; selecting `All Owners` shows a toast instead. It downloads a generated PDF via jsPDF + jspdf-autotable, with full T&C, proportional embedded images, owner, date, record count, and grand total. Do not describe it as browser print-to-PDF.
- Excel and CSV export were removed by user request. Do not restore unless explicitly asked.
- Table is wide and horizontally scrollable inside its container; preserve no page-level horizontal overflow.
- User prefers iterative UI changes based on their feedback, concise Bahasa Indonesia, and exact reference matching. For current project, inspect first; explain proposed code/database changes and wait for explicit approval. Subtle purposeful motion only.

## Project documents

- `.hermes.md`: project rules and verified feature snapshot; update when product behavior or approval gates change.
- `PRD.md`: product requirements; distinguish current local behavior from future integration goals.
- `DESIGN.md`: visual and interaction rules; read before UI work and preserve current layout/theme behavior.
- `NEXT_STEPS.md`: roadmap; mark phases/ integrations as active, complete, or future, never describe target services as connected.
- `SESSION_MEMORY.md`: concise current handoff; refresh its implementation snapshot and open work after significant changes.
- `PROGRESS.md`: chronological change log. Preserve history; append dated entries with changed files and actual verification.

## Known project requirements and product decisions

- Owner selection uses saved-owner dropdown and separate new-owner mode; one full-access account remains a future target if/when authentication is approved.
- Calculations: `Harga Rupiah = Harga Yen × Kurs` when both are supplied; otherwise Harga Rupiah may be entered manually. `Dealer Fee = Harga Rupiah × persen / 100`. `Total = Harga Rupiah + Dealer Fee + Shipping Cost`; blank shipping cost means Rp0. Do not round fee unless requirement changes.
- T&C is per fish. Certificate status is per fish.
- Desired image behavior: JPG/JPEG/PNG, max 10 MB before compression; whole image without cropping; table thumbnail and detail preview. Cloudinary remains only a future target, not a live integration.
- User removed Excel export; PDF remains the only export action.
- Automatic cloud backup was removed from MVP. Stock sheet, OCR, notifications, complex roles/analytics and similar items are deferred per PRD.

## Verification history and next work

- Latest source changes are recorded in `PROGRESS.md`; latest feature update was centered toast animation/timer replacement.
- Documentation sync completed across `.hermes.md`, `DESIGN.md`, `NEXT_STEPS.md`, `PRD.md`, `SESSION_MEMORY.md`, and `PROGRESS.md`; build/lint passed. Build warns about a >500 kB JavaScript chunk.
- Do not change app code or connect services unless user asks and approves.
