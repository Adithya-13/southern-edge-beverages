// Single source of truth for all site data + copy.
// Every rendered string here is copied byte-for-byte from the component that renders it.
// Where a component value diverged from prior constants, the component value wins.

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

// Shape matches the rendered Events.tsx PRESS literal.
export type PressItem = {
  pub: string
  quote: string
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

export const PRODUCTS: Product[] = [
  {
    id: 'sweettea',
    name: 'Sweet Tea Flavored Vodka',
    type: 'Vodka',
    spiritShort: 'Sweet Tea Vodka',
    accentColor: '#C23B22',
    accentVar: '--coral',
    description:
      'Made with succulent corn, authentic black tea, and juicy sugar cane.',
    aroma: 'Robust, warm undertones of earth & raw sugar cane',
    taste: 'Smooth & enriching palate',
    officialNotes:
      'Light golden color with a green tea nose, a very sweet and inviting palate, and a short, delightful finish that makes it perfect for fun cocktails.',
    shortNotes: 'Green tea nose · Sweet inviting palate · Delightful finish',
    notesShort: ['Green tea nose', 'Sweet inviting palate', 'Delightful finish'],
    tastingNotes: ['Green tea nose', 'Sweet, inviting palate', 'Short, delightful finish'],
    award: 'Silver Medal — USA Spirits Ratings 2024 — 83pts',
    pourCocktail: {
      name: 'Spiked Peach Tea',
      ingredients: ['2 oz SE Sweet Tea Vodka', 'Peach purée', 'Splash of sour mix', 'Peach garnish'],
    },
    bottleFile: '/images/bottle_sweettea.png',
  },
  {
    id: 'caramel',
    name: 'Salted Caramel Flavored Whiskey',
    type: 'Whiskey',
    spiritShort: 'Salted Caramel Whiskey',
    accentColor: '#D4781A',
    accentVar: '--amber',
    description:
      'Aged in oak barrels, with a pleasing balance of salty and sweet that does not overpower.',
    aroma: 'Lightly sweet caramel, fragrant, indulgent',
    taste: 'Luscious and sweetened to perfection',
    officialNotes:
      'Macadamia and hazelnut nose with a medium-bodied palate, sweet notes of maple and a buttery, salted donut, finished with caramel and maple.',
    shortNotes: 'Hazelnut nose · Maple & salted donut palate · Caramel finish',
    notesShort: ['Hazelnut nose', 'Maple & salted donut palate', 'Caramel finish'],
    tastingNotes: ['Macadamia & hazelnut nose', 'Maple & salted donut palate', 'Caramel finish'],
    award: 'Silver Medal — USA Spirits Ratings 2024 — 84pts',
    pourCocktail: {
      name: 'Cranberry Caramel Cooler',
      ingredients: ['1½ oz SE Salted Caramel Whiskey', '2 oz cranberry juice', '1 oz simple syrup', 'Club soda', 'Cranberries & rosemary'],
    },
    bottleFile: '/images/bottle_caramel.png',
  },
  {
    id: 'limon',
    name: 'Se Limón Flavored Tequila',
    type: 'Tequila',
    spiritShort: 'Se Limón Tequila',
    accentColor: '#7CB342',
    accentVar: '--lime',
    description:
      'Originating in Jalisco Mexico, 100% Blue Agave with refreshing citrus notes of lemon and lime.',
    aroma: 'Fresh citrus, bright lemon and lime zest',
    taste: 'Distilled 6 times for a smooth finish',
    officialNotes:
      'Originating in Jalisco Mexico, 100% Blue Agave with refreshing citrus notes of lemon and lime. Distilled 6 times.',
    shortNotes: '100% Blue Agave · Lemon & lime citrus · 6× distilled',
    notesShort: ['100% Blue Agave', 'Lemon & lime citrus', '6× distilled'],
    tastingNotes: ['Fresh citrus nose', '100% Blue Agave', '6× distilled, smooth finish'],
    award: null,
    pourCocktail: {
      name: 'Se Limón Paloma',
      ingredients: ['2 oz Se Limón Tequila', 'Grapefruit soda', 'Squeeze of lime', 'Salt rim'],
    },
    bottleFile: '/images/bottle_limon.png',
  },
]

export const RECIPES: Recipe[] = [
  {
    id: 'spiked-peach-tea',
    name: 'Spiked Peach Tea',
    baseSpirit: 'Sweet Tea Vodka',
    baseSpiritId: 'sweettea',
    accentColor: '#C23B22',
    bottleFile: '/images/bottle_sweettea.png',
    ingredients: [
      '2 oz SE Sweet Tea Vodka',
      'Peach purée',
      'Splash of sour mix',
      'Peach garnish',
    ],
    instructions: 'Build in a glass over ice. Garnish with fresh peach.',
  },
  {
    id: 'cranberry-caramel-cooler',
    name: 'Cranberry Caramel Cooler',
    baseSpirit: 'Salted Caramel Whiskey',
    baseSpiritId: 'caramel',
    accentColor: '#D4781A',
    bottleFile: '/images/bottle_caramel.png',
    ingredients: [
      '1½ oz SE Salted Caramel Whiskey',
      '2 oz cranberry juice',
      '1 oz simple syrup',
      'Club soda',
      'Fresh cranberries and rosemary for garnish',
    ],
    instructions:
      'Shake whiskey, juice, syrup with ice. Top with club soda. Garnish with cranberries and rosemary.',
  },
  {
    id: 'pineapple-edge',
    name: 'Pineapple Edge',
    baseSpirit: 'Sweet Tea Vodka',
    baseSpiritId: 'sweettea',
    accentColor: '#C23B22',
    bottleFile: '/images/bottle_sweettea.png',
    ingredients: [
      '2 oz SE Sweet Tea Vodka',
      '2 oz pineapple juice',
      '1 oz lemonade',
      'Simple syrup (adjust to taste)',
      'Pineapple slices and lemon slices for garnish',
    ],
    instructions: 'Pour, shake, enjoy. Garnish with pineapple and lemon slices.',
  },
]

// Structured event data. NOTE: not rendered directly — the live UI renders MARQUEE_TEXT.
export const EVENTS: Event[] = [
  {
    id: 'tega-cay',
    name: 'Whiskey & Vodka Tasting',
    venue: 'Tega Cay Liquors',
  },
  {
    id: 'summer-sips',
    name: 'Summer Sips',
    venue: 'Edisto Beer Garden',
  },
  {
    id: 'village-abc',
    name: 'Vodka & Whiskey Tasting',
    venue: 'Village ABC',
  },
]

// Verbatim from Events.tsx MARQUEE_TEXT (note double-space separators + trailing '  ·  ').
export const MARQUEE_TEXT =
  'Whiskey & Vodka Tasting — Tega Cay Liquors  ·  Summer Sips — Edisto Beer Garden  ·  Vodka & Whiskey Tasting — Village ABC  ·  '

// Verbatim from Events.tsx PRESS.
export const PRESS: PressItem[] = [
  {
    pub: 'Cuisine Noir',
    quote: '"Sweet Sips with Notes of Nostalgia"',
    url: 'https://www.cuisinenoirmag.com/southern-edge-creates-sweet-sips-with-notes-of-nostaglia/',
  },
  {
    pub: 'Rolling Out',
    quote: '"Creating Recipes That Come From Their Roots"',
    url: 'https://rollingout.com/2022/07/29/southern-edge-beverage-founders-creating-recipes-that-come-from-their-roots/',
  },
]

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

// Verbatim from Manifesto.tsx FACTS.
export const BRAND_FACTS = [
  '6× Distilled',
  '60 Proof',
  'Natural Ingredients',
  'Gluten Free',
]

// URLs/handles verbatim from Footer.tsx + Community.tsx render sites.
// `facebook` display name is carried from prior constants (not rendered in scope).
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

// Navigation links — verbatim from Navbar.tsx NAV_LINKS (Footer EXPLORE_LINKS is byte-identical, reuse this).
export const NAV_LINKS = [
  { label: 'Our Story', href: '#manifesto' },
  { label: 'The Pour', href: '#thepour' },
  { label: 'Community', href: '#community' },
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
  // Hero.tsx render site.
  heroHeadline: 'WORK HARD',
  heroScript: 'Drink Smooth.',
  // Manifesto.tsx QUOTE (rendered single-line form).
  manifesto: MANIFESTO_QUOTE,
  // Manifesto.tsx sub paragraph (verbatim).
  manifestoSub:
    'We invite you to experience the essence of the South in every drop of Southern Edge.',
  brandIntro:
    'Crafted with southern charm and a dedication to extraordinary taste, experience the finest flavored spirits from South Carolina.',
  communityHeadline: 'Taste The Edge.',
  // Community.tsx sub paragraph (verbatim).
  communitySub:
    'Join us at tastings, events, and everywhere Southern Edge pours.',
  legalFooter:
    '© 2026 Southern Edge Beverage Company. All rights reserved.\nPlease drink responsibly. Must be 21+ to consume alcohol.',
  // AgeGate.tsx render sites — button labels are title-case in markup (CSS uppercases visually).
  ageGateQuestion: 'Are you of legal drinking age?',
  ageGateYes: 'Yes, I Am 21+',
  ageGateNo: 'No, I Am Not',
}
