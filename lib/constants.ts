// Single source of truth for all site data + copy.
// Content aligned to the brand's live site (see southern-edge-live-content.md).
// Product lineup: Sweet Tea Vodka · Passionberry Tequila · Salted Caramel Whiskey.

export type Product = {
  id: string
  name: string
  type: string
  spiritShort: string
  accentColor: string
  accentVar: string
  description: string
  aroma: string
  taste: string
  officialNotes: string
  shortNotes: string
  notesShort: string[]
  tastingNotes: string[]
  award: string | null
  pourCocktail: { name: string; ingredients: string[] }
  bottleFile: string
}

export type Recipe = {
  id: string
  name: string
  baseSpirit: string
  baseSpiritId: string
  accentColor: string
  bottleFile: string
  ingredients: string[]
  instructions: string
}

export type Event = {
  id: string
  name: string
  venue: string
}

export type PressArticle = {
  pub: string
  title: string
  logo: string
  photo: string
  url: string
}

// Shape matches the rendered Events.tsx AWARDS literal.
export type Award = {
  medal: string
  competition: string
  points: string
  location: string
  url: string
}

// Real product copy verbatim from the live site (southernedge "Our Premium Collection").
export const PRODUCTS: Product[] = [
  {
    id: 'sweettea',
    name: 'Sweet Tea Flavored Vodka',
    type: 'Vodka',
    spiritShort: 'Sweet Tea Vodka',
    accentColor: '#C23B22',
    accentVar: '--coral',
    description:
      'Made with succulent corn, authentic black tea, and juicy sugar cane, our vodka is crafted with the finest natural ingredients to provide a satisfying experience with every sip. The taste is smooth and refreshing without the harsh, slow burn that is typically associated with drinking vodka.',
    aroma: 'Robust, warm undertones of earth & raw sugar cane',
    taste: 'Smooth & enriching palate',
    officialNotes:
      'Light golden color with a green tea nose, a very sweet and inviting palate, and a short, delightful finish that makes it perfect for fun cocktails.',
    shortNotes: 'Green tea nose · Sweet inviting palate · Delightful finish',
    notesShort: ['Green tea nose', 'Sweet inviting palate', 'Delightful finish'],
    tastingNotes: ['Green tea nose', 'Sweet, inviting palate', 'Short, delightful finish'],
    award: 'Silver Medal — USA Spirits Ratings 2024 — 83pts',
    // Real signature cocktail (live Cocktails page).
    pourCocktail: {
      name: 'It Takes Tea to Mango',
      ingredients: ['SE Sweet Tea Flavored Vodka', 'Triple Sec', 'Mango Nectar', 'Mango chunks + cherry to garnish'],
    },
    bottleFile: '/images/bottle_sweettea.png',
  },
  {
    id: 'passionberry',
    name: 'Passionberry Flavored Tequila',
    type: 'Tequila',
    spiritShort: 'Passionberry Tequila',
    accentColor: '#B23A6F',
    accentVar: '--berry',
    description:
      "From your first sip to your last, you'll enjoy every nuance of this ultra-premium flavored Tequila. We are committed to bringing you only the best of the best of our time tested recipes so that you can sit back, kick your feet up, and enjoy.",
    aroma: 'Bright, vibrant passion-fruit and berry',
    taste: 'Ultra-premium, smooth and nuanced',
    officialNotes:
      'An ultra-premium flavored tequila built on time-tested recipes — smooth and full of nuance from the first sip to the last.',
    shortNotes: 'Ultra-premium · Smooth & nuanced · Time-tested recipe',
    notesShort: ['Ultra-premium', 'Smooth & nuanced', 'Time-tested recipe'],
    tastingNotes: ['Ultra-premium flavored tequila', 'Smooth, nuanced palate', 'Time-tested recipe'],
    award: null,
    // Signature serve not finalized on the live site — tease only.
    pourCocktail: {
      name: 'Signature Serve — Coming Soon',
      ingredients: ['Our Passionberry cocktails are in the lab', 'Best enjoyed neat or over ice for now'],
    },
    bottleFile: '/images/bottle_passionberry.png',
  },
  {
    id: 'caramel',
    name: 'Salted Caramel Flavored Whiskey',
    type: 'Whiskey',
    spiritShort: 'Salted Caramel Whiskey',
    accentColor: '#D4781A',
    accentVar: '--amber',
    description:
      'Aged in oak barrels, our whiskey is the perfectly pleasing balance of salty and sweet that does not overpower the palate. This delectable combination satisfies the thirst for rich flavor that your taste buds crave even when it is enjoyed on its own.',
    aroma: 'Lightly sweet caramel, fragrant, indulgent',
    taste: 'Luscious and sweetened to perfection',
    officialNotes:
      'Macadamia and hazelnut nose with a medium-bodied palate, sweet notes of maple and a buttery, salted donut, finished with caramel and maple.',
    shortNotes: 'Hazelnut nose · Maple & salted donut palate · Caramel finish',
    notesShort: ['Hazelnut nose', 'Maple & salted donut palate', 'Caramel finish'],
    tastingNotes: ['Macadamia & hazelnut nose', 'Maple & salted donut palate', 'Caramel finish'],
    award: 'Silver Medal — USA Spirits Ratings 2024 — 84pts',
    // Real signature cocktail (live Cocktails page).
    pourCocktail: {
      name: 'SE Salty Caramel Sour',
      ingredients: ['2 oz SE Salted Caramel Flavored Whiskey', '2 oz sour mix', 'Splash of cola', 'Fresh lemon twist'],
    },
    bottleFile: '/images/bottle_caramel.png',
  },
]

// ── COCKTAILS ────────────────────────────────────────────────────────────
// Real recipes verbatim from the live Cocktails page (accordion content).
// Passionberry recipes are placeholders on the live site (not finalized).
export type Cocktail = {
  id: string
  name: string
  ingredients: string[]
  instructions: string
}
export type CocktailGroup = {
  spiritId: string
  spirit: string
  accentColor: string
  bottleFile: string
  comingSoon?: boolean
  cocktails: Cocktail[]
}

export const COCKTAIL_GROUPS: CocktailGroup[] = [
  {
    spiritId: 'sweettea',
    spirit: 'Sweet Tea Vodka',
    accentColor: '#C23B22',
    bottleFile: '/images/bottle_sweettea.png',
    cocktails: [
      {
        id: 'it-takes-tea-to-mango',
        name: 'It Takes Tea to Mango',
        ingredients: ['Southern Edge Sweet Tea Flavored Vodka', 'Triple Sec', 'Mango Nectar', 'Mango chunks + cherry to garnish (optional)'],
        instructions: 'Add all ingredients into a glass filled with ice. Gently stir and garnish with mango chunks and a cherry. Serve & Enjoy.',
      },
      {
        id: 'se-moji-tea',
        name: 'SE Moji-Tea',
        ingredients: ['2 oz Southern Edge Sweet Tea Flavored Vodka', '4 fresh mint leaves, muddled', '1/2 oz fresh lime juice', '4 oz club soda', 'Lime wheel for garnish (optional)'],
        instructions: 'In a tall glass, add first 4 ingredients and stir to combine. Top with lime wheel for garnish. Serve & Enjoy.',
      },
      {
        id: 'quiet-on-the-green',
        name: 'Quiet on the Green',
        ingredients: ['1 part Southern Edge Sweet Tea Flavored Vodka', '1 part lemonade', 'Lemon wheel for garnish'],
        instructions: 'Mix all ingredients and pour over ice. Garnish with a lemon wheel. Serve & Enjoy.',
      },
    ],
  },
  {
    spiritId: 'passionberry',
    spirit: 'Passionberry Tequila',
    accentColor: '#B23A6F',
    bottleFile: '/images/bottle_passionberry.png',
    comingSoon: true,
    cocktails: [],
  },
  {
    spiritId: 'caramel',
    spirit: 'Salted Caramel Whiskey',
    accentColor: '#D4781A',
    bottleFile: '/images/bottle_caramel.png',
    cocktails: [
      {
        id: 'se-salty-caramel-sour',
        name: 'SE Salty Caramel Sour',
        ingredients: ['2 oz Southern Edge Salted Caramel Flavored Whiskey', '2 oz sour mix', 'Splash of cola', 'Fresh lemon twist', 'Caramel sauce for rim (optional)'],
        instructions: 'Mix all ingredients well in a shaker with ice. Pour over fresh ice in a chilled glass. Garnish with fresh lemon twist and caramel for glass rim. Serve & Enjoy.',
      },
      {
        id: 'salted-caramel-latte',
        name: 'Salted Caramel Latte',
        ingredients: ['1.5 oz Southern Edge Salted Caramel Flavored Whiskey', '5 oz hot milk', '3 oz espresso'],
        instructions: 'Pour 5 oz of hot milk into latte glass. Add 3 oz of espresso and top off 1.5 oz of Salted Caramel Whiskey. Serve & Enjoy.',
      },
      {
        id: 'coffee-with-an-edge',
        name: 'Coffee with an Edge',
        ingredients: ['1–1.5 oz Southern Edge Salted Caramel Flavored Whiskey', '8 oz coffee (hot or iced)', 'Creamer (optional)', 'Whipped topping (optional)', 'Caramel Sauce (optional)'],
        instructions: 'Pour coffee into cup. Add Southern Edge Salted Caramel Whiskey. Add creamer and garnish with whipped cream and drizzle caramel sauce on top, if desired. Serve & Enjoy.',
      },
    ],
  },
]

// Legacy RECIPES export (kept for compatibility); mirrors the first real recipe per on-market spirit.
export const RECIPES: Recipe[] = [
  {
    id: 'it-takes-tea-to-mango',
    name: 'It Takes Tea to Mango',
    baseSpirit: 'Sweet Tea Vodka',
    baseSpiritId: 'sweettea',
    accentColor: '#C23B22',
    bottleFile: '/images/bottle_sweettea.png',
    ingredients: ['Southern Edge Sweet Tea Flavored Vodka', 'Triple Sec', 'Mango Nectar', 'Mango chunks + cherry to garnish'],
    instructions: 'Add all ingredients into a glass filled with ice. Gently stir and garnish with mango chunks and a cherry. Serve & Enjoy.',
  },
  {
    id: 'se-salty-caramel-sour',
    name: 'SE Salty Caramel Sour',
    baseSpirit: 'Salted Caramel Whiskey',
    baseSpiritId: 'caramel',
    accentColor: '#D4781A',
    bottleFile: '/images/bottle_caramel.png',
    ingredients: ['2 oz SE Salted Caramel Whiskey', '2 oz sour mix', 'Splash of cola', 'Fresh lemon twist'],
    instructions: 'Mix all ingredients well in a shaker with ice. Pour over fresh ice. Garnish with lemon twist and caramel rim. Serve & Enjoy.',
  },
]

// ── OUR STORY ────────────────────────────────────────────────────────────
// Founder narrative + interview verbatim from live /our-story (rolling out interview).
export const STORY = {
  eyebrow: 'Our Story',
  intro: 'A journey of passion, craftsmanship, and dedication to creating exceptional beverages.',
  headline: 'Where It All Began',
  founders: 'Ashley & Bertrina Scott',
  foundersPhoto: '/images/founders_scott.jpg',
  body:
    'Ashley and Trina Scott are the founders of Southern Edge Beverage Company, a Black-owned liquor brand. Southern Edge is a brand that connects with Southern hospitality and is about creating experiences for all. Trina Scott spoke with rolling out about the company.',
  interview: [
    {
      q: 'Tell us about Southern Edge Beverage',
      a: "We've been working on trying to make some flavorful combinations that a lot of people like. We've spent a significant amount of time trying to get the right thing, listening to feedback from tons of people, sometimes good, sometimes bad, and going back to the lab numerous times. We have come up with the two drinks that are currently on the market, we have a sweet tea flavored vodka, as well as a salted caramel whiskey. I love both of these drinks, and the people who work with us love them too. Otherwise, they wouldn't be working for us. If you want a cool drink, either one of those will work well for you at any time.",
    },
    {
      q: 'How did the Sweet Tea Vodka come about?',
      a: "No matter where we are, we're always going to represent the southeast. We lived in the Midwest for around 17 years, and all three of our children were born there. They are Midwesterners that have been transplanted back to the South, but we're Southerners at heart. You know you're not considered a Southerner until you sit down and drink some really good sweet tea. We wanted to have some adult drinks, so we put some vodka in it to add a little life to the party. There are a lot of recipes that come from the roots that we have in the South. How can we have Southern roots and we don't have a sweet tea? That's a necessity.",
    },
    {
      q: 'What are three cocktail recipes that people can make with your liquor?',
      a: 'My personal favorite right now is called "It Takes Tea to Mango," and it\'s our sweet tea-flavored vodka with mango nectar. The other one is a version of a John Daly which is vodka, iced tea, and lemonade, but we call it "Quiet on the Green," where we use sweet tea, vodka, and lemonade, preferably Simply Lemonade. My favorite Salted Caramel whiskey recipe is not a drink but a dessert. I make a salted caramel shake with Haagen Dazs Vanilla Bean ice cream and salted caramel whiskey. The salt enhances the sweet flavor of the caramel, so you don\'t need to add any sugar to it. You put that in a blender, and you\'ve got a boozy milkshake.',
    },
  ],
}

export const VALUES = [
  { title: 'Quality', body: 'We never compromise on quality. Every ingredient is carefully selected and every process meticulously monitored.' },
  { title: 'Tradition', body: 'Our recipes honor Southern traditions while embracing modern techniques that enhance flavor and quality.' },
  { title: 'Community', body: 'We believe in bringing people together through exceptional beverages and shared experiences.' },
]

// ── FIND US (store locator) ──────────────────────────────────────────────
export const FIND_US = {
  eyebrow: 'Where to Buy',
  headline: 'Find Us Near You',
  sub: 'We are now in stores in South Carolina, Georgia, and Florida!',
  cta: 'Find a store near you.',
  states: ['South Carolina', 'Georgia', 'Florida'],
  mapEmbed: 'https://www.google.com/maps/d/u/0/embed?mid=13W5baTb9iaJ6r1pg4eyQ4WenvFjeorg',
}

// ── PRESS (real featured articles) ───────────────────────────────────────
export const PRESS_ARTICLES: PressArticle[] = [
  {
    pub: 'Cuisine Noir',
    title: 'Southern Edge Creates Sweet Sips With Notes of Nostalgia',
    logo: '/images/press/logo_cuisinenoir.png',
    photo: '/images/press/photo_cuisinenoir.png',
    url: 'https://www.cuisinenoirmag.com/southern-edge-creates-sweet-sips-with-notes-of-nostaglia/',
  },
  {
    pub: 'VoyageJacksonville',
    title: 'Community Highlights: Meet Ashley and Bertrina Scott, Pat Gantt, and Latia Ashley of Southern Edge Beverages',
    logo: '/images/press/logo_voyage.png',
    photo: '/images/press/photo_voyage.png',
    url: 'https://voyagejacksonville.com/interview/community-highlights-meet-ashley-and-betrina-scott-pat-gantt-latia-ashley-of-southern-edge-beverages/',
  },
  {
    pub: 'rollingout',
    title: 'Southern Edge Beverage founders creating recipes that come from their roots',
    logo: '/images/press/logo_rollingout.png',
    photo: '/images/press/photo_rollingout.png',
    url: 'https://rollingout.com/2022/07/29/southern-edge-beverage-founders-creating-recipes-that-come-from-their-roots/',
  },
]

// ── CONNECT ──────────────────────────────────────────────────────────────
export const CONNECT = {
  eyebrow: 'Contact',
  headline: "Let's Connect",
  sub: "Get in touch with our team. We'd love to hear from you and answer any questions about our premium beverages.",
  body:
    'Thank you for your interest in The Southern Edge Beverage Company. Please use the provided form or contact information to get in touch and sign up for our monthly newsletters.',
  locationsNote: 'Want to purchase Southern Edge? Visit the Find Us section to locate a retailer in your state.',
  email: 'contact@southernedgespirits.com',
}

// Structured event data. NOTE: not rendered directly — the live UI renders MARQUEE_TEXT.
export const EVENTS: Event[] = [
  { id: 'tega-cay', name: 'Whiskey & Vodka Tasting', venue: 'Tega Cay Liquors' },
  { id: 'summer-sips', name: 'Summer Sips', venue: 'Edisto Beer Garden' },
  { id: 'village-abc', name: 'Vodka & Whiskey Tasting', venue: 'Village ABC' },
]

// Verbatim from Events.tsx MARQUEE_TEXT (note double-space separators + trailing '  ·  ').
export const MARQUEE_TEXT =
  'Whiskey & Vodka Tasting — Tega Cay Liquors  ·  Summer Sips — Edisto Beer Garden  ·  Vodka & Whiskey Tasting — Village ABC  ·  '

// Verbatim from Events.tsx AWARDS (url is the shared href the badges link to).
export const AWARDS: Award[] = [
  {
    medal: 'Silver Medal',
    competition: 'USA Spirits Ratings 2024',
    points: '84 Points — Salted Caramel Whiskey',
    location: 'San Francisco, CA',
    url: 'https://usaspiritsratings.com/en/winner-companies/2024/southern-edge-beverage-company-2660.htm',
  },
  {
    medal: 'Silver Medal',
    competition: 'USA Spirits Ratings 2024',
    points: '83 Points — Sweet Tea Vodka',
    location: 'San Francisco, CA',
    url: 'https://usaspiritsratings.com/en/winner-companies/2024/southern-edge-beverage-company-2660.htm',
  },
]

// Brand facts — grounded in real brand content (Black-owned, Southern roots, natural ingredients, distribution).
export const BRAND_FACTS = ['Black-Owned', 'Southern Roots', 'Natural Ingredients', 'In SC · GA · FL']

// Socials. Live footer lists Facebook · Instagram · YouTube; existing handles carried over.
export const SOCIAL = {
  instagram: '@southernedgebeverages',
  instagramUrl: 'https://www.instagram.com/southernedgebeverages/',
  facebook: 'Southern Edge Beverage Company',
  facebookUrl: 'https://web.facebook.com/SouthernEdgeBeverages',
  tiktokUrl: 'https://www.tiktok.com/@southernedgebeverages',
  linktree: 'https://linktr.ee/southernedgebeverages',
  email: 'contact@southernedgespirits.com',
  website: 'southernedgespirits.com',
  hashtags: ['#TasteTheEdge', '#SavorYourExperience'],
}

// Navigation links — expanded to mirror the live site's information architecture.
export const NAV_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'Our Story', href: '#story' },
  { label: 'Cocktails', href: '#cocktails' },
  { label: 'Find Us', href: '#findus' },
  { label: 'Press', href: '#press' },
  { label: 'Connect', href: '#connect' },
]

// Verbatim from ScrollRibbon.tsx ITEMS.
export const RIBBON_ITEMS = ['TASTE THE EDGE', 'WORK HARD · DRINK SMOOTH', 'CRAFTED IN SC', 'FINE SPIRITS', '60 PROOF', 'GLUTEN FREE']

// Verbatim from Community.tsx POSTS.
export const POSTS = [
  { file: 'southernedgebeverages/C81tWTXAudB_1.jpg', url: 'https://www.instagram.com/p/C81tWTXAudB/', handle: '@southernedgebeverages' },
  { file: 'southernedgebeverages/C8TVtdfg2ng_1.jpg', url: 'https://www.instagram.com/p/C8TVtdfg2ng/', handle: '@southernedgebeverages' },
  { file: 'liquiddisga/DTAhwowAFU9_1.jpg', url: 'https://www.instagram.com/p/DTAhwowAFU9/', handle: '@liquiddisga' },
  { file: 'southernedgebeverages/C7soFQwglTb_1.jpg', url: 'https://www.instagram.com/p/C7soFQwglTb/', handle: '@southernedgebeverages' },
  { file: 'suepremetravels/DQ7ycQcD-yo_1.jpg', url: 'https://www.instagram.com/p/DQ7ycQcD-yo/', handle: '@suepremetravels' },
  { file: 'vueatlanta/DP4Bz4djc3a_12.jpg', url: 'https://www.instagram.com/p/DP4Bz4djc3a/', handle: '@vueatlanta' },
  { file: 'southernedgebeverages/C0nAU1ePf6a_1.jpg', url: 'https://www.instagram.com/p/C0nAU1ePf6a/', handle: '@southernedgebeverages' },
  { file: 'chubblive/DP2xyAZDcyi_1.jpg', url: 'https://www.instagram.com/p/DP2xyAZDcyi/', handle: '@chubblive' },
  { file: 'southernedgebeverages/Cyy2zlKCEq7_1.jpg', url: 'https://www.instagram.com/p/Cyy2zlKCEq7/', handle: '@southernedgebeverages' },
]

// Verbatim from Manifesto.tsx QUOTE (single-line, rendered form).
export const MANIFESTO_QUOTE = '"The Legacy of Southern Edge Spirits is like a sip of the South, embodying its rich history, warm hospitality and vibrant culture."'

export const COPY = {
  taglinePrimary: 'Work Hard. Drink Smooth.',
  taglineSecondary: 'Taste The Edge.',
  taglineTertiary: '#SavorYourExperience',
  heroHeadline: 'WORK HARD',
  heroScript: 'Drink Smooth.',
  manifesto: MANIFESTO_QUOTE,
  manifestoSub:
    'We invite you to experience the essence of the South in every drop of Southern Edge.',
  brandIntro:
    'Premium craft beverages that push the boundaries of flavor and quality. Experience the perfect blend of innovation and tradition.',
  communityHeadline: 'Taste The Edge.',
  communitySub:
    'Join us at tastings, events, and everywhere Southern Edge pours.',
  legalName: 'The Southern Edge Beverage Company, LLC',
  footerTagline:
    'Crafting exceptional beverages with passion and precision. Experience the perfect blend of tradition and innovation in every bottle.',
  legalFooter:
    '© 2026 The Southern Edge Beverage Company, LLC. All rights reserved.\nPlease drink responsibly. Must be 21+ to consume alcohol.',
  ageGateQuestion: 'Are you of legal drinking age?',
  ageGateYes: 'Yes, I Am 21+',
  ageGateNo: 'No, I Am Not',
}
