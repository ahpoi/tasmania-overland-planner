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
  { id: "mt-ossa", name: "Mt Ossa", lat: -41.87061, lng: 146.03298, type: "peak", description: "Tasmania's highest peak (1617m)", sideTripId: "mt-ossa" },
  { id: "cradle-mountain", name: "Cradle Mountain", lat: -41.6644, lng: 145.9422, type: "peak", description: "Iconic Tasmanian peak (1545m)", sideTripId: "cradle-summit" },
  { id: "barn-bluff", name: "Barn Bluff", lat: -41.6867, lng: 145.9433, type: "peak", description: "Dramatic peak near Cradle (1559m)", sideTripId: "barn-bluff" },
  { id: "pelion-east", name: "Pelion East", lat: -41.84, lng: 146.06, type: "peak", description: "Great views, shorter climb", sideTripId: "pelion-east" },
  { id: "mt-oakleigh", name: "Mt Oakleigh", lat: -41.82, lng: 146.08, type: "peak", description: "Panoramic views", sideTripId: "mt-oakleigh" },
  { id: "hartnett-falls", name: "Hartnett Falls", lat: -41.91, lng: 146.09, type: "waterfall", description: "Beautiful waterfall off main track", sideTripId: "hartnett-falls" },
  { id: "fergusson-falls", name: "Fergusson Falls", lat: -41.905, lng: 146.085, type: "waterfall", description: "Side trip from Kia Ora", sideTripId: "fergusson-falls" },
  { id: "dalton-falls", name: "D'Alton Falls", lat: -41.908, lng: 146.088, type: "waterfall", description: "Combined with Fergusson Falls loop", sideTripId: "dalton-falls" },
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
    distanceKm: 5.0,
    ascentM: 450,
    descentM: 450,
    timeHoursMin: 2.5,
    timeHoursMax: 4,
    description: "Iconic summit scramble with spectacular 360° views. Rocky terrain, some scrambling required.",
    difficulty: "Hard",
    waypointId: "cradle-mountain",
    elevationProfile: [
      { distance: 0, elevation: 1200 },
      { distance: 1, elevation: 1300 },
      { distance: 2, elevation: 1450 },
      { distance: 2.5, elevation: 1545 },
      { distance: 3.5, elevation: 1400 },
      { distance: 5, elevation: 1200 }
    ]
  },
  {
    id: "barn-bluff",
    dayId: 1,
    name: "Barn Bluff",
    distanceKm: 6.0,
    ascentM: 500,
    descentM: 500,
    timeHoursMin: 3,
    timeHoursMax: 5,
    description: "Dramatic peak with challenging climb. Often combined with or as alternative to Cradle Mountain.",
    difficulty: "Very Hard",
    waypointId: "barn-bluff",
    elevationProfile: [
      { distance: 0, elevation: 1150 },
      { distance: 1.5, elevation: 1300 },
      { distance: 3, elevation: 1559 },
      { distance: 4.5, elevation: 1350 },
      { distance: 6, elevation: 1150 }
    ]
  },
  {
    id: "mt-ossa",
    dayId: 4,
    name: "Mt Ossa Summit",
    distanceKm: 10.0,
    ascentM: 750,
    descentM: 750,
    timeHoursMin: 4,
    timeHoursMax: 6,
    description: "Tasmania's highest peak at 1617m. Stunning views on clear days. Exposed alpine terrain.",
    difficulty: "Hard",
    waypointId: "mt-ossa",
    elevationProfile: [
      { distance: 0, elevation: 1100 },
      { distance: 2, elevation: 1250 },
      { distance: 4, elevation: 1450 },
      { distance: 5, elevation: 1617 },
      { distance: 6, elevation: 1500 },
      { distance: 8, elevation: 1300 },
      { distance: 10, elevation: 1100 }
    ]
  },
  {
    id: "pelion-east",
    dayId: 4,
    name: "Pelion East",
    distanceKm: 4.0,
    ascentM: 350,
    descentM: 350,
    timeHoursMin: 2,
    timeHoursMax: 3,
    description: "Shorter alternative to Mt Ossa with excellent views. Good bad-weather option.",
    difficulty: "Moderate",
    waypointId: "pelion-east",
    elevationProfile: [
      { distance: 0, elevation: 1100 },
      { distance: 1, elevation: 1200 },
      { distance: 2, elevation: 1380 },
      { distance: 3, elevation: 1250 },
      { distance: 4, elevation: 1100 }
    ]
  },
  {
    id: "mt-oakleigh",
    dayId: 4,
    name: "Mt Oakleigh",
    distanceKm: 4.5,
    ascentM: 380,
    descentM: 380,
    timeHoursMin: 2,
    timeHoursMax: 3.5,
    description: "Peak accessible from Pelion area with panoramic views.",
    difficulty: "Moderate",
    waypointId: "mt-oakleigh",
    elevationProfile: [
      { distance: 0, elevation: 1100 },
      { distance: 1.5, elevation: 1280 },
      { distance: 2.25, elevation: 1410 },
      { distance: 3, elevation: 1300 },
      { distance: 4.5, elevation: 1100 }
    ]
  },
  {
    id: "fergusson-falls",
    dayId: 5,
    name: "Fergusson Falls",
    distanceKm: 2.0,
    ascentM: 50,
    descentM: 50,
    timeHoursMin: 0.75,
    timeHoursMax: 1.5,
    description: "Beautiful waterfall detour, often combined with D'Alton Falls.",
    difficulty: "Easy",
    waypointId: "fergusson-falls",
    elevationProfile: [
      { distance: 0, elevation: 900 },
      { distance: 1, elevation: 850 },
      { distance: 2, elevation: 900 }
    ]
  },
  {
    id: "dalton-falls",
    dayId: 5,
    name: "D'Alton Falls",
    distanceKm: 2.5,
    ascentM: 80,
    descentM: 80,
    timeHoursMin: 1,
    timeHoursMax: 1.5,
    description: "Impressive waterfall, can be combined with Fergusson Falls loop.",
    difficulty: "Easy",
    waypointId: "dalton-falls",
    elevationProfile: [
      { distance: 0, elevation: 900 },
      { distance: 0.8, elevation: 850 },
      { distance: 1.25, elevation: 820 },
      { distance: 1.7, elevation: 860 },
      { distance: 2.5, elevation: 900 }
    ]
  },
  {
    id: "hartnett-falls",
    dayId: 5,
    name: "Hartnett Falls",
    distanceKm: 3.0,
    ascentM: 100,
    descentM: 100,
    timeHoursMin: 1,
    timeHoursMax: 2,
    description: "Scenic waterfall requiring a slightly longer detour.",
    difficulty: "Easy",
    waypointId: "hartnett-falls",
    elevationProfile: [
      { distance: 0, elevation: 880 },
      { distance: 1, elevation: 820 },
      { distance: 1.5, elevation: 780 },
      { distance: 2, elevation: 830 },
      { distance: 3, elevation: 880 }
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

// GeoJSON-style polyline for the main track (simplified for performance)
export const trackCoordinates: [number, number][] = [
  [145.94912, -41.63596], // Ronny Creek
  [145.94647, -41.66], 
  [145.945, -41.68],
  [145.94647, -41.71442], // Waterfall Valley
  [145.95, -41.74],
  [145.95645, -41.77153], // Windermere
  [145.98, -41.79],
  [146.01, -41.81],
  [146.0463161, -41.8294281], // New Pelion
  [146.06, -41.85],
  [146.0819023, -41.8915626], // Kia Ora
  [146.085, -41.91],
  [146.0893035, -41.9320372], // Bert Nichols
  [146.095, -41.96],
  [146.1017329, -42.0123791], // Narcissus
  [146.12, -42.04],
  [146.14, -42.07],
  [146.16, -42.10],
  [146.1742892, -42.1163706], // Cynthia Bay
]
