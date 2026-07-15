// Single source of truth for all site data + copy.
// Content aligned to the brand's live site (see southern-edge-live-content.md).

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
// Brand story verbatim from client copy (Jun 2026). Editorial layout:
// Garden & Gun / Ralph Lauren register — story interleaved with imagery slots.
export type StoryImageSlot = {
  id: string
  src: string
  videoSrc?: string
  alt: string
  aspect: '21:9' | '16:9' | '4:5'
  objectPosition?: string
  caption?: string
  placeholder: boolean
}

export type StoryBlock =
  | { kind: 'paragraph'; text: string; dropCap?: boolean }
  | { kind: 'pullquote'; text: string }
  | { kind: 'image'; slotId: string }
  | { kind: 'imagePair'; slotIds: [string, string] }
  | { kind: 'textWithImage'; text: string; slotId: string; imageSide: 'left' | 'right' }

export const STORY_IMAGES: StoryImageSlot[] = [
  {
    id: 'oaks',
    src: '/images/story/story_01_oaks.jpg',
    alt: 'Avenue of live oaks draped in Spanish moss at golden hour',
    aspect: '21:9',
    placeholder: false,
  },
  {
    id: 'porch',
    src: '/images/story/story_02_porch.jpg',
    alt: 'Friends of all generations gathered on a porch at dusk under string lights',
    aspect: '4:5',
    objectPosition: '91% 50%',
    placeholder: false,
  },
  {
    id: 'streets',
    src: '/images/story/story_03_streets.jpg',
    alt: 'Couple sharing cocktails beside a cellist in a lantern-lit cobblestone plaza at dusk',
    aspect: '4:5',
    objectPosition: '25% 50%',
    placeholder: false,
  },
  {
    id: 'table',
    src: '/images/story/story_04_table.jpg',
    alt: 'Friends laughing and raising whiskey glasses together on a rooftop at dusk',
    aspect: '4:5',
    caption: 'Every event is connection.',
    placeholder: false,
  },
  {
    id: 'marsh',
    src: '/images/story/story_05_marsh.jpg',
    alt: 'Lowcountry marsh and sweetgrass at sunset',
    aspect: '4:5',
    caption: 'Rooted in the Lowcountry.',
    placeholder: false,
  },
]

export const STORY = {
  eyebrow: 'Our Story',
  headline: 'A Sip of the South',
  deck: 'Rooted in South Carolina. Built for the world.',
  signOff: '— Southern Edge',
  images: STORY_IMAGES,
  blocks: [
    {
      kind: 'paragraph',
      dropCap: true,
      text: "Our story begins in South Carolina. A place where every street, every sound, and every flavor carries history. From the Lowcountry's marshlands to Charleston's cobblestones, South Carolina has always been more than just a backdrop — it's been a cultural crossroads.",
    },
    { kind: 'image', slotId: 'oaks' },
    {
      kind: 'textWithImage',
      slotId: 'porch',
      imageSide: 'right',
      text: "The dance floor where African, Caribbean, and European influences met and intertwined, assembling the beat to its own drum. It's where the Gullah Geechee community carried forward traditions of storytelling, soulful cooking, and hospitality that continue to shape the South today. And it's where music, art, and flavor have always been bold — layered with history, yet alive with possibility.",
    },
    { kind: 'pullquote', text: "We're in the culture business." },
    {
      kind: 'textWithImage',
      slotId: 'streets',
      imageSide: 'left',
      text: "It's no coincidence our brand was born here. Because spirits, like South Carolina, are about depth. They're about honoring tradition while adding something fresh and unexpected. They're about bringing people together at the table, the way Southern hospitality has always done.",
    },
    {
      kind: 'paragraph',
      text: "We've taken familiar flavors to our distilling process, while pushing beyond the borders of common spirits. Our recipes are born at the edge of the imagination, delivering a rhythmic dance to the tastebuds while politely whispering nostalgic notes of what the South is about.",
    },
    { kind: 'imagePair', slotIds: ['table', 'marsh'] },
    {
      kind: 'paragraph',
      text: "But this isn't just a story for South Carolina. This is a story for everyone who values culture, connection, and community. It's for the foodie who wants to taste the South while exploring flavors from across the globe. For the creative who believes art and music are as essential as air. And for every community that knows sharing a drink isn't just about what's in the glass — it's about who you share it with.",
    },
    {
      kind: 'paragraph',
      text: "That's why we say: Southern Edge isn't just in the spirits business — we're in the culture business. Every sip is history. Every event is connection. And every experience is an invitation to join a movement rooted in South Carolina, but built for the world.",
    },
  ] as StoryBlock[],
}

export const VALUES = [
  { title: 'Quality', body: 'We never compromise on quality. Every ingredient is carefully selected and every process meticulously monitored.' },
  { title: 'Heritage', body: 'Our recipes honor the traditions of the South — flavors layered with history, yet alive with possibility.' },
  { title: 'Community', body: 'Hospitality is our craft. We bring people together around the table, the way the South always has.' },
]

// ── FIND US (store locator) ──────────────────────────────────────────────
export const FIND_US = {
  eyebrow: 'Where to Buy',
  headline: 'Find Us Near You',
  sub: 'We are now in stores across South Carolina and Georgia!',
  cta: 'Find a store near you.',
  states: ['South Carolina', 'Georgia'],
  mapEmbed: 'https://www.google.com/maps/d/u/0/embed?mid=13W5baTb9iaJ6r1pg4eyQ4WenvFjeorg',
}

export type StoreLocation = {
  name: string
  addressLines: string[]
}

// Client-verified placements (Tashawne / Charles, Jun 2026). South Carolina + Georgia.
export const STORES: { state: string; locations: StoreLocation[] }[] = [
  {
    state: 'South Carolina',
    locations: [
      {
        name: 'JK’s Liquor Store ABC',
        addressLines: ['2742 E Cherokee St', 'Blacksburg, SC 29702'],
      },
      {
        name: 'A to Z Liquor',
        addressLines: ['153 Walton Dr, Ste 3', 'Gaffney, SC 29341'],
      },
      {
        name: 'Lake Bowen Liquor',
        addressLines: ['2870 Highway 292, Ste 1', 'Inman, SC 29349'],
      },
      {
        name: 'Lucky ABC Party Shop',
        addressLines: ['61A S Main St', 'Inman, SC 29369'],
      },
      {
        name: 'Royal Liquors',
        addressLines: ['11721 Asheville Hwy, Ste 1', 'Inman, SC 29349'],
      },
      {
        name: 'S & J Liquor and Wine',
        addressLines: ['9098-A Asheville Hwy', 'Boiling Springs, SC 29316'],
      },
      {
        name: 'Westgate Wine & Spirits',
        addressLines: ['1415 WO Ezell Blvd, Unit A', 'Spartanburg, SC 29301'],
      },
      {
        name: 'Amar 101 Liquor',
        addressLines: ['1985 Highway 101 S', 'Greer, SC 29651'],
      },
      {
        name: 'Liquor Pointe 2',
        addressLines: ['5844 Redville Rd, Ste B', 'Moore, SC 29369'],
      },
      {
        name: 'Roebuck ABC & Corner Mart',
        addressLines: ['4019 S Church St EXT', 'Roebuck, SC 29376'],
      },
      {
        name: 'Noble Liquor',
        addressLines: ['1625 Holly Springs Rd', 'Lyman, SC 29365'],
      },
      {
        name: 'R & M Liquor',
        addressLines: ['120 Goodjoin Rd', 'Lyman, SC 29365'],
      },
      {
        name: 'O’Darby’s',
        addressLines: ['127 Fairwinds Dr', 'Landrum, SC 29356'],
      },
      {
        name: 'Jakob Food Mart Liquor',
        addressLines: ['927 North Main St, B', 'Clover, SC 29710'],
      },
      {
        name: 'Klee’s ABC Package and Party',
        addressLines: ['703 N Main St, Ste A', 'Clover, SC 29710'],
      },
      {
        name: 'Klee’s Spirit Shoppe',
        addressLines: ['1087 Filbert Hwy', 'York, SC 29745'],
      },
      {
        name: 'Pride Liquor Store',
        addressLines: ['328 S Congress St, Ste B'],
      },
      {
        name: 'Lake Wylie Liquor',
        addressLines: ['5081 Charlotte Hwy', 'Clover, SC 29710'],
      },
      {
        name: 'Liquor @ the Lake',
        addressLines: ['4034 Charlotte Hwy, Unit 104', 'Lake Wylie, SC 29710'],
      },
      {
        name: 'Rock Hill Crossing ABC',
        addressLines: ['4811 Old York Rd', 'Rock Hill, SC 29732'],
      },
      {
        name: 'O’Darby’s Heckle',
        addressLines: ['1740 Heckle Blvd', 'Rock Hill, SC 29730'],
      },
      {
        name: 'O’Darby’s Dave Lyle',
        addressLines: ['2350 Dave Lyle Blvd', 'Rock Hill, SC 29730'],
      },
      {
        name: 'O’Darby’s Riverchase',
        addressLines: ['1421 Riverchase Blvd', 'Rock Hill, SC 29732'],
      },
      {
        name: 'Albright ABC',
        addressLines: ['1377 E Main St', 'Rock Hill, SC 29730'],
      },
      {
        name: 'Discount Liquor',
        addressLines: ['400 N Dobys Bridge Rd, Unit 103', 'Fort Mill, SC 29715'],
      },
      {
        name: 'FairWay ABC',
        addressLines: ['1290 Tom Hall St', 'Fort Mill, SC 29715'],
      },
      {
        name: 'Clary’s Liquor Shop',
        addressLines: ['3160 US-21, Ste 104', 'Fort Mill, SC 29715'],
      },
      {
        name: 'Stateline Beverages',
        addressLines: ['3670 Highway 51', 'Fort Mill, SC 29715'],
      },
      {
        name: 'Stateline Elite',
        addressLines: ['9804 B Charlotte Hwy', 'Fort Mill, SC 29707'],
      },
      {
        name: 'Lazy Day Liquors',
        addressLines: ['833 Stockbridge Dr', 'Fort Mill, SC 29708'],
      },
      {
        name: 'Churchill’s Liquor & Wine',
        addressLines: ['1826 SC-160, Unit 102', 'Fort Mill, SC 29708'],
      },
      {
        name: 'Gold Hill Discount Spirit',
        addressLines: ['940 Gold Hill Rd', 'Fort Mill, SC 29708'],
      },
      {
        name: 'Carolina Wine & Spirits',
        addressLines: ['6277 Carolina Commons Dr, Ste 1000', 'Fort Mill, SC 29707'],
      },
      {
        name: 'Winnsboro Package Store',
        addressLines: ['318 S Congress St', 'Winnsboro, SC 29180'],
      },
      {
        name: 'Country Mart Liquor',
        addressLines: ['16683 US-21', 'Great Falls, SC 29055'],
      },
    ],
  },
  {
    state: 'Georgia',
    locations: [
      {
        name: 'Chamblee Package',
        addressLines: ['2511 Chamblee Tucker Rd', 'Chamblee, GA 30341'],
      },
      {
        name: "J's Beverage Depot",
        addressLines: ['1570 Holcomb Bridge Rd, STE 610', 'Roswell, GA 30076'],
      },
      {
        name: 'Marketplace Beverage',
        addressLines: ['50 Marketplace Dr', 'Newnan, GA 30265'],
      },
      {
        name: 'Prohibition Liquor and Wine',
        addressLines: ['3150 Highlands Pkwy SE, Suite 202', 'Smyrna, GA 30082'],
      },
      {
        name: 'Wilshire Liquor, Beer and Wine',
        addressLines: ['1200 Hwy 74 S, Suite 8', 'Peachtree City, GA 30269'],
      },
      {
        name: 'Wine & Liquor Emporium',
        addressLines: ['7342 Stonecrest Concourse, Suite D', 'Stonecrest, GA 30038'],
      },
      {
        name: 'Sweetwater Package Store',
        addressLines: ['3900 Peachtree Industrial Blvd', 'Duluth, GA 30096'],
      },
      {
        name: 'Panhandle Package Liquors',
        addressLines: ['1681 Flicker Rd', 'Jonesboro, GA 30236'],
      },
      {
        name: 'Crooks',
        addressLines: ['7790 Wells Street', 'Senoia, GA 30276'],
      },
      {
        name: "Brandon's Package Store",
        addressLines: ['965 Glynn St N', 'Fayetteville, GA 30214'],
      },
      {
        name: 'Dunwoody World of Beverages',
        addressLines: ['4621 N Shallowford Rd', 'Dunwoody, GA 30338'],
      },
      {
        name: 'Forsyth World of Beverage',
        addressLines: ['3535 Peachtree Parkway', 'Suwanee, GA 30024'],
      },
      {
        name: 'Camp Creek World of Beverages',
        addressLines: ['3780 Princeton Lakes Pkwy SW', 'Atlanta, GA 30344'],
      },
      {
        name: 'Georgia World of Beverage',
        addressLines: ['8455 Senoia Road', 'Fairburn, GA 30213'],
      },
      {
        name: 'Arbor Place Beverage',
        addressLines: ['7455 Douglas Boulevard', 'Douglasville, GA 30135'],
      },
      {
        name: 'Capital City Wine & Spirits',
        addressLines: ['784 Collier Rd NW', 'Atlanta, GA 30318'],
      },
    ],
  },
]

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
  email: 'contact@southernedgebeverages.com',
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
  email: 'contact@southernedgebeverages.com',
  website: 'southernedgespirits.com',
  hashtags: ['#TasteTheEdge', '#SavorYourExperience'],
}

// Navigation links — expanded to mirror the live site's information architecture.
export const NAV_LINKS = [
  { label: 'Our Story', href: '/story' },
  { label: 'Cocktails', href: '/cocktails' },
  { label: 'Find Us', href: '/#findus' },
  { label: 'Connect', href: '/#connect' },
]

// Verbatim from ScrollRibbon.tsx ITEMS.
export const RIBBON_ITEMS = ['TASTE THE EDGE', 'WORK HARD · DRINK SMOOTH', 'CRAFTED IN SC', 'SOUTHERN HOSPITALITY', '60 PROOF', 'GLUTEN FREE']

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
    'Lowcountry soul in every bottle. Spirits made for the table, the porch, and the people you share them with.',
  legalFooter:
    '© 2026 The Southern Edge Beverage Company, LLC. All rights reserved.\nPlease drink responsibly. Must be 21+ to consume alcohol.',
  ageGateQuestion: 'Are you of legal drinking age?',
  ageGateYes: 'Yes, I Am 21+',
  ageGateNo: 'No, I Am Not',
}
