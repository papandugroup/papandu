# PAPANDU — Reconciled Brand Guidelines for Development

Reconciles `PAPANDU Design Brief-V2.pdf` (partnership brief for the identity designer) against `Papandu Website Copy.docx` (the developer-facing brand section) — and, where they still disagreed, settles it against the **actual shipped logo files** in `public/brand/logos/`, which are the ground truth since they're already-approved production assets.

---

## 1. Colour system

### Confirmed core palette (use these for site chrome)

| Token | Hex | Source | Use |
|---|---|---|---|
| `papandu-black` | `#090A0E` | Matches the shipped `papandu-logo-Black.svg` fill exactly, and matches Website Copy's "Jet Black." Supersedes the Design Brief mock-up's `#420001` — whoever built the logo already made this call. | Primary background / primary text |
| `papandu-red` | `#760504` | Matches **all three** sources: Design Brief, Website Copy, and the shipped `papandu-logo-Full Colour.svg` (its only fill colour). | Primary accent — the one colour every source agrees on |
| `papandu-gold` | `#FBDC6A` | Matches Design Brief and Website Copy. | Highlights, CTAs, "NEW"/"LIMITED" tags |
| `papandu-cream` | `#E2D9D2` | Design Brief only (used as the light background on brief pages) — not in Website Copy, not in the logo files. | **Confirmed (Sept 2026): the site's default background, site-wide.** Matches the brief's own page canvas. |
| `papandu-maroon-dark` | `#420001` | The Design Brief's darkest swatch (originally proposed as the near-black before the shipped logo settled that question — see "What changed and why" below). | Headline/accent-block colour and a strong dark-red for callouts (e.g. form-error text) that need to read on light backgrounds |
| `papandu-navy` | `#00057D` | Design Brief's moodboard/star-badge graphics only — not used in any shipped logo file. | Secondary accent for illustrated/campaign-art sections (star badges, comic-panel graphics), not for core UI chrome |

### Background model (confirmed Sept 2026 — applies site-wide)

The site originally shipped with `papandu-black` as the default page background everywhere, with light text throughout. The brand owner flagged this directly: the Design Brief's own pages always use a light, neutral canvas to give the collection an "elevated" feel, and colour is used in bold blocks *on top of* that canvas — never as the canvas itself. The site has been re-themed to match:

- **Default background, everywhere a page is just showing content:** `papandu-cream`. This includes the homepage content sections, shop grid, product detail page, cart drawer, all modals (email-capture, order-success, lightbox), and the About/Community/Contact pages.
- **Default text/ink on that cream background:** `papandu-black`, per the existing "Primary background / primary text" row above (the token name is legacy — on the current site it's used as ink, not as a background fill).
- **Accent-block chrome stays dark intentionally:** the sticky Header, Footer, PromoBar, and the Shop page's sticky filter bar remain on dark (`papandu-black`-family) backgrounds. These are treated as the brief's "bold dark block" moments — persistent navigational chrome, not content — and keep their existing light-on-dark text as-is.
- **Text or icons rendered over a photograph** (e.g. the community lookbook cards' gradient-overlay captions, hero badges over full-bleed photography) also stay light-on-dark, since they sit on a darkened image, not on the page's cream canvas. This is a different rule from the general page background and should be judged per-instance (is this text over a photo/overlay, or over the flat page background?).
- **`papandu-gold` is reserved for solid fills** (badges, primary gold buttons, selected-state chips) and thin decorative borders/rings, not for body text or icons directly on the cream background — gold-on-cream fails basic contrast (both are light, close in luminance). Anywhere gold was previously used as text or icon colour on what is now a cream/white surface, it has been swapped to `papandu-red`, which is the brand's confirmed high-contrast accent.
- **Solid colour blocks** (red badges, red/gold buttons, the red "For The Stars" callout badge on the About page) are unaffected by this change and continue to use the confirmed palette at full opacity, per the brief's own accent-block usage.

### Product colourway names (Shop copy only — not site chrome)

These come from Website Copy's product descriptions and should stay scoped to product data/swatches, not become page background or button colours:

- Hot Pepper `#B12B24`
- Earthy Green `#2C5E1A`
- Nude `#CB9870`

### What changed and why
- Website Copy's "Brand Guidelines for the Developer" section never mentions navy (`#00057D`), even though it's one of the Design Brief's five official colours and appears throughout the illustrated moodboard system. Recommendation above: keep it, scoped to campaign/illustration sections rather than core UI.
- The Design Brief's near-black (`#420001`) and Website Copy's near-black (`#090A0E`) disagreed. The shipped logo file settles it: `papandu-logo-Black.svg` is `#090A0E`. Use that one site-wide.
- `#E2D9D2` (cream) only appears in the Design Brief, as the light background on several brief pages. **Update (Sept 2026):** this is no longer optional — it's now the confirmed default background site-wide. See "Background model" above.

---

## 2. Logo usage

Confirmed from the actual files in `public/brand/logos/`:

- **Full Colour** (`papandu-logo-Full Colour.svg/png/jpg`) — single-fill `#760504` wordmark, star embedded between the "N" and "D." Despite the filename, it is monochrome red, not multi-colour — use it on light/cream/white backgrounds.
- **Black** (`papandu-logo-Black.svg/png/jpg`) — single-fill `#090A0E`. Use on gold, cream, or other light-to-mid backgrounds where red doesn't have enough contrast.
- **White** (`papandu-logo-White.svg/png/jpg`) — single-fill `#FFFFFF`. Use on red, navy, black, or photographic backgrounds.

There is no shipped multi-colour (red + navy + gold) version of the wordmark itself — the multi-colour treatment in the Design Brief's moodboard is campaign/poster artwork built *around* the logo, not the logo file. Don't try to recreate a tri-colour logo lockup for standard site chrome (nav, footer) — pick whichever single-colour variant has the right contrast for its background.

The star motif (the same star embedded in the wordmark) is meant to recur independently as a graphic element per the brief — e.g. as a bullet, a "sold out" flag, a section divider — separate from the logo itself.

---

## 3. Typography

| Role | Font | Source |
|---|---|---|
| Headings / display | **Girankop Condensed** | Confirmed by both Website Copy and the brand's own `papandu-font.png` reference asset |
| Body | **Merriweather** (serif) | From `papandu-font.png`, the brand's own font-reference asset |

**Flag:** Website Copy's developer section instead suggests pairing headings with *"a clean sans-serif (e.g. Inter or Helvetica)"* — that reads as a placeholder suggestion, not a locked decision (hedged with "e.g."), and it conflicts with the brand's own font-reference image, which explicitly pairs Girankop Condensed with **Merriweather**, a serif. Merriweather is also a much better stylistic match for the vintage-collegiate/varsity mood the Design Brief's moodboards are going for than a neutral grotesque like Inter would be.

**Recommendation:** use Girankop Condensed + Merriweather as shown in the brand's own reference image, and treat the Website Copy's "Inter or Helvetica" line as superseded — unless there's a reason (e.g. Girankop Condensed licensing, or Merriweather's page-weight/rendering) to fall back to a sans for body copy, in which case that should be a deliberate call, not a default.

---

## 4. Open questions for whoever owns final sign-off
1. Confirm navy (`#00057D`) is intentionally a "campaign art" colour and not meant to appear in core site UI (buttons, links, nav) — as reconciled above.
2. Confirm Merriweather (serif body) over Inter/Helvetica (sans body) per the brand's own font reference — this is a real visual-direction choice, not just a technical one.
3. `PAPANDU Design Brief-V2.pdf` (page 2) contains a stray line of what looks like leftover AI-chat text rather than brief content — worth scrubbing from the source file before it's shared further.
