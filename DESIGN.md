---
version: local-ui-prototype
name: Koi House — Rekap Pembelian Ikan Jepang
description: Local finance dashboard prototype for fish purchase records, pricing, owner totals, and direct PDF export.
project_status: local UI prototype; no connected backend or deployment.
colors:
  primary: "#111827"
  secondary: "#3478F6"
  tertiary: "#DF5C5C"
  neutral: "#F1F4F9"
  background: "#F1F4F9"
  surface: "#FFFFFF"
  foreground: "#162238"
  muted: "#77849A"
  border: "#E3E9F2"
  success: "#28A66D"
  warning: "#9A6B18"
  danger: "#DF5C5C"
  darkBackground: "#111827"
  darkSurface: "#1D2839"
  darkForeground: "#EDF2FA"
  darkMuted: "#9BA9BD"
  darkBorder: "#354358"
typography:
  display:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  heading:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  table-preview:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  compact-label:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 6px
  md: 10px
  lg: 14px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-primary-hover:
    backgroundColor: "#1D4ED8"
    textColor: "#FFFFFF"
  button-danger:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 10px 16px
  button-danger-hover:
    backgroundColor: "#B91C1C"
    textColor: "#FFFFFF"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 10px 12px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 24px
  table:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 16px
  page-background:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
  muted-text:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.muted}"
  field-border:
    backgroundColor: "{colors.border}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  dark-field-border:
    backgroundColor: "{colors.darkBorder}"
    textColor: "{colors.darkForeground}"
    rounded: "{rounded.md}"
  success-status:
    backgroundColor: "{colors.success}"
    textColor: "#FFFFFF"
  warning-status:
    backgroundColor: "{colors.warning}"
    textColor: "#FFFFFF"
  danger-status:
    backgroundColor: "{colors.danger}"
    textColor: "#FFFFFF"
  dark-theme-surface:
    backgroundColor: "{colors.darkSurface}"
    textColor: "{colors.darkForeground}"
  dark-theme-border:
    backgroundColor: "{colors.darkBackground}"
    textColor: "{colors.darkMuted}"
    rounded: "{rounded.md}"

---

## Overview

Fish Admin Finance Dashboard uses a modern finance-dashboard visual language. The interface must feel reliable, efficient, and easy to scan during repeated admin data entry. Use charcoal for structure, blue for normal interaction, and red only for danger, urgency, or deliberate business emphasis.

Support Light and Dark modes with a user-controlled theme switch. Do not use pure black as the main dark background; use charcoal surfaces to preserve hierarchy and reduce eye strain.

The interface is medium-density: enough rows and financial values remain visible without making controls cramped. Motion stays subtle and purposeful, normally 150–250ms, with reduced-motion support.

## Colors

- **Primary (#111827):** Charcoal structure, headings, navigation emphasis, and high-contrast text.
- **Secondary (#3478F6):** Main interaction color for primary actions, links, focus, selected filters, and information states.
- **Tertiary (#DF5C5C):** Destructive actions and validation errors. Do not use red for ordinary actions.
- **Neutral (#F1F4F9):** Light-mode page background and secondary surfaces.
- **Success (#28A66D):** Successful save and positive confirmation.
- **Warning (#9A6B18):** Incomplete certificate or attention-needed state.
- **Dark background (#111827):** Dark-mode page background.
- **Dark surface (#1D2839):** Dark-mode cards, table surfaces, sidebar, and dialogs.

Every interactive control needs a visible focus state. Text and controls must meet WCAG AA contrast targets. Never communicate status through color alone; pair color with text, icon, or another visible indicator.

## Typography

Use Inter consistently for a clean financial-dashboard tone. Use weight and size to establish hierarchy, not decorative typefaces or excessive uppercase text.

- Display text is reserved for page titles or important total summaries.
- Headings identify sections and summary cards.
- Body text handles fish names, owner names, terms, and table values.
- Labels remain visible above or beside form fields; placeholders never replace labels.
- Currency values use tabular or right-aligned numeric presentation where supported.

## Layout

Mobile-first is mandatory because the application is used more often on handphone than on PC or laptop. Desktop remains a complete, polished dashboard rather than a stretched mobile layout.

Viewport targets:

- Primary mobile: iPhone 11 portrait, `390 × 844 CSS px`.
- Minimum mobile: `360 × 800 CSS px`.
- Mobile landscape: `844 × 390 CSS px`.
- Laptop: `1366 × 768 CSS px`.
- Desktop: `1440 × 900 CSS px`.

Desktop uses a persistent left sidebar and a flexible main content area. Current sidebar retains Rekap Ikan and Settings; Koi House brand aligns vertically with the right-side top bar, which shows Workspace/Rekap Ikan and the theme toggle. Mobile uses a responsive header and sidebar drawer. Do not document account controls unless implemented. Use CSS viewport sizes for testing, not physical screen resolution.

Responsive rules:

- No horizontal scroll on the page shell.
- Horizontal scroll allowed only inside wide-table container when needed.
- Mobile forms use one column.
- Filters wrap or move into a menu/drawer.
- Primary actions stay reachable by thumb.
- Current UI is medium-density: body/table values are generally `14px`, T&C preview `13px`, compact labels `10–12px`, and main controls are generally `38–42px`; mobile overrides vary. These are current measurements, not an accessibility pass.
- Improve touch targets toward `44 × 44px` where layout allows, especially mobile; keep icon-only actions visibly focusable and labeled.
- Treat `16px` body text as a readability target for future mobile forms/long-form content, not as a description of current table typography.
- Preserve desktop whitespace, hierarchy, sidebar, medium-density table, and visual balance.
- Test portrait and landscape states, not only one narrow width.

Current page structure:

1. Desktop sidebar; mobile drawer.
2. Right-side top bar with active Workspace/Rekap Ikan label and Light/Dark toggle.
3. Page title Rekap Pembelian Ikan Jepang and add-fish action.
4. Search/filter controls and PDF export action.
5. Financial table with columns in this order: Fish, Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit.
6. T&C cell shows a clipped one-line preview plus adjacent Detail button; full terms open in a dialog.
7. Owner/count summary and grand total below the table.

Keep content width readable. Allow horizontal scrolling only inside the wide financial table container on small screens; never force page-level overflow. Preserve clear alignment: text left, numeric currency right, status readable. Keep T&C preview and Detail inside their own column, with clear separation from Edit. Do not describe summary cards, loading states, or error states as implemented unless verified in code.

## Elevation & Depth

Use restrained elevation. Prefer border plus a light shadow over floating layers everywhere. Cards, dialogs, and dropdowns must remain visually distinct in both themes.

- Cards: subtle border and low shadow.
- Dialogs: stronger shadow and clear backdrop.
- Table rows: use hover or selected background, not heavy row shadows.
- Avoid glassmorphism, glowing neon effects, and decorative gradients.

## Shapes

Use medium corner radius as the default:

- Small controls: 6px.
- Inputs, buttons, badges, cards, and table: 10px.
- Large containers or dialogs: 14px only when it improves grouping.

Do not mix sharp corners and highly rounded pill shapes without a semantic reason. Pills are reserved for compact status badges and filter tokens.

## Components

### Fish entry form

Group fields by purpose: identity, pricing, fees, delivery, and documentation. Show currency prefixes clearly. Recalculate derived price, dealer fee, and total from current form state. In the current UI, price is Yen × Kurs when both are supplied; otherwise Rupiah can be entered manually. The current form displays whole Rupiah amounts; do not describe fractional fee display as implemented. Owner selection uses existing-owner dropdown plus a separate `+ Owner Baru` link; reject new names that match existing owners ignoring case. Editing selects the record's owner by default.

### Fish images — current behavior and future integration

Current local UI accepts JPG/JPEG/PNG up to 10 MB, stores the selected image as a data URL in in-memory React state, and does not compress or upload it to a service. Use `object-fit: contain` in thumbnails, form preview, detail modal, and generated PDF; preserve aspect ratio and do not crop. Table thumbnails load lazily; clicking opens a detail dialog. The generated PDF embeds available images proportionally within a 20 × 20 mm box. Cloudinary/Supabase storage is a future target only and requires separate approval and implementation.

### Dialogs and feedback

Input/edit form dialogs use theme-aware scrollbars and lock background-page scrolling while open; the dialog remains scrollable. Delete uses an in-app confirmation dialog, with cancel/outside click/Escape closing without deletion. Toasts remain horizontally centered during entry animation; a new toast resets its visible duration.
### Financial table

Use medium row height, thumbnail image, clear column headings, right-aligned numeric values, and visible edit/delete actions. Long fish names may clamp within the row. T&C uses a short single-line preview and adjacent Detail button; full value opens in a dialog. Keep both controls within T&C column and clear of Edit. Dealer Fee percentage and amount form one compact, right-aligned group with stable alignment. Do not hide critical totals behind hover.

### Owner summary and grand total

Current UI places owner, record count, and grand total below the table, not in summary cards. Keep charcoal, blue, and neutral surfaces. Reserve red for danger, error, or a deliberate cost signal. Grand total should have strongest hierarchy among summary values and stay readable in both themes.

### Status and certificate

Use text plus visual status. Certificate checkbox state must be understandable without color. Use labels such as `Ada` and `Belum ada`.

### PDF export

The current PDF button requires one owner to be selected; when `All Owners` is selected it shows a toast and does not export. It uses jsPDF + jspdf-autotable to download a generated A4 landscape PDF directly, not the browser print dialog. The PDF includes fish images contained proportionally within a 20 × 20 mm area, full T&C, certificate status, owner, print date, and grand total. Preserve the dedicated PDF layout and test the downloaded output when changing it. PDF is the only export action; do not add Excel/CSV without explicit request.

### Theme switch

Provide a clear Light/Dark/System choice or a Light/Dark toggle. Persist the user choice. Avoid flashing the wrong theme during page load.

## Do's and Don'ts

### Do

- Keep blue as normal interaction color and red for danger or deliberate emphasis.
- Maintain readable contrast in Light and Dark modes.
- Keep labels, validation messages, and focus rings visible.
- Use subtle 150–250ms transitions and respect reduced motion.
- Align currency values consistently.
- Preserve user-entered data during validation errors.
- Use real image thumbnails with a clear fallback when no image exists.
- Show loading and save feedback for remote database operations.

### Don't

- Do not use red for every primary button or ordinary link.
- Do not use emoji as interface icons.
- Do not use pure black backgrounds or low-contrast gray text in Dark mode.
- Do not make tables dense enough to require guesswork.
- Do not hide totals, errors, or certificate state in hover-only interactions.
- Do not add decorative animation that slows repeated data entry.
- Do not use placeholder-only form labels.
- Do not add gradient-heavy, glassmorphism, or neon styling inconsistent with a finance dashboard.
