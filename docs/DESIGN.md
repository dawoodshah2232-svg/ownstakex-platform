# OwnStakeX — Design system

Light premium, orange + deep navy, mobile-first. (Rebrand of the Bridging Investments demo, 2026-10-01.)

## Palette (`frontend/src/index.css` `:root`)
- Orange: `--orange:#f97316`, `--orange2:#ff9e2c`, `--orange-deep:#dd5f06`, gradient `--grad:linear-gradient(100deg,#f97316,#ff9e2c 60%,#f97316)`
- Navy: `--navy:#0e1a2b` (text/headers), line `rgba(14,26,43,.1/.18)`
- Gold accents: `--gold:#d99a1f`, `--gold2:#f2c14e`
- Backgrounds: `--bg:#ffffff`, `--bg2:#faf7f1`, surfaces white / `#f4efe4`
- Muted text: `--muted:#55657b`, `--dim:#8d99ab`

## Typography
- Apple stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Body 16px / 1.6, antialiased. Gradient text effect available via `.grad-text`.

## Components
- Buttons: `.btn` variants — `btn-primary` (orange gradient), `btn-ghost`, `btn-sm`. Never combine a display-setting `.btn-*` class with `hidden` + responsive show without the mobile override rule (see FlexSpot lesson).
- Radius: `--r:20px` cards, `--r-sm:14px` inputs; shadow `0 24px 60px -24px rgba(14,26,43,.22)`.
- Fixed blur nav (`header.nav`, 74px, blur 14px, `.scrolled` state); mobile drawer menu.
- `Reveal` component for scroll-triggered reveals; page head pattern `.page > .container > .page-head > h1`.
- Logo: `logo.png` (light) / `logo-white.png` (dark) used raw — no card/box behind them.
- Tap targets ≥44px; no horizontal scroll (`overflow-x:clip`).
