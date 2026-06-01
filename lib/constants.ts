export type Product = {
  id: string
  name: string
  type: string
  accentColor: string
  accentVar: string
  description: string
  aroma: string
  taste: string
  officialNotes: string
  shortNotes: string
  bottleFile: string
  lowRes?: boolean
}

export type Recipe = {
  id: string
  name: string
  baseSpirit: string
  baseSpiritId: string
  accentColor: string
  ingredients: string[]
  instructions?: string
}

export type Event = {
  id: string
  name: string
  venue: string
}

export type PressItem = {
  id: string
  publication: string
  headline: string
  url: string
}

export type Award = {
  id: string
  medal: string
  competition: string
  year: number
  points: number
  product: string
  url: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'sweettea',
    name: 'Sweet Tea Flavored Vodka',
    type: 'Vodka',
    accentColor: '#C23B22',
    accentVar: '--coral',
    description:
      'Made with succulent corn, authentic black tea, and juicy sugar cane.',
    aroma: 'Robust, warm undertones of earth & raw sugar cane',
    taste: 'Smooth & enriching palate',
    officialNotes:
      'Light golden color with a green tea nose, a very sweet and inviting palate, and a short, delightful finish that makes it perfect for fun cocktails.',
    shortNotes: 'Green tea nose · Sweet inviting palate · Delightful finish',
    bottleFile: '/images/bottle_sweettea.png',
    lowRes: true,
  },
  {
    id: 'caramel',
    name: 'Salted Caramel Flavored Whiskey',
    type: 'Whiskey',
    accentColor: '#D4781A',
    accentVar: '--amber',
    description:
      'Aged in oak barrels, with a pleasing balance of salty and sweet that does not overpower.',
    aroma: 'Lightly sweet caramel, fragrant, indulgent',
    taste: 'Luscious and sweetened to perfection',
    officialNotes:
      'Macadamia and hazelnut nose with a medium-bodied palate, sweet notes of maple and a buttery, salted donut, finished with caramel and maple.',
    shortNotes: 'Hazelnut nose · Maple & salted donut palate · Caramel finish',
    bottleFile: '/images/bottle_caramel.png',
  },
  {
    id: 'limon',
    name: 'Se Limón Flavored Tequila',
    type: 'Tequila',
    accentColor: '#7CB342',
    accentVar: '--lime',
    description:
      'Originating in Jalisco Mexico, 100% Blue Agave Tequila with refreshing citrus notes of lemon and lime.',
    aroma: 'Fresh citrus, bright lemon and lime zest',
    taste: 'Distilled 6 times for a smooth finish',
    officialNotes:
      'Originating in Jalisco Mexico, 100% Blue Agave with refreshing citrus notes of lemon and lime. Distilled 6 times.',
    shortNotes: '100% Blue Agave · Lemon & lime citrus · 6× distilled',
    bottleFile: '/images/bottle_limon.png',
    lowRes: true,
  },
]

export const RECIPES: Recipe[] = [
  {
    id: 'spiked-peach-tea',
    name: 'Spiked Peach Tea',
    baseSpirit: 'Sweet Tea Vodka',
    baseSpiritId: 'sweettea',
    accentColor: '#C23B22',
    ingredients: [
      '2 oz SE Sweet Tea Vodka',
      'Peach purée',
      'Splash of sour mix',
      'Peach garnish',
    ],
  },
  {
    id: 'cranberry-caramel-cooler',
    name: 'Cranberry Caramel Cooler',
    baseSpirit: 'Salted Caramel Whiskey',
    baseSpiritId: 'caramel',
    accentColor: '#D4781A',
    ingredients: [
      '1½ oz SE Salted Caramel Whiskey',
      '2 oz cranberry juice',
      '1 oz simple syrup',
      'Club soda',
      'Fresh cranberries and rosemary for garnish',
    ],
    instructions:
      'Shake whiskey, juice, syrup with ice. Top with club soda.',
  },
  {
    id: 'pineapple-edge',
    name: 'Pineapple Edge',
    baseSpirit: 'Sweet Tea Vodka',
    baseSpiritId: 'sweettea',
    accentColor: '#C23B22',
    ingredients: [
      '2 oz SE Sweet Tea Vodka',
      '2 oz pineapple juice',
      '1 oz lemonade',
      'Simple syrup (adjust to taste)',
      'Pineapple slices and lemon slices for garnish',
    ],
    instructions: 'Pour, shake, enjoy.',
  },
]

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

export const PRESS: PressItem[] = [
  {
    id: 'cuisine-noir',
    publication: 'Cuisine Noir Magazine',
    headline: 'Sweet Sips with Notes of Nostalgia',
    url: 'https://www.cuisinenoirmag.com/southern-edge-creates-sweet-sips-with-notes-of-nostaglia/',
  },
  {
    id: 'rolling-out',
    publication: 'Rolling Out',
    headline: 'Creating Recipes That Come From Their Roots',
    url: 'https://rollingout.com/2022/07/29/southern-edge-beverage-founders-creating-recipes-that-come-from-their-roots/',
  },
]

export const AWARDS: Award[] = [
  {
    id: 'caramel-silver-2024',
    medal: 'Silver Medal',
    competition: 'USA Spirits Ratings',
    year: 2024,
    points: 84,
    product: 'Salted Caramel Flavored Whiskey',
    url: 'https://usaspiritsratings.com/en/winner-companies/2024/southern-edge-beverage-company-2660.htm',
  },
  {
    id: 'sweettea-silver-2024',
    medal: 'Silver Medal',
    competition: 'USA Spirits Ratings',
    year: 2024,
    points: 83,
    product: 'Sweet Tea Flavored Vodka',
    url: 'https://usaspiritsratings.com/en/winner-companies/2024/southern-edge-beverage-company-2660.htm',
  },
]

export const BRAND_FACTS = [
  '6× Distilled',
  '60 Proof',
  'Natural Ingredients',
  'Gluten Free',
]

export const SOCIAL = {
  instagram: '@southernedgebeverages',
  instagramUrl: 'https://www.instagram.com/southernedgebeverages',
  facebook: 'Southern Edge Beverage Company',
  facebookUrl: 'https://www.facebook.com/southernedgebeverages',
  linktree: 'https://linktr.ee/southernedgebeverages',
  website: 'southernedgespirits.com',
  hashtags: ['#TasteTheEdge', '#SavorYourExperience'],
}

export const COPY = {
  taglinePrimary: 'Work Hard. Drink Smooth.',
  taglineSecondary: 'Taste The Edge.',
  taglineTertiary: '#SavorYourExperience',
  heroHeadline: 'WORK HARD',
  heroScript: 'Drink Smooth.',
  manifesto: `"The Legacy of Southern Edge Spirits is like a sip of the South,
embodying its rich history, warm hospitality and vibrant culture.
We invite you to experience the essence of the South
in every drop of Southern Edge."`,
  manifestoSub:
    'We invite you to experience the essence of the South in every drop of Southern Edge.',
  brandIntro:
    'Crafted with southern charm and a dedication to extraordinary taste, experience the finest flavored spirits from South Carolina.',
  communityHeadline: 'Taste The Edge.',
  communitySub:
    'Join us at tastings, events, and everywhere Southern Edge pours.',
  legalFooter:
    '© 2026 Southern Edge Beverage Company. All rights reserved.\nPlease drink responsibly. Must be 21+ to consume alcohol.',
  ageGateQuestion: 'Are you of legal drinking age?',
  ageGateYes: 'YES, I AM 21+',
  ageGateNo: 'NO, I AM NOT',
}
