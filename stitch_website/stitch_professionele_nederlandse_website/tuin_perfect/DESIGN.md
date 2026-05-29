---
name: Tuin Perfect
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c6ab'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#999077'
  outline-variant: '#4d4732'
  surface-tint: '#e9c400'
  primary: '#fff6df'
  on-primary: '#3a3000'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#705d00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#f6f6f6'
  on-tertiary: '#303030'
  tertiary-container: '#dadada'
  on-tertiary-container: '#5f5f5f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-xl:
    fontFamily: Work Sans
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Work Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Work Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand identity for this design system is rooted in **High-Contrast Boldness** and **Modern Professionalism**. It targets homeowners and businesses seeking premium, "perfect" landscaping results. The UI must evoke a sense of reliability, precision, and physical labor transformed into art. 

We draw inspiration from the grit of manual labor and the sharpness of professional tools. The visual language uses "Industrial Textures"—specifically the halftone patterns and brush-stroke masks seen in the flyers—to break the digital sterility. The aesthetic is "Work-Ready": it's not delicate; it's robust, efficient, and punchy.

Key Brand Pillars:
- **Precision:** Through sharp typography and geometric grid alignment.
- **Energy:** Via high-contrast yellow accents and dynamic diagonal lines.
- **Trust:** Grounded in a heavy, dark foundation that feels permanent and solid.

## Colors

The palette is intentionally aggressive and high-contrast, designed to command attention. 

- **Primary:** A vibrant "Construction Yellow" (#FFD700). This is used for calls-to-action, key iconography, and highlights. It represents energy, warning signs (safety), and the "Perfect" brand promise.
- **Surface/Neutral:** The background is a deep, rich black (#000000) or a very dark "Asphalt Grey" (#1A1A1A). This allows the photography of lush green gardens to pop significantly.
- **Accents:** High-contrast white is used for body text on dark backgrounds to ensure maximum readability and a clean "modern" feel.
- **Tone:** Use the yellow primarily as a "spot color" to guide the user's eye toward conversion points (Quotes, Phone Numbers).

## Typography

The typography system is split between **Work Sans** for structural elements and **Inter** for utilitarian reading.

- **Work Sans (Headlines):** Used in heavy weights (Bold/ExtraBold). Headlines should be set in uppercase for a "Construction/Warning" aesthetic. It conveys stability and authority.
- **Inter (Body):** Used for descriptions and service details. It provides a neutral, highly legible counterpoint to the aggressive headers.
- **Decorative:** While not a token, "Tuin Perfect" uses a brush-style script logo. In the UI, use italicized Work Sans or subtle 5-degree tilts on yellow labels to mimic the dynamic energy of the brand logo.
- **Letter Spacing:** Headlines should use tighter tracking to feel more "compact" and solid.

## Layout & Spacing

This design system utilizes a **Fixed Grid** approach with a 12-column structure for desktop. 

- **Structural Rhythm:** We use an 8px base unit. Margins are generous (48px+) to prevent the high-contrast colors from feeling cluttered.
- **Section Breaks:** Sections should be clearly delineated by alternating backgrounds (Solid Black vs. Very Dark Grey) or by using yellow "divider" lines that mimic the rake icon's tines.
- **Halftone Texture:** Use subtle 45-degree halftone dot patterns in the background of wide sections to add depth and an industrial, printed-flyer feel without distracting from the content.

## Elevation & Depth

To maintain a "Bold/Flat" professional aesthetic, depth is achieved through **Tonal Layering** and **Bold Borders** rather than traditional shadows.

- **Layering:** Primary content sits on #1A1A1A cards against a #000000 background.
- **Borders:** Instead of shadows, use 1px solid borders in Yellow or Dark Grey to define cards and input fields.
- **The "Sticker" Effect:** For special badges (like "100% Tevredenheid"), use a thick white or yellow stroke around the element to make it look like a physical magnet or sticker, as seen on the service van.
- **Glassmorphism:** Use very sparingly for navigation bars only (Black at 80% opacity with a 12px blur) to maintain visibility over high-impact hero photography.

## Shapes

The shape language is **Sharp and Geometric**. 

- **Zero Radius:** Rectangular buttons and containers reinforce the "precise" and "hard-working" nature of landscaping. 
- **The Rake Taper:** Use 45-degree diagonal cuts on the corners of buttons or section dividers to mirror the brand's logo and the rake/shovel visual language.
- **Iconography:** Icons must be enclosed in circles (yellow background with black icons) to match the service icons on the flyer. This provides a consistent, "stamped" look throughout the UI.

## Components

- **Buttons:** Large, sharp-edged rectangles. Primary buttons are #FFD700 with black text. Hover state shifts to white with black text. Use "Work Sans Bold" for button labels.
- **Service Cards:** Use a dark grey background (#1A1A1A). The top of the card should feature the circular icon. On hover, the 1px border should turn Yellow.
- **Before/After Slider:** A critical component for this brand. Use a thick yellow vertical handle to allow users to compare landscaping results.
- **Trust Badges:** Use the "Sticker" style mentioned in Elevation. Circular or shield shapes with a bold outline.
- **Input Fields:** Black background with a white bottom border. On focus, the border turns yellow and the label floats.
- **Checkboxes:** Custom yellow squares with black checkmarks, mimicking the "Netjes & Snel" list on the flyers.