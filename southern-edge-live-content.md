# Southern Edge — Live Site Recon & Content Extract

Source: `https://ehaus.panouri-riflate.ro/` (the brand's existing/live site).
Captured: 2026-06-02. This is the **official brand content** — use it to make the Next.js rebuild factually accurate.

> NOTE: The live site is hosted on an unusual domain (`panouri-riflate.ro`, a Romanian panel
> company). Assumed to be a staging/temporary deploy of the real Southern Edge site. Treating
> all copy/assets here as the client's own brand material for migration. Confirm if that's wrong.

---

## Tech stack of the live site
- **Vite + React SPA** (`vite.svg`, `assets/index-*.js`, `assets/index-*.css`), React-Router multi-route.
- Routes: `/`, `/our-story`, `/cocktails`, `/connect`, `/events`, `/press`, `/products`.
- Static PNG assets served from domain root. No hero video — hero is a static wood-texture PNG + a PNG wordmark.
- **The Next.js rebuild is already more advanced** (GSAP frame reveal, canvas, ScrollSmoother, preloader). So "copy the features" = mostly already done/exceeded. The real value here is **correct content + real assets**.

---

## ⚠️ Key discrepancies vs current Next.js project
1. **Third product is "Passionberry Tequila", NOT "Se Limón Tequila".** Label reads
   "SE PASSIONBERRY FLAVORED TEQUILA". Project `constants.ts` uses Se Limón — that's wrong/invented.
2. **No "Se Limón Paloma" cocktail exists** on the real site. (Memory flagged it as invented — confirmed.)
   Real Passionberry cocktails aren't published yet (live site shows placeholders "Recipe 1/2/3").
3. **Legal name:** "The Southern Edge Beverage Company, LLC" (© 2025).
4. **Founders:** Ashley and Bertrina (Trina) Scott — a **Black-owned** liquor brand. Team also: Pat Gantt, Latia Ashley.
5. **Distribution:** in stores in **South Carolina, Georgia, and Florida**.
6. **Socials:** Facebook, Instagram, YouTube (live site footer).

---

## HOME (`/`)

**Hero**
- Wordmark image: "TASTE THE *Edge*" (PNG `TASTE_THE_EDGE.png`).
- Subhead: "Premium craft beverages that push the boundaries of flavor and quality. Experience the perfect blend of innovation and tradition."
- CTAs: "Explore Products" • "Our Story"

**Our Premium Collection**
- Intro: "Discover our carefully crafted selection of premium beverages, each with its own unique character and story."

- **Sweet Tea Vodka** — "Made with succulent corn, authentic black tea, and juicy sugar cane, our vodka is crafted with the finest natural ingredients to provide a satisfying experience with every sip. The taste is smooth and refreshing without the harsh, slow burn that is typically associated with drinking vodka."

- **Passionberry Tequila** — "From your first sip to your last, you'll enjoy every nuance of this ultra-premium flavored Tequila. We are committed to bringing you only the best of the best of our time tested recipes so that you can sit back, kick your feet up, and enjoy."

- **Salted Caramel Whiskey** — "Aged in oak barrels, our whiskey is the perfectly pleasing balance of salty and sweet that does not overpower the palate. This delectable combination satisfies the thirst for rich flavor that your taste buds crave even when it is enjoyed on its own."

- CTA: "View Cocktails"

**Find Us Near You**
- "We are now in stores in South Carolina, Georgia, and Florida!"
- "Find a store near you." → embedded **Google My Maps** ("Where to purchase Southern Edge / Southern Edge Beverage Co.") with bottle pins.

---

## OUR STORY (`/our-story`)

- Hero: "Our Story" — "A journey of passion, craftsmanship, and dedication to creating exceptional beverages."

**Where It All Began**
"Ashley and Trina Scott are the founders of Southern Edge Beverage Company, a Black-owned liquor brand. Southern Edge is a brand that connects with Southern hospitality and is about creating experiences for all. Trina Scott spoke with rolling out about the company."

**Q: Tell us about Southern Edge Beverage**
"We've been working on trying to make some flavorful combinations that a lot of people like. We've spent a significant amount of time trying to get the right thing, listening to feedback from tons of people, sometimes good, sometimes bad, and going back to the lab numerous times. We have come up with the two drinks that are currently on the market, we have a sweet tea flavored vodka, as well as a salted caramel whiskey. I love both of these drinks, and the people who work with us love them too. Otherwise, they wouldn't be working for us. If you want a cool drink, either one of those will work well for you at any time."

**Q: How did the Sweet Tea Vodka come about?**
"No matter where we are, we're always going to represent the southeast. We lived in the Midwest for around 17 years, and all three of our children were born there. They are Midwesterners that have been transplanted back to the South, but we're Southerners at heart. You know you're not considered a Southerner until you sit down and drink some really good sweet tea. We wanted to have some adult drinks, so we put some vodka in it to add a little life to the party. There are a lot of recipes that come from the roots that we have in the South. How can we have Southern roots and we don't have a sweet tea? That's a necessity."

**Q: What are three cocktail recipes that people can make with your liquor?**
"My personal favorite right now is called 'It Takes Tea to Mango,' and it's our sweet tea-flavored vodka with mango nectar. The other one is a version of a John Daly which is vodka, iced tea, and lemonade, but we call it 'Quiet on the Green,' where we use sweet tea, vodka, and lemonade, preferably Simply Lemonade. My favorite Salted Caramel whiskey recipe is not a drink but a dessert. I make a salted caramel shake with Haagen Dazs Vanilla Bean ice cream and salted caramel whiskey. I didn't add too much sugar because the salted caramel whiskey has a nice sweetness to it. The salt enhances the sweet flavor of the caramel, so you don't need to add any sugar to it. You put that in a blender, and you've got a boozy milkshake. I haven't come up with a name for that yet."

**Our Values**
- **Quality** — "We never compromise on quality. Every ingredient is carefully selected and every process meticulously monitored."
- **Tradition** — "Our recipes honor Southern traditions while embracing modern techniques that enhance flavor and quality."
- **Community** — "We believe in bringing people together through exceptional beverages and shared experiences."

---

## COCKTAILS (`/cocktails`)

- Hero: "Signature Cocktails" — "Discover expertly crafted cocktail recipes featuring our premium spirits. Each recipe is designed to showcase the unique flavors of our collection."
- Each cocktail is an **accordion** that expands to Ingredients + Instructions.

### Sweet Tea Vodka

**It Takes Tea to Mango**
- Ingredients: Southern Edge Sweet Tea Flavored Vodka · Triple Sec · Mango Nectar · Mango chunks + cherry to garnish (optional)
- Instructions: Add all ingredients into a glass filled with ice. Gently stir and garnish with mango chunks and a cherry. Serve & Enjoy.

**SE Moji-Tea**
- Ingredients: 2 oz Southern Edge Sweet Tea Flavored Vodka · 4 fresh mint leaves, muddled · 1/2 oz fresh lime juice · 4 oz club soda · Lime wheel for garnish (optional)
- Instructions: In a tall glass, add first 4 ingredients and stir to combine. Top with lime wheel for garnish. Serve & Enjoy.

**Quiet on the Green**
- Ingredients: 1 part Southern Edge Sweet Tea Flavored Vodka · 1 part lemonade · Lemon wheel for garnish
- Instructions: Mix all ingredients and pour over ice. Garnish with a lemon wheel. Serve & Enjoy.

### Passionberry Tequila
- Recipe 1 · Recipe 2 · Recipe 3 — **placeholders, no content yet on live site (not finalized)**.

### Salted Caramel Whiskey

**SE Salty Caramel Sour**
- Ingredients: 2 oz Southern Edge Salted Caramel Flavored Whiskey · 2 oz sour mix · Splash of cola · Fresh lemon twist · Caramel sauce for rim (optional)
- Instructions: Mix all ingredients well in a shaker with ice. Pour over fresh ice in a chilled glass. Garnish with fresh lemon twist and caramel for glass rim. Serve & Enjoy.

**Salted Caramel Latte**
- Ingredients: 1.5 oz Southern Edge Salted Caramel Flavored Whiskey · 5 oz hot milk · 3 oz espresso
- Instructions: Pour 5 oz of hot milk into latte glass. Add 3 oz of espresso and top off 1.5 oz of Salted Caramel Whiskey. Serve & Enjoy.

**Coffee with an Edge**
- Ingredients: 1–1.5 oz Southern Edge Salted Caramel Flavored Whiskey · 8 oz coffee (hot or iced) · Creamer (optional) · Whipped topping (optional) · Caramel Sauce (optional)
- Instructions: Pour coffee into cup. Add Southern Edge Salted Caramel Whiskey. Add creamer and garnish with whipped cream and drizzle caramel sauce on top, if desired. Serve & Enjoy.

---

## PRESS (`/press`)

- Hero: "Press Center" — "Latest news, press releases, and media resources for SE Beverages."
- **Featured Articles:**
  1. **Cuisine Noir** — "Southern Edge Creates Sweet Sips With Notes of Nostalgia"
  2. **VoyageJacksonville** — "Community Highlights: Meet Ashley and Bertrina Scott, Pat Gantt, and Latia Ashley of Southern Edge Beverages"
  3. **rollingout** — "Southern Edge Beverage founders creating recipes that come from their roots"

---

## EVENTS (`/events`)
- Page exists but is **empty** (no events listed yet).

---

## CONNECT (`/connect`)
- Hero: "Let's Connect" — "Get in touch with our team. We'd love to hear from you and answer any questions about our premium beverages."
- Body: "Thank you for your interest in The Southern Edge Beverage Company. Please use the provided form or contact information to get in touch and sign up for our monthly newsletters."
- "Want to purchase Southern Edge online? Visit the LOCATIONS page to find a retailer in your state."
- Form: **Send Us A Message** — First Name, Last Name, Email, Subject, Message → Send Message.

---

## FOOTER (global)
- "The Southern Edge Beverage Company, LLC"
- "Crafting exceptional beverages with passion and precision. Experience the perfect blend of tradition and innovation in every bottle."
- Quick Links: Products, Our Story, Cocktails, Events, Privacy & Cookie Notice
- We are Social: Facebook, Instagram, YouTube
- "© 2025 The Southern Edge Beverage Company, LLC - All rights reserved."

---

## ASSETS DOWNLOADED → `public/images/live-reference/`
| File | Source | What it is | Dims |
|---|---|---|---|
| `logo_se.png` | `se looooogo.png` | High-res SE logo | 2418×3746 |
| `taste_the_edge.png` | `TASTE_THE_EDGE.png` | Hero wordmark "TASTE THE Edge" | 1717×582 |
| `hero_banner.png` | `banner-3.png` | Dark red wood-texture hero bg | 1955×670 |
| `bottle_sweettea.png` | `Sweet_Tea_Vodka.png` | Bottle render (transparent) | 299×792 |
| `bottle_passionberry.png` | `Passionberry_Tequila.png` | Bottle render (transparent) | 306×792 |
| `bottle_caramel.png` | `Salted_Caramel_Whiskey.png` | Bottle render (transparent) | 300×792 |
| `founders_scott.jpg` | `southernedge-...-ashley-scott-...jpg` | Founders photo (Ashley & Bertrina Scott) | 960×720 |
| `ourstory_1/2/3.png` | `1.png`,`2.png`,`3.png` | Our Story / Values support images | 366×366 |
| `press_logo_cuisinenoir/voyage/rollingout.png` | `L1/L2/L3.png` | Press outlet logos | small |
| `press_photo_cuisinenoir/voyage/rollingout.png` | `LP1/LP2/LP3.png` | Press article thumbnails | 219×164 |

---

## FEATURE INVENTORY (live site) vs Next.js project
| Feature (live) | Status in Next.js project |
|---|---|
| Age gate (21+) | ✅ Have (AgeGate) |
| Sticky transparent nav | ✅ Have (Navbar) |
| Hero wordmark over textured bg | ⚠️ Different — project has GSAP frame reveal + video (more advanced) |
| Scroll-reveal product cards | ✅ Have / can match |
| Google My Maps store locator | ❌ Not in project — **net-new section to add** |
| Our Story founder interview (Q&A) | ❌ Project Manifesto is shorter — could expand with real interview |
| Signature Cocktails page (3×3 grid) | ⚠️ Project has ThePour — content needs real cocktail names |
| Press Center (article cards) | ✅ Have PRESS data — replace with real 3 outlets |
| Connect contact form | ❌ Not in project — **net-new (note: no backend; mailto or form service)** |
| Events page | Empty on live — project has Events section |
