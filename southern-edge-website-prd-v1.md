# Southern Edge Fine Spirits — Website PRD v1.1

**Project:** Brand Website — Showcase Only  
**Client:** Southern Edge Beverage Company  
**Prepared by:** Adithya Firmansyah Putra  
**Date:** June 1, 2026  
**Deadline:** June 8, 2026 (7 days)  
**Version:** 1.1 *(updated: products confirmed, real copy added, assets updated)*

---

## 1. Project Overview

Southern Edge Fine Spirits is a South Carolina-based flavored spirits brand. The website is a **brand showcase** — no eCommerce, no login, no backend. Its sole purpose is to make someone who lands on it feel the brand: Southern charm, premium craft, community, and smooth energy.

The benchmark experience is **us.monkey47.com** and **whistlepigwhiskey.com** — immersive, scroll-driven, cinematic. Achieved here through GSAP animations + AI-generated assets, not Three.js (out of scope for this timeline).

> **One-sentence design brief:** A dark, warm, immersive Southern speakeasy that moves when you scroll.

**Brand facts (from product flyer):**
- 6× distilled
- 60 proof
- Natural ingredients
- Gluten free
- South Carolina origin
- Website: southernedgespirits.com
- Social: @southernedgebeverages

---

## 2. Brand Identity System

### 2.1 Color Palette

| Token | Hex | Usage |
|:---|:---|:---|
| `--bg-void` | `#080604` | Page background, darkest |
| `--bg-deep` | `#100D09` | Section backgrounds |
| `--bg-surface` | `#1A1510` | Cards, overlays |
| `--amber` | `#D4781A` | Primary accent, CTA, Salted Caramel product |
| `--coral` | `#C23B22` | Sweet Tea Vodka product accent |
| `--lime` | `#7CB342` | Se Limón Tequila product accent |
| `--gold` | `#F0C040` | Highlight, hero tagline |
| `--cream` | `#F0E4CC` | Body text, warm white |
| `--silver` | `#C8C8C8` | Logo, secondary text |
| `--smoke` | `rgba(240,228,204,0.06)` | Dividers, subtle overlays |

### 2.2 Typography

| Role | Font | Weight | Usage |
|:---|:---|:---|:---|
| Display Bold | **Bebas Neue** | 400 | "WORK HARD", "TASTE THE EDGE" — all caps hero |
| Display Serif | **Cormorant Garamond** | 300–600 | Section titles, elegant intros |
| Script Accent | **Great Vibes** | 400 | "Drink Smooth.", "Whiskey Wednesday" style |
| Body | **DM Sans** | 300–500 | Paragraphs, labels, nav |

> Import via Google Fonts CDN. All fonts are free, no licensing issues.

### 2.3 Logo Treatment

| Variant | File | Used In |
|:---|:---|:---|
| Mark only (Se citrus) | `logo_se.png` | Preloader animation, nav, favicon |
| Full lockup (Se + SOUTHERN EDGE) | `logo_lockup.png` | Footer, about/manifesto section |

---

## 3. Aesthetic Direction

**Direction: Southern Gothic Luxury**

Dark and warm, not cold and minimal. Premium, but not alienating. Think: a dimly lit bourbon bar in Charleston, South Carolina — oak barrels, candlelight, amber glass, the smell of caramel and citrus. Community-first. Culturally rooted.

**Unforgettable element:** The bottle feels alive — it glows from within, drifts on mouse movement, and reveals itself as you scroll. The page doesn't feel like a website; it feels like walking into the brand.

**What it is NOT:**
- Not cold/clinical (no white space, no Helvetica)
- Not generic craft whiskey (no burlap, no hipster fonts)
- Not static (every section has motion)

---

## 4. Confirmed Copywriting

All copy below is sourced directly from client brand materials. Use verbatim.

### 4.1 Brand Taglines
```
Primary:    "Work Hard. Drink Smooth."
Secondary:  "Taste The Edge."
Tertiary:   "#SavorYourExperience"
```

### 4.2 Brand Story (Manifesto Section)
```
"The Legacy of Southern Edge Spirits is like a sip of the South,
embodying its rich history, warm hospitality and vibrant culture.
We invite you to experience the essence of the South
in every drop of Southern Edge."
```

### 4.3 Brand Intro (Hero subtext / About)
```
"Crafted with southern charm and a dedication to extraordinary taste,
experience the finest flavored spirits from South Carolina."
```

### 4.4 Brand Facts Bar
```
6× Distilled  ·  60 Proof  ·  Natural Ingredients  ·  Gluten Free
```

### 4.5 Products — Confirmed 3 SKUs

**Product 1 — Sweet Tea Flavored Vodka**
- Accent color: `--coral` `#C23B22`
- Description: Made with succulent corn, authentic black tea, and juicy sugar cane.
- Aroma: Robust, warm undertones of earth & raw sugar cane
- Taste: Smooth & enriching palate
- Bottle file: `bottle_sweettea.png`

**Product 2 — Salted Caramel Flavored Whiskey**
- Accent color: `--amber` `#D4781A`
- Description: Aged in oak barrels, with a pleasing balance of salty and sweet that does not overpower.
- Aroma: Lightly sweet caramel, fragrant, indulgent
- Taste: Luscious and sweetened to perfection
- Bottle file: `bottle_caramel.png` ✅ high-res ready

**Product 3 — Se Limón Flavored Tequila**
- Accent color: `--lime` `#7CB342`
- Description: Originating in Jalisco Mexico, 100% Blue Agave Tequila with refreshing citrus notes of lemon and lime.
- Aroma: Fresh citrus, bright lemon and lime zest
- Taste: Distilled 6 times for a smooth finish
- Bottle file: `bottle_limon.png` ⚠️ low-res, needs replacement

### 4.6 Cocktail Recipes (from social content)

**Recipe 1 — Spiked Peach Tea** *(Sweet Tea Vodka)*
```
Ingredients:
- 2 oz SE Sweet Tea Vodka
- Peach purée
- Splash of sour mix
- Peach garnish
```

**Recipe 2 — Cranberry Caramel Cooler** *(Salted Caramel Whiskey)*
```
Ingredients:
- 1½ oz SE Salted Caramel Whiskey
- 2 oz cranberry juice
- 1 oz simple syrup
- Club soda
- Fresh cranberries and rosemary for garnish
Shake whiskey, juice, syrup with ice. Top with club soda.
```

**Recipe 3 — Pineapple Edge** *(Sweet Tea Vodka)*
```
Ingredients:
- 2 oz SE Sweet Tea Vodka
- 2 oz pineapple juice
- 1 oz lemonade
- Simple syrup (adjust to taste)
- Pineapple slices and lemon slices for garnish
Pour, shake, enjoy.
```

### 4.7 Footer / Legal Copy
```
© 2026 Southern Edge Beverage Company. All rights reserved.
Please drink responsibly. Must be 21+ to consume alcohol.
southernedgespirits.com
```

---

## 5. Page Architecture

### Section 1 — Preloader

**Purpose:** Set tone before anything loads. Brand imprinting.

**Layout:** Full viewport. Pure `#080604`. SE citrus mark centered.

**Animation sequence:**
```
0.0s  — Black screen
0.3s  — SE mark SVG strokes draw in (stroke-dashoffset animation, 1.5s)
1.8s  — Fill fades in (silver/white)
2.2s  — Amber pulse radiates outward from logo (radial gradient pulse, opacity 0→0.3→0)
2.8s  — "SOUTHERN EDGE FINE SPIRITS" fades in below (letter-spacing expand)
3.5s  — Entire preloader fades out → Age Gate
```

**Notes:**
- Preloader shows only on first load (sessionStorage flag)
- Skip on return visits

---

### Section 2 — Age Gate

**Purpose:** Legal requirement. Make it feel like entering a speakeasy, not a DMV form.

**Layout:** Full viewport. Dark bg. Everything centered. Logo small at top.

**Content:**
```
[SE mark — small, top center]

Are you of legal drinking age?

[YES, I AM 21+]      [NO, I AM NOT]
```

**Animation:**
- Entire gate fades in from preloader exit
- The two buttons have a warm amber hover glow
- On YES: dramatic radial wipe — amber burst from center → hero loads
- On NO: redirect to a simple underage message page

**Notes:**
- Cookie set on YES (30 days). Gate not shown again within that period.
- No date picker. Simple binary choice. Faster, cleaner UX.

---

### Section 3 — Hero

**Purpose:** First impression. The money shot.

**Layout:** Full viewport (`100vh`). Fixed-position bottle. Layered parallax composition.

**Layer stack (back to front):**

| Layer | Content | Parallax Speed | Source |
|:---|:---|:---|:---|
| L1 | Dark atmospheric background video | 0.1 (slowest) | `hero_atmosphere.mp4` ✅ |
| L2 | Smoke/bokeh overlay | 0.2 | CSS `mix-blend-mode: screen` |
| L3 | Bottle PNG | 0.5 | `bottle_caramel.png` ✅ |
| L4 | Amber light bloom behind bottle | 0.5 | CSS radial gradient |
| L5 | Headline text | 0.8 | DOM |
| L6 | Floating particles | 1.0 (foreground) | CSS canvas |

**Content:**
```
[Top left, small caps, DM Sans]
SOUTHERN EDGE FINE SPIRITS

[Center, stacked]
[Bebas Neue, large] WORK HARD
[Great Vibes, script] Drink Smooth.

[Bottom center, small]
↓ Scroll to explore
```

**Entrance animation (on load):**
```
0.0s  — Background video fades in (opacity 0→1, 1.5s)
0.4s  — Bottle scales up 85%→100% + fade in (ease-out, 1.2s)
0.8s  — Amber bloom pulses once behind bottle
1.0s  — "WORK HARD" letters drop in from top (stagger 0.05s per char)
1.4s  — "Drink Smooth." fades in (script font)
1.8s  — Scroll indicator arrow bobs up/down (infinite)
```

**On scroll (GSAP ScrollTrigger):**
```
0→20% scroll:
  - Bottle drifts upward (translateY -60px)
  - Text opacity 1→0
  - Background darkens (overlay opacity increases)

20% scroll:
  - Hero pins and transitions to Brand Story section
```

**Mouse parallax (desktop only):**
- Bottle: ±15px X/Y
- Smoke layer: ±25px (opposite direction)
- Background: ±8px

---

### Section 4 — Brand Manifesto

**Purpose:** Tell the story. Emotional connection.

**Layout:** Full viewport. Dark bg. Large centered text.

**Content:**
```
[Cormorant Garamond, large, centered]
"The Legacy of Southern Edge Spirits
is like a sip of the South,
embodying its rich history,
warm hospitality and vibrant culture."

[DM Sans, small, max-width 560px, centered]
We invite you to experience the essence of the South
in every drop of Southern Edge.

[Brand facts bar]
6× Distilled  ·  60 Proof  ·  Natural Ingredients  ·  Gluten Free

[SE lockup logo — large, watermark-style, background]
```

**Animation (ScrollTrigger):**
```
Headline: word by word reveal (opacity 0→1, translateY 30→0, stagger 0.08s)
Brand facts bar: slides up and fades in after headline completes
Background logo: rotates slowly (360deg, 20s loop), opacity 0.04
```

---

### Section 5 — Products

**Purpose:** Showcase the 3 SKUs. Each product gets its own flavor identity.

**Layout (Desktop):** Horizontal scroll. 3 cards side by side.
**Layout (Mobile):** Vertical stacked cards.

**Section header:**
```
[Small label, silver] THE SPIRITS
[Large, Bebas Neue] TASTE THE EDGE.
```

**Each product card:**
```
[Dark card — bg: #1A1510, border-radius: 12px]
[Flavor accent glow — radial behind bottle, hidden until hover]
[Bottle PNG — centered, 60% card height]
[Spirit type — small caps, silver, DM Sans]
[Product name — Cormorant Garamond, large, cream]
[Aroma line — italic, small, cream/50%]
[Taste line — DM Sans, small, cream/70%]
[Flavor accent strip — bottom border, 3px, product color]
```

**Product order:** Sweet Tea Vodka → Salted Caramel Whiskey → Se Limón Tequila

**Product card hover animation:**
```
Bottle: translateY -12px (0.3s ease)
Glow: opacity 0→0.4 (radial in product accent color behind bottle)
Card border: opacity 0→1 (product accent color)
```

**Section entrance (ScrollTrigger):**
```
Cards animate in from right (translateX 80px→0, stagger 0.15s)
```

---

### Section 6 — Cocktail Recipes

**Purpose:** Give visitors something to do with the product.

**Layout:** 3 recipe cards. 2-column grid (desktop), single column (mobile).

**Each recipe card:**
```
[Cocktail image — top, AI-generated]
[Recipe name — Cormorant Garamond]
[Base spirit pill — product accent color]
[Click to expand — GSAP height animation]
  → Ingredient list
  → Step-by-step instructions
```

**Recipes:**
1. **Spiked Peach Tea** — Sweet Tea Vodka → coral accent
2. **Cranberry Caramel Cooler** — Salted Caramel Whiskey → amber accent
3. **Pineapple Edge** — Sweet Tea Vodka → coral accent

---

### Section 7 — The Community

**Purpose:** Social proof. This brand is a lifestyle, not just a bottle.

**Layout:** Masonry photo grid. Lifestyle + event photos from social media.

**Content:**
```
[Small label] THE COMMUNITY
[Large, Cormorant Garamond] Taste The Edge.
[Sub, DM Sans] Join us at tastings, events, and everywhere Southern Edge pours.
[Social handle] @southernedgebeverages
```

**Grid animation (ScrollTrigger):**
```
Even columns: slide in from left
Odd columns: slide in from right
Stagger: 0.1s per photo
```

---

### Section 8 — Events & Press

**Purpose:** Credibility. Active brand.

**Left — Marquee ticker:**
```
Whiskey & Vodka Tasting — Tega Cay Liquors  ·
Summer Sips — Edisto Beer Garden  ·
Vodka & Whiskey Tasting — Village ABC  ·
[loop continuously]
```

**Right — Press mentions:**
```
"The official celebrity drink for The Super Lawyer Evening of Hip Hop"
"Featured at SC State Homecoming Bash 2025 — Edisto Beer Garden"
"Sponsored by Southern Edge Fine Spirits"
```

---

### Section 9 — Footer

**Content:**
```
[Col 1]
SE lockup logo
southernedgespirits.com

[Col 2 — Nav]
Our Story · Products · Cocktail Recipes · Community

[Col 3 — Social]
Instagram @southernedgebeverages ↗
Facebook Southern Edge Beverage Company ↗
#TasteTheEdge  #SavorYourExperience

[Bottom bar]
© 2026 Southern Edge Beverage Company. All rights reserved.
Please drink responsibly. Must be 21+ to consume alcohol.
```

---

## 6. Animation System Summary

### 6.1 Libraries

| Library | Version | Purpose |
|:---|:---|:---|
| GSAP | 3.x | All scroll animations, entrance animations |
| @gsap/ScrollTrigger | 3.x | Scroll-driven triggers |
| @gsap/ScrollSmoother | 3.x | Smooth scroll (desktop only) |

> GSAP free tier covers all of this. No paid Club GSAP needed.

### 6.2 Animation Principles

1. **Slow is premium.** Nothing under 0.6s.
2. **Stagger creates depth.** Multi-element reveals always stagger (0.05–0.15s).
3. **Parallax creates space.** Different scroll speeds = depth without 3D.
4. **Micro-interactions reward attention.** Hover states everywhere.
5. **Mobile gets simplified.** Mouse parallax off. ScrollSmoother off.

---

## 7. Tech Stack

```
Framework:    Next.js 14 (App Router)
Styling:      Tailwind CSS v3 + CSS custom properties
Animation:    GSAP 3 + ScrollTrigger + ScrollSmoother
Fonts:        Google Fonts (Bebas Neue, Cormorant Garamond, Great Vibes, DM Sans)
Images:       next/image (WebP auto-optimization)
Icons:        Lucide React (minimal)
Deployment:   Vercel (free tier)
```

**Folder structure:**
```
/app
  /page.tsx
  /layout.tsx
  /globals.css
/components
  /Preloader.tsx
  /AgeGate.tsx
  /Hero.tsx
  /Manifesto.tsx
  /Products.tsx
  /Recipes.tsx
  /Community.tsx
  /Events.tsx
  /Footer.tsx
/public
  /images
    bottle_caramel_transparent.png   ✅ ready
    bottle_sweet_tea_transparent.png ⚠️ low-res
    bottle_limon_transparent.png     ⚠️ low-res
    logo_se_transparent.png          ✅ ready
    logo_lockup_transparent.png      ✅ ready
    hero_atmosphere.mp4              ✅ ready
    bottle_reveal.mp4                ⏳ pending
    cocktail_caramel.jpg             ⏳ pending
    cocktail_sweettea.jpg            ⏳ pending
    cocktail_pineapple.jpg           ⏳ pending
/lib
  /gsap.ts
```

---

## 8. Asset Status

| Asset | Status | Priority | Notes |
|:---|:---|:---|:---|
| `bottle_caramel.png` | ✅ Ready | 🔴 | High-res, clean |
| `bottle_sweettea.png` | ⚠️ Low-res | 🔴 | Need remove.bg on cleaner photo |
| `bottle_limon.png` | ⚠️ Low-res | 🔴 | Need remove.bg on cleaner photo |
| `logo_se.png` | ✅ Ready | 🔴 | Clean extraction |
| `logo_lockup.png` | ✅ Ready | 🔴 | Clean extraction |
| `hero_atmosphere.mp4` | ✅ Ready | 🔴 | Client generated via Veo |
| `bottle_reveal.mp4` | ⏳ Pending | 🔴 | Image-to-video, scroll-driven |
| `cocktail_caramel.jpg` | ⏳ Pending | 🟡 | Nano Banana Pro / Ideogram |
| `cocktail_sweettea.jpg` | ⏳ Pending | 🟡 | Nano Banana Pro / Ideogram |
| `cocktail_pineapple.jpg` | ⏳ Pending | 🟡 | Nano Banana Pro / Ideogram |
| Community photos (6–9) | ⏳ Pending | 🟡 | Export from Facebook/Instagram |
| `liquid_pour.mp4` | ⏳ Pending | 🟢 | Nice to have |

---

## 9. Mobile Strategy

| Feature | Desktop | Mobile |
|:---|:---|:---|
| Mouse parallax on hero | ✅ | ❌ |
| ScrollSmoother | ✅ | ❌ |
| GSAP scroll animations | ✅ | ✅ simplified |
| Horizontal product scroll | ✅ | → Vertical cards |
| Hero particle effect | ✅ | ✅ reduced (10 particles) |
| Background video | ✅ | ❌ → static image fallback |
| Preloader + Age gate | ✅ | ✅ |

---

## 10. Out of Scope

- eCommerce / shopping / checkout
- User accounts or login
- CMS or admin panel
- Blog or editorial content
- Email newsletter integration
- Three.js / WebGL 3D bottle
- Product locator / store finder map
- Multilingual support
- Analytics (can be added post-launch)
- Custom domain setup (Vercel placeholder only)
- SEO beyond basic meta tags

---

## 11. Build Timeline

| Day | Date | Deliverable |
|:---|:---|:---|
| Day 1 | Jun 1 | PRD v1.1 done. Assets extracted. Next.js scaffold. |
| Day 2 | Jun 2 | Preloader + Age Gate |
| Day 3 | Jun 3 | Hero section (full animation + video bg) |
| Day 4 | Jun 4 | Brand Manifesto + Products section |
| Day 5 | Jun 5 | Recipes + Community + Events |
| Day 6 | Jun 6 | Footer + mobile responsive QA |
| Day 7 | Jun 7 | Performance pass + Vercel deploy |
| Buffer | Jun 8 | Client review + hotfixes |

---

## 12. Client Responsibilities

| # | Item | Priority | Status |
|:---|:---|:---|:---|
| 1 | Clean product photos for Sweet Tea + Limón (remove.bg) | 🔴 | ⏳ Pending |
| 2 | `bottle_reveal.mp4` — Image to Video generation | 🔴 | ⏳ Pending |
| 3 | Cocktail images × 3 — Nano Banana Pro / Ideogram | 🟡 | ⏳ Pending |
| 4 | 6–9 community lifestyle photos exported from social | 🟡 | ⏳ Pending |
| 5 | Confirm events list for ticker | 🟢 | Dummy used |
| 6 | Domain name (southernedgespirits.com DNS) | 🟢 | Post-launch |
| 7 | Final copy approval before June 8 deploy | 🟡 | ⏳ Pending |

---

*Southern Edge Fine Spirits Website PRD v1.1 — Confidential*  
*Prepared by Adithya Firmansyah Putra for Southern Edge Beverage Company*

---

## AMENDMENT — v1.2 (June 1, 2026)

### A. Awards & Accolades — USA Spirits Ratings 2024

Southern Edge won **2 Silver Medals** at USA Spirits Ratings 2024 (San Francisco). Use these on the website in the Press/Awards section.

| Product | Medal | Score | Competition |
|:---|:---|:---|:---|
| Salted Caramel Flavored Whiskey | 🥈 Silver Medal | 84 Points | USA Spirits Ratings 2024 |
| Sweet Tea Flavored Vodka | 🥈 Silver Medal | 83 Points | USA Spirits Ratings 2024 |

**Official competition tasting notes (use verbatim on website):**

*Salted Caramel Whiskey — 84pts:*
> "Macadamia and hazelnut nose with a medium-bodied palate, sweet notes of maple and a buttery, salted donut, finished with caramel and maple."

*Sweet Tea Vodka — 83pts:*
> "Light golden color with a green tea nose, a very sweet and inviting palate, and a short, delightful finish that makes it perfect for fun cocktails."

**Award badge copy for website:**
```
🥈 Silver Medal — USA Spirits Ratings 2024
Judged on Quality · Value · Packaging
San Francisco, CA
```

**Source URLs:**
- https://usaspiritsratings.com/en/winner-companies/2024/southern-edge-beverage-company-2660.htm
- https://usaspiritsratings.com/en/competition-certificates/2024/silver-medal/3907/

---

### B. Press Features

| Publication | Article | URL |
|:---|:---|:---|
| **Cuisine Noir Magazine** | "Southern Edge Creates Sweet Sips with Notes of Nostalgia" | https://www.cuisinenoirmag.com/southern-edge-creates-sweet-sips-with-notes-of-nostaglia/ |
| **Rolling Out** | "Southern Edge Beverage Founders Creating Recipes That Come From Their Roots" | https://rollingout.com/2022/07/29/southern-edge-beverage-founders-creating-recipes-that-come-from-their-roots/ |

---

### C. Social & Links

| Platform | Handle / URL |
|:---|:---|
| Linktree | https://linktr.ee/southernedgebeverages |
| Instagram | @southernedgebeverages |
| Facebook | Southern Edge Beverage Company |
| Website | southernedgespirits.com |

---

### D. Logo Update

Replace all previous logo references with:

| File | Size | Used In |
|:---|:---|:---|
| `logo_lockup_hd.png` | 2418×3746px | Footer, manifesto, any large use |
| `logo_se.png` | 717×732px | Nav, preloader, favicon |

---

### E. Updated Product Tasting Notes

Replace dummy tasting notes with official competition notes:

**Sweet Tea Vodka:**
- Official: "Light golden color with a green tea nose, a very sweet and inviting palate, and a short, delightful finish that makes it perfect for fun cocktails."
- Short card version: "Green tea nose · Sweet inviting palate · Delightful finish"

**Salted Caramel Whiskey:**
- Official: "Macadamia and hazelnut nose with a medium-bodied palate, sweet notes of maple and a buttery, salted donut, finished with caramel and maple."
- Short card version: "Hazelnut nose · Maple & salted donut palate · Caramel finish"

**Se Limón Tequila:**
- From flyer: "Originating in Jalisco Mexico, 100% Blue Agave with refreshing citrus notes of lemon and lime. Distilled 6 times."
- Short card version: "100% Blue Agave · Lemon & lime citrus · 6× distilled"

---

### F. Updated Press / Events Section

**Awards to display:**
```
[Award Badge 1]
🥈 Silver Medal
USA Spirits Ratings 2024 — 84pts
Salted Caramel Whiskey

[Award Badge 2]
🥈 Silver Medal
USA Spirits Ratings 2024 — 83pts
Sweet Tea Vodka
```

**Press to display:**
```
[Press Card 1]
Cuisine Noir Magazine
"Sweet Sips with Notes of Nostalgia"

[Press Card 2]
Rolling Out
"Creating Recipes That Come From Their Roots"
```

---

*Amendment v1.2 — Awards, press, HD logo, official tasting notes added*

---

## AMENDMENT — v1.3 (June 1, 2026)

### Final Asset Registry — `/public/` folder

All assets confirmed, named, and placed. Use these exact filenames in code.

#### `/public/images/`

| File | Size | Source | Used In | Quality |
|:---|:---|:---|:---|:---|
| `bottle_hero.png` | 1.4MB | Client (ChatGPT bg remover) | Hero scroll layer, blend mode | ✅ 1024×1024, RGBA |
| `bottle_caramel.png` | 314KB | Processed (remove.bg) | Products section | ✅ 411×1078, RGBA |
| `bottle_sweettea.png` | 34KB | Extracted from flyer | Products section | ⚠️ Low-res, replace when available |
| `bottle_limon.png` | 28KB | Extracted from flyer | Products section | ⚠️ Low-res, replace when available |
| `logo_lockup.png` | 354KB | Client (OneDrive) | Footer, manifesto | ✅ 2418×3746, RGBA |
| `logo_lockup_hd.png` | 736KB | Client (OneDrive, processed) | Footer large use | ✅ 2418×3746, RGBA |
| `logo_se.png` | 151KB | Extracted from client asset | Nav, preloader, favicon | ✅ 717×732, RGBA |
| `logo_se_circle.png` | 48KB | Client asset | Badge, circular use | ✅ 480×480, RGBA |

#### `/public/images/frames/`

| Content | Count | Size | Used In |
|:---|:---|:---|:---|
| `frame_001.webp` → `frame_120.webp` | 120 files | 1.4MB total | Hero scroll-driven bottle reveal |

> Extracted from `bottle_reveal.mp4` at 15fps using FFmpeg. Scroll progress maps to frame index.

#### `/public/videos/`

| File | Size | Source | Used In | Behavior |
|:---|:---|:---|:---|:---|
| `hero_atmosphere.mp4` | 2.1MB | Client (Google Veo) | Hero background | Autoplay, muted, loop |
| `bottle_reveal.mp4` | 917KB | Client (Google Flow) | Frames source | Not used directly in HTML |

---

### Hero Layer Architecture (Final)

```
Layer    File                          Behavior
──────────────────────────────────────────────────────
L1       hero_atmosphere.mp4           autoplay loop, fixed bg
L2       CSS smoke gradient            mix-blend-mode: screen
L3       frames/frame_[N].webp         scroll-driven, mix-blend-mode: screen
L4       bottle_caramel.png            static, centered, always visible
L5       CSS amber radial glow         follows bottle, pulses on load
L6       Headline text DOM             fades out on scroll
```

> `bottle_hero.png` — the AI-generated bottle with transparent bg — is used as
> the scroll frame layer (L3) source reference. Real label is covered by
> `bottle_caramel.png` (L4) on top.

---

### Total Asset Budget

| Category | Size |
|:---|:---|
| Images | 2.8MB |
| Frames (120 WebP) | 1.4MB |
| Videos | 3.0MB |
| **Total** | **7.2MB** |

> Performance note: frames and videos are lazy-loaded. Initial page load only
> hits images above the fold (~500KB). Frames preload progressively after hero
> is visible.

---

*Amendment v1.3 — Final asset registry, filenames, sizes, layer architecture confirmed.*
