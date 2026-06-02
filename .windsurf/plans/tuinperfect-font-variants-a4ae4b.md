# Tuin Perfect Rootmap — Lettertype Varianten (A, B, C)

De klant is tevreden met de huidige rootmap (`tuin-perfect.nl`) en wil alleen de lettertypes veranderen. We maken 3 varianten: **A (standaard, root overschrijven)**, **B** (`/font-b/`), **C** (`/font-c/`). Structuur, kleuren, layout en alle functionaliteit blijven 100% identiek — alleen de `font-family` declaraties en Google Fonts `<link>` tags wijzigen per variant.

---

## Variant A — Standaard (overschrijft rootmap)

**Lettertypes**: `Outfit` (headings/nav/buttons/labels) + `Inter` (body)
- Outfit is een modern geometrisch font, professioneler en scherper dan Work Sans
- Inter blijft voor lopende tekst (uitstekende leesbaarheid)
- Alle `font-family: 'Work Sans', ...` wordt vervangen door `'Outfit', sans-serif`
- Google Fonts link wordt: `Outfit:wght@400;700;800;900`

## Variant B — Geometrisch/Bold (`/font-b/`)

**Lettertypes**: `Space Grotesk` (headings/nav/buttons/labels) + `Inter` (body)
- Space Grotesk is modern, geometrisch en heeft meer karakter
- Past goed bij een tuinbedrijf dat "stevig en betrouwbaar" wil overkomen
- Wordt gekopieerd naar een nieuwe `/font-b/` submap

## Variant C — Elegant/Serif (`/font-c/`)

**Lettertypes**: `Playfair Display` (headings/nav/buttons/labels) + `Inter` (body)
- Playfair Display is een elegant serif font — geeft een premium/luxe gevoel
- Goede contrast met het zwart/geel kleurenschema
- Wordt gekopieerd naar een nieuwe `/font-c/` submap

---

## Implementatie Plan

1. **Overschrijf rootmap met Variant A**
   - Wijzig `<link>` in `index.html`, `diensten.html`, `projecten.html`, `contact.html`
   - Wijzig alle CSS selectors in `css/style.css` die `'Work Sans'` gebruiken naar `'Outfit'`
   - Test dat alle pagina's nog correct laden

2. **Maak `/font-b/` en `/font-c/` submappen**
   - Kopieer rootmap bestanden (HTML, CSS, JS, images, logo)
   - Wijzig in elk font-family declaraties naar respectievelijk `Space Grotesk` en `Playfair Display`
   - Update Google Fonts links

3. **FTP Upload**
   - Upload alles naar `tuin-perfect.nl` (root voor A, submappen voor B/C)

---

## Bestanden die gewijzigd worden

- `index.html` — Google Fonts link
- `diensten.html` — Google Fonts link
- `projecten.html` — Google Fonts link
- `contact.html` — Google Fonts link
- `css/style.css` — alle `font-family` regels

## Bestanden die nieuw worden aangemaakt

- `/font-b/index.html`, `/font-b/diensten.html`, `/font-b/projecten.html`, `/font-b/contact.html`, `/font-b/css/style.css`
- `/font-c/index.html`, `/font-c/diensten.html`, `/font-c/projecten.html`, `/font-c/contact.html`, `/font-c/css/style.css`
