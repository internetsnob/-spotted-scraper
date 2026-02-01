/**
 * Venue seed data for Spotted In & Around — Dripping Springs & Hill Country
 *
 * Each venue has:
 *   - id:          unique stable identifier (used as key everywhere)
 *   - name:        display name
 *   - category:    one of the 4 event categories from the web app
 *   - address:     street address for display
 *   - website:     URL the scraper will check for events / specials
 *   - description: short static blurb
 *   - tags:        searchable keywords
 *
 * To add a new venue: copy a block, fill in the fields, done.
 */

export interface Venue {
  id: string;
  name: string;
  category: "Live Music" | "Food & Drink" | "Arts & Culture" | "Outdoors";
  address: string;
  website: string;
  description: string;
  tags: string[];
}

export const VENUES: Venue[] = [
  // ── Live Music ──
  {
    id: "jester-king",
    name: "Jester King Brewery",
    category: "Live Music",
    address: "16000 Ranch to Market Rd 1261, Austin, TX 78734",
    website: "https://www.jesterking.com/events",
    description: "Farm-style brewery with live music on weekends and a stunning Hill Country backdrop.",
    tags: ["brewery", "live music", "weekend", "outdoor", "craft beer"],
  },
  {
    id: "salt-lick-bbq",
    name: "The Salt Lick BBQ",
    category: "Food & Drink",
    address: "18939 TX-1826, Driftwood, TX 78619",
    website: "https://www.saltlickbbq.com/events",
    description: "Legendary open-pit BBQ with live music on weekends. A Hill Country institution.",
    tags: ["bbq", "live music", "weekend", "driftwood", "iconic"],
  },
  {
    id: "dripping-springs-vineyard",
    name: "Dripping Springs Vineyard & Winery",
    category: "Live Music",
    address: "9575 Lumberman's Circle, Dripping Springs, TX 78620",
    website: "https://www.drippingspringsvineyard.com/events",
    description: "Wine tastings and live acoustic music in a gorgeous vineyard setting.",
    tags: ["winery", "wine tasting", "live music", "vineyard", "events"],
  },
  {
    id: "now-and-zen",
    name: "Now & Zen Brewing",
    category: "Live Music",
    address: "18621 US-290 W, Dripping Springs, TX 78620",
    website: "https://www.nowandzenbrewing.com/events",
    description: "Local craft brewery with regular live music and a relaxed Hill Country vibe.",
    tags: ["brewery", "craft beer", "live music", "local"],
  },
  {
    id: "treaty-oak-distilling",
    name: "Treaty Oak Distilling",
    category: "Live Music",
    address: "19330 State Hwy 12, Dripping Springs, TX 78620",
    website: "https://www.treatyoakdistilling.com/events",
    description: "Award-winning distillery with tastings, cocktails, and weekend live music.",
    tags: ["distillery", "spirits", "cocktails", "live music", "tasting"],
  },

  // ── Food & Drink ──
  {
    id: "leatherneck-brewing",
    name: "Leatherneck Brewing",
    category: "Food & Drink",
    address: "316 Tumbleweed Pkwy, Dripping Springs, TX 78620",
    website: "https://www.leatherneckbrewing.com/events",
    description: "Veteran-owned brewery in downtown DS. Trivia nights, happy hours, and craft beers on tap.",
    tags: ["brewery", "happy hour", "trivia", "downtown", "veteran-owned"],
  },
  {
    id: "olive-branch",
    name: "Olive Branch Kitchen & Bar",
    category: "Food & Drink",
    address: "316 Tumbleweed Pkwy Suite 105, Dripping Springs, TX 78620",
    website: "https://www.olivebranch.com/events",
    description: "Farm-to-table dining right in downtown Dripping Springs. Great for date nights.",
    tags: ["farm-to-table", "dinner", "date night", "downtown", "bar"],
  },
  {
    id: "be-held",
    name: "Be Held Bar",
    category: "Food & Drink",
    address: "316 Tumbleweed Pkwy Suite 101, Dripping Springs, TX 78620",
    website: "https://www.beheldbar.com/events",
    description: "Cozy cocktail bar in downtown DS with craft cocktails and a laid-back atmosphere.",
    tags: ["cocktail bar", "craft cocktails", "downtown", "evening"],
  },
  {
    id: "hops-and-glory",
    name: "Hops & Glory",
    category: "Food & Drink",
    address: "18621 US-290 W, Dripping Springs, TX 78620",
    website: "https://www.hopsandglory.com/events",
    description: "Casual brewpub with a rotating tap list and Friday happy hours.",
    tags: ["brewpub", "happy hour", "casual", "friday"],
  },
  {
    id: "the-chisholm-trail",
    name: "Chisholm Trail Smokehouse",
    category: "Food & Drink",
    address: "18800 US-290 E, Dripping Springs, TX 78620",
    website: "https://www.chisholm-trail.com/events",
    description: "Classic Texas smokehouse with brisket, ribs, and weekend specials.",
    tags: ["smokehouse", "bbq", "texas", "weekend specials"],
  },

  // ── Arts & Culture ──
  {
    id: "dripping-springs-gin",
    name: "Dripping Springs Original Gin",
    category: "Arts & Culture",
    address: "19330 State Hwy 12, Dripping Springs, TX 78620",
    website: "https://www.drippingspringsgin.com/events",
    description: "Gin distillery with tastings and the occasional art pop-up or cultural event.",
    tags: ["gin", "distillery", "tasting", "art", "culture"],
  },
  {
    id: "hill-country-arts",
    name: "Hill Country Center for the Arts",
    category: "Arts & Culture",
    address: "19550 Dripping Springs Ranch Rd, Dripping Springs, TX 78620",
    website: "https://www.hillcountryarts.com/events",
    description: "Live theater, art shows, and cultural performances in a beautiful Hill Country venue.",
    tags: ["theater", "art shows", "performances", "culture", "events"],
  },
  {
    id: "lone-star-ice-cream",
    name: "Lone Star Ice Cream",
    category: "Arts & Culture",
    address: "316 Tumbleweed Pkwy Suite 103, Dripping Springs, TX 78620",
    website: "https://www.lonestaricecrm.com",
    description: "Hand-churned ice cream in downtown DS. A weekend staple for families.",
    tags: ["ice cream", "family", "downtown", "weekend", "dessert"],
  },
  {
    id: "barton-creek-conservatory",
    name: "Barton Creek Conservatory",
    category: "Arts & Culture",
    address: "2930 Southwest Pkwy, Austin, TX 78746",
    website: "https://www.bartoncreek.com/events",
    description: "Botanical gardens with seasonal exhibits, garden tours, and community events.",
    tags: ["botanical", "gardens", "tours", "family", "nature"],
  },

  // ── Outdoors ──
  {
    id: "hamilton-pool",
    name: "Hamilton Pool Preserve",
    category: "Outdoors",
    address: "23440 Hamilton Pool Rd, Austin, TX 78738",
    website: "https://parks.traviscounty.gov/hamilton-pool-preserve",
    description: "One of the most stunning natural swimming holes in Texas. Reservation required.",
    tags: ["swimming", "nature", "preserve", "reservation", "scenic"],
  },
  {
    id: "jacob-well",
    name: "Jacob Well Natural Swimming Hole",
    category: "Outdoors",
    address: "615 Jacob Well Rd, Wimberley, TX 78676",
    website: "https://www.hays.texas.gov/jacobwell",
    description: "Crystal-clear natural spring swimming hole. One of the most beautiful in Texas.",
    tags: ["swimming", "natural spring", "wimberley", "clear water", "scenic"],
  },
  {
    id: "barton-creek-greenbelt",
    name: "Barton Creek Greenbelt",
    category: "Outdoors",
    address: "3600 Loop 360 South, Austin, TX 78746",
    website: "https://austinparks.org/barton-creek-greenbelt",
    description: "Miles of trails along Barton Creek. Swimming, hiking, and mountain biking.",
    tags: ["hiking", "swimming", "trails", "biking", "greenbelt"],
  },
  {
    id: "pedernales-falls",
    name: "Pedernales Falls State Park",
    category: "Outdoors",
    address: "2833 Park Dr, Johnson City, TX 78636",
    website: "https://www.texas.gov/pedernales-falls",
    description: "Stunning waterfall and river swimming in a beautiful state park.",
    tags: ["waterfall", "state park", "swimming", "hiking", "nature"],
  },
  {
    id: "bs-ranch",
    name: "BS Ranch",
    category: "Outdoors",
    address: "18741 State Hwy 12, Dripping Springs, TX 78620",
    website: "https://www.bsranch.com/events",
    description: "Hill Country ranch venue for outdoor events, concerts, and private gatherings.",
    tags: ["ranch", "outdoor events", "concerts", "hill country", "venue"],
  },
  {
    id: "devils-backbone",
    name: "Devil's Backbone State Natural Area",
    category: "Outdoors",
    address: "State Hwy 473, San Marcos, TX 78666",
    website: "https://www.tpwd.texas.gov/devils-backbone",
    description: "Beautiful ridgeline hiking with panoramic Hill Country views. Great for sunset hikes.",
    tags: ["hiking", "ridgeline", "views", "sunset", "nature"],
  },
];
