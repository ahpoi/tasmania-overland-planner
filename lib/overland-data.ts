export interface Waypoint {
  id: string
  name: string
  lat: number
  lng: number
  type: "hut" | "peak" | "waterfall" | "start" | "end" | "junction" | "sidetrip"
  description?: string
  sideTripId?: string
}

export interface SideTrip {
  id: string
  dayId: number
  name: string
  distanceKm: number
  ascentM: number
  descentM: number
  timeHoursMin: number
  timeHoursMax: number
  description: string
  difficulty: "Easy" | "Moderate" | "Hard" | "Very Hard"
  waypointId?: string
  junctionLat?: number
  junctionLng?: number
  elevationProfile?: { distance: number; elevation: number }[]
}

export interface DaySegment {
  id: number
  name: string
  from: string
  to: string
  baseDistanceKm: number
  baseAscentM: number
  baseDescentM: number
  baseTimeHoursMin: number
  baseTimeHoursMax: number
  description: string
  difficulty: "Easy" | "Moderate" | "Hard"
  highlights: string[]
}

export const waypoints: Waypoint[] = [
  { id: "ronny-creek", name: "Ronny Creek", lat: -41.63596, lng: 145.94912, type: "start", description: "Official start of the Overland Track" },
  { id: "waterfall-valley", name: "Waterfall Valley Huts", lat: -41.71442, lng: 145.94647, type: "hut", description: "Day 1 destination with stunning views" },
  { id: "windermere", name: "Windermere Hut", lat: -41.77153, lng: 145.95645, type: "hut", description: "Beautiful lakeside setting" },
  { id: "pelion", name: "New Pelion Hut", lat: -41.8294281, lng: 146.0463161, type: "hut", description: "Largest hut on the track" },
  { id: "kia-ora", name: "Kia Ora Hut", lat: -41.8915626, lng: 146.0819023, type: "hut", description: "Gateway to waterfalls" },
  { id: "bert-nichols", name: "Bert Nichols Hut", lat: -41.9320372, lng: 146.0893035, type: "hut", description: "Also known as Windy Ridge Hut" },
  { id: "narcissus", name: "Narcissus Hut", lat: -42.0123791, lng: 146.1017329, type: "hut", description: "Ferry pickup point" },
  { id: "cynthia-bay", name: "Cynthia Bay", lat: -42.1163706, lng: 146.1742892, type: "end", description: "Lake St Clair Visitor Centre" },
  { id: "mt-ossa", name: "Mt Ossa", lat: -41.87072, lng: 146.03297, type: "peak", description: "Tasmania's highest peak (1617m)", sideTripId: "mt-ossa" },
  { id: "cradle-mountain", name: "Cradle Mountain", lat: -41.6846445, lng: 145.9513044, type: "peak", description: "Iconic Tasmanian peak (1545m)", sideTripId: "cradle-summit" },
  { id: "barn-bluff", name: "Barn Bluff", lat: -41.72404, lng: 145.92303, type: "peak", description: "Tasmania's fourth-highest mountain (1559m)", sideTripId: "barn-bluff" },
  { id: "pelion-east", name: "Pelion East", lat: -41.8572298, lng: 146.0676204, type: "peak", description: "Steep summit with views over Pelion Gap (1461m)", sideTripId: "pelion-east" },
  { id: "mt-oakleigh", name: "Mt Oakleigh", lat: -41.805, lng: 146.03611, type: "peak", description: "Panoramic summit above Pelion Plains (1286m)", sideTripId: "mt-oakleigh" },
  { id: "hartnett-falls", name: "Hartnett Falls", lat: -41.9134075, lng: 146.1282551, type: "waterfall", description: "Popular Mersey River waterfall reached from the Overland Track", sideTripId: "hartnett-falls" },
  { id: "fergusson-falls", name: "Fergusson Falls", lat: -41.9084768, lng: 146.1221974, type: "waterfall", description: "Short detour waterfall usually paired with D'Alton Falls", sideTripId: "fergusson-falls" },
  { id: "dalton-falls", name: "D'Alton Falls", lat: -41.908132, lng: 146.1201569, type: "waterfall", description: "Mersey River waterfall on the shared D'Alton/Fergusson detour", sideTripId: "dalton-falls" },
]

export const days: DaySegment[] = [
  {
    id: 1,
    name: "Day 1",
    from: "Ronny Creek",
    to: "Waterfall Valley Huts",
    baseDistanceKm: 10.7,
    baseAscentM: 600,
    baseDescentM: 200,
    baseTimeHoursMin: 4,
    baseTimeHoursMax: 6,
    description: "Start with a big climb through alpine moorland to Crater Lake, then descend to Waterfall Valley.",
    difficulty: "Hard",
    highlights: ["Crater Lake", "Marion's Lookout", "Alpine moorland", "Button grass plains"]
  },
  {
    id: 2,
    name: "Day 2",
    from: "Waterfall Valley Huts",
    to: "Windermere Hut",
    baseDistanceKm: 7.8,
    baseAscentM: 200,
    baseDescentM: 350,
    baseTimeHoursMin: 3,
    baseTimeHoursMax: 4,
    description: "A shorter day through Lake Will area and down to beautiful Lake Windermere.",
    difficulty: "Easy",
    highlights: ["Lake Will", "Lake Windermere", "Rainforest sections"]
  },
  {
    id: 3,
    name: "Day 3",
    from: "Windermere Hut",
    to: "New Pelion Hut",
    baseDistanceKm: 17,
    baseAscentM: 400,
    baseDescentM: 500,
    baseTimeHoursMin: 6,
    baseTimeHoursMax: 7,
    description: "The longest day traversing Frog Flats to the impressive New Pelion Hut at the base of Mt Ossa.",
    difficulty: "Moderate",
    highlights: ["Frog Flats", "Forth Valley", "Pelion Plains", "Views of Mt Ossa"]
  },
  {
    id: 4,
    name: "Day 4",
    from: "New Pelion Hut",
    to: "Kia Ora Hut",
    baseDistanceKm: 8.6,
    baseAscentM: 450,
    baseDescentM: 400,
    baseTimeHoursMin: 3,
    baseTimeHoursMax: 4,
    description: "Climb to Pelion Gap with options for Mt Ossa, then descend through mossy rainforest to Kia Ora.",
    difficulty: "Moderate",
    highlights: ["Pelion Gap", "Rainforest descent", "Mountain views"]
  },
  {
    id: 5,
    name: "Day 5",
    from: "Kia Ora Hut",
    to: "Bert Nichols Hut",
    baseDistanceKm: 9.5,
    baseAscentM: 250,
    baseDescentM: 300,
    baseTimeHoursMin: 4,
    baseTimeHoursMax: 5,
    description: "Waterfall country! Options for Fergusson Falls, D'Alton Falls, and Hartnett Falls side trips.",
    difficulty: "Moderate",
    highlights: ["Du Cane Gap", "Pine forest", "Multiple waterfall options"]
  },
  {
    id: 6,
    name: "Day 6",
    from: "Bert Nichols Hut",
    to: "Narcissus Hut",
    baseDistanceKm: 9.2,
    baseAscentM: 100,
    baseDescentM: 350,
    baseTimeHoursMin: 3,
    baseTimeHoursMax: 4,
    description: "Gentle descent through ancient rainforest to Lake St Clair. Ferry pickup available.",
    difficulty: "Easy",
    highlights: ["Ancient rainforest", "Lake St Clair views", "Ferry option"]
  },
  {
    id: 7,
    name: "Day 7 (Optional)",
    from: "Narcissus Hut",
    to: "Cynthia Bay",
    baseDistanceKm: 17.5,
    baseAscentM: 150,
    baseDescentM: 150,
    baseTimeHoursMin: 5,
    baseTimeHoursMax: 6,
    description: "Walk the lakeside track instead of taking the ferry. Beautiful but long final day.",
    difficulty: "Moderate",
    highlights: ["Lake St Clair shoreline", "Echo Point Hut", "Visitor Centre finish"]
  }
]

export const sideTrips: SideTrip[] = [
  {
    id: "cradle-summit",
    dayId: 1,
    name: "Cradle Mountain Summit",
    distanceKm: 2.0,
    ascentM: 395,
    descentM: 395,
    timeHoursMin: 2,
    timeHoursMax: 3,
    description: "Official side trip from Kitchen Hut with steep boulder scrambling near the summit. Best attempted only in fine weather.",
    difficulty: "Hard",
    waypointId: "cradle-mountain",
    junctionLat: -41.676908,
    junctionLng: 145.947534,
    elevationProfile: [
      { distance: 0, elevation: 1150 },
      { distance: 0.5, elevation: 1280 },
      { distance: 1, elevation: 1545 },
      { distance: 1.5, elevation: 1350 },
      { distance: 2, elevation: 1150 }
    ]
  },
  {
    id: "barn-bluff",
    dayId: 1,
    name: "Barn Bluff",
    distanceKm: 7.0,
    ascentM: 359,
    descentM: 359,
    timeHoursMin: 3,
    timeHoursMax: 4,
    description: "Steep side trip with boulder scrambling toward the summit. Tasmania Parks recommends attempting it only in fine weather.",
    difficulty: "Hard",
    waypointId: "barn-bluff",
    junctionLat: -41.7052,
    junctionLng: 145.94527,
    elevationProfile: [
      { distance: 0, elevation: 1150 },
      { distance: 2.5, elevation: 1300 },
      { distance: 3.5, elevation: 1559 },
      { distance: 5, elevation: 1350 },
      { distance: 7, elevation: 1150 }
    ]
  },
  {
    id: "mt-ossa",
    dayId: 4,
    name: "Mt Ossa Summit",
    distanceKm: 5.2,
    ascentM: 487,
    descentM: 487,
    timeHoursMin: 4,
    timeHoursMax: 5,
    description: "Tasmania's highest peak. The Pelion Gap side trip is steep, exposed, and should not be attempted in heavy rain or snow.",
    difficulty: "Hard",
    waypointId: "mt-ossa",
    junctionLat: -41.86397,
    junctionLng: 146.05812,
    elevationProfile: [
      { distance: 0, elevation: 1130 },
      { distance: 1.3, elevation: 1280 },
      { distance: 2.6, elevation: 1617 },
      { distance: 3.9, elevation: 1400 },
      { distance: 5.2, elevation: 1130 }
    ]
  },
  {
    id: "pelion-east",
    dayId: 4,
    name: "Pelion East",
    distanceKm: 2.4,
    ascentM: 331,
    descentM: 331,
    timeHoursMin: 2,
    timeHoursMax: 2,
    description: "Shorter Pelion Gap summit option with steep, exposed terrain and a final scramble onto the summit block.",
    difficulty: "Hard",
    waypointId: "pelion-east",
    junctionLat: -41.863984,
    junctionLng: 146.0580786,
    elevationProfile: [
      { distance: 0, elevation: 1130 },
      { distance: 0.8, elevation: 1280 },
      { distance: 1.2, elevation: 1461 },
      { distance: 1.7, elevation: 1300 },
      { distance: 2.4, elevation: 1130 }
    ]
  },
  {
    id: "mt-oakleigh",
    dayId: 3,
    name: "Mt Oakleigh",
    distanceKm: 8.0,
    ascentM: 516,
    descentM: 516,
    timeHoursMin: 4,
    timeHoursMax: 6,
    description: "Longer side trip from New Pelion Hut across muddy moorland and forest to panoramic viewpoints above the dolerite spires.",
    difficulty: "Moderate",
    waypointId: "mt-oakleigh",
    junctionLat: -41.82964,
    junctionLng: 146.04639,
    elevationProfile: [
      { distance: 0, elevation: 770 },
      { distance: 2.5, elevation: 980 },
      { distance: 4, elevation: 1286 },
      { distance: 5.5, elevation: 1100 },
      { distance: 8, elevation: 770 }
    ]
  },
  {
    id: "fergusson-falls",
    dayId: 5,
    name: "Fergusson Falls",
    distanceKm: 1.0,
    ascentM: 70,
    descentM: 70,
    timeHoursMin: 1,
    timeHoursMax: 1,
    description: "Official walk notes group this with D'Alton Falls as a shared short detour from the Overland Track.",
    difficulty: "Moderate",
    waypointId: "fergusson-falls",
    junctionLat: -41.9096278,
    junctionLng: 146.1195429,
    elevationProfile: [
      { distance: 0, elevation: 900 },
      { distance: 0.5, elevation: 830 },
      { distance: 1, elevation: 900 }
    ]
  },
  {
    id: "dalton-falls",
    dayId: 5,
    name: "D'Alton Falls",
    distanceKm: 1.0,
    ascentM: 70,
    descentM: 70,
    timeHoursMin: 1,
    timeHoursMax: 1,
    description: "Official walk notes group this with Fergusson Falls as a shared 1 km return side trip.",
    difficulty: "Moderate",
    waypointId: "dalton-falls",
    junctionLat: -41.9096278,
    junctionLng: 146.1195429,
    elevationProfile: [
      { distance: 0, elevation: 900 },
      { distance: 0.35, elevation: 850 },
      { distance: 0.5, elevation: 820 },
      { distance: 0.7, elevation: 860 },
      { distance: 1, elevation: 900 }
    ]
  },
  {
    id: "hartnett-falls",
    dayId: 5,
    name: "Hartnett Falls",
    distanceKm: 1.5,
    ascentM: 60,
    descentM: 60,
    timeHoursMin: 1,
    timeHoursMax: 1,
    description: "Popular short detour to a dramatic Mersey River gorge waterfall with slippery sections near the lookout.",
    difficulty: "Moderate",
    waypointId: "hartnett-falls",
    junctionLat: -41.9177995,
    junctionLng: 146.1246708,
    elevationProfile: [
      { distance: 0, elevation: 880 },
      { distance: 0.5, elevation: 820 },
      { distance: 0.75, elevation: 780 },
      { distance: 1, elevation: 830 },
      { distance: 1.5, elevation: 880 }
    ]
  }
]

// Pre-computed elevation profile data for each day (simplified from GPX)
export const elevationProfiles: Record<number, { distance: number; elevation: number }[]> = {
  1: [
    { distance: 0, elevation: 860 },
    { distance: 1, elevation: 920 },
    { distance: 2, elevation: 1050 },
    { distance: 3, elevation: 1150 },
    { distance: 4, elevation: 1200 },
    { distance: 5, elevation: 1250 },
    { distance: 6, elevation: 1180 },
    { distance: 7, elevation: 1100 },
    { distance: 8, elevation: 1020 },
    { distance: 9, elevation: 980 },
    { distance: 10.7, elevation: 920 }
  ],
  2: [
    { distance: 0, elevation: 920 },
    { distance: 1, elevation: 950 },
    { distance: 2, elevation: 1000 },
    { distance: 3, elevation: 980 },
    { distance: 4, elevation: 920 },
    { distance: 5, elevation: 850 },
    { distance: 6, elevation: 800 },
    { distance: 7.8, elevation: 780 }
  ],
  3: [
    { distance: 0, elevation: 780 },
    { distance: 2, elevation: 750 },
    { distance: 4, elevation: 720 },
    { distance: 6, elevation: 700 },
    { distance: 8, elevation: 720 },
    { distance: 10, elevation: 780 },
    { distance: 12, elevation: 850 },
    { distance: 14, elevation: 900 },
    { distance: 17, elevation: 860 }
  ],
  4: [
    { distance: 0, elevation: 860 },
    { distance: 1, elevation: 920 },
    { distance: 2, elevation: 1000 },
    { distance: 3, elevation: 1100 },
    { distance: 4, elevation: 1150 },
    { distance: 5, elevation: 1100 },
    { distance: 6, elevation: 1000 },
    { distance: 7, elevation: 900 },
    { distance: 8.6, elevation: 850 }
  ],
  5: [
    { distance: 0, elevation: 850 },
    { distance: 1, elevation: 880 },
    { distance: 2, elevation: 920 },
    { distance: 3, elevation: 950 },
    { distance: 4, elevation: 980 },
    { distance: 5, elevation: 950 },
    { distance: 6, elevation: 900 },
    { distance: 7, elevation: 850 },
    { distance: 8, elevation: 800 },
    { distance: 9.5, elevation: 780 }
  ],
  6: [
    { distance: 0, elevation: 780 },
    { distance: 1, elevation: 750 },
    { distance: 2, elevation: 720 },
    { distance: 3, elevation: 690 },
    { distance: 4, elevation: 660 },
    { distance: 5, elevation: 640 },
    { distance: 6, elevation: 620 },
    { distance: 7, elevation: 600 },
    { distance: 8, elevation: 590 },
    { distance: 9.2, elevation: 740 }
  ],
  7: [
    { distance: 0, elevation: 740 },
    { distance: 2, elevation: 745 },
    { distance: 4, elevation: 750 },
    { distance: 6, elevation: 755 },
    { distance: 8, elevation: 750 },
    { distance: 10, elevation: 748 },
    { distance: 12, elevation: 745 },
    { distance: 14, elevation: 742 },
    { distance: 17.5, elevation: 740 }
  ]
}
