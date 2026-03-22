import { describe, expect, it } from "vitest"

import { sideTrips, waypoints } from "@/lib/overland-data"

describe("overland side trip data", () => {
  it("matches the corrected official side-trip distances, timings, and waypoint locations", () => {
    expect(sideTrips).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "cradle-summit",
          dayId: 1,
          distanceKm: 2,
          timeHoursMin: 2,
          timeHoursMax: 3,
        }),
        expect.objectContaining({
          id: "barn-bluff",
          dayId: 1,
          distanceKm: 7,
          timeHoursMin: 3,
          timeHoursMax: 4,
        }),
        expect.objectContaining({
          id: "mt-oakleigh",
          dayId: 3,
          distanceKm: 8,
          timeHoursMin: 4,
          timeHoursMax: 6,
        }),
        expect.objectContaining({
          id: "mt-ossa",
          dayId: 4,
          distanceKm: 5.2,
          timeHoursMin: 4,
          timeHoursMax: 5,
        }),
        expect.objectContaining({
          id: "pelion-east",
          dayId: 4,
          distanceKm: 2.4,
          timeHoursMin: 2,
          timeHoursMax: 2,
        }),
        expect.objectContaining({
          id: "fergusson-falls",
          dayId: 5,
          distanceKm: 1,
          timeHoursMin: 1,
          timeHoursMax: 1,
        }),
        expect.objectContaining({
          id: "dalton-falls",
          dayId: 5,
          distanceKm: 1,
          timeHoursMin: 1,
          timeHoursMax: 1,
        }),
        expect.objectContaining({
          id: "hartnett-falls",
          dayId: 5,
          distanceKm: 1.5,
          timeHoursMin: 1,
          timeHoursMax: 1,
        }),
      ])
    )

    expect(waypoints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "cradle-mountain",
          lat: -41.6846445,
          lng: 145.9513044,
        }),
        expect.objectContaining({
          id: "barn-bluff",
          lat: -41.72404,
          lng: 145.92303,
        }),
        expect.objectContaining({
          id: "mt-oakleigh",
          lat: -41.805,
          lng: 146.03611,
        }),
        expect.objectContaining({
          id: "mt-ossa",
          lat: -41.87072,
          lng: 146.03297,
        }),
        expect.objectContaining({
          id: "fergusson-falls",
          lat: -41.9084768,
          lng: 146.1221974,
        }),
        expect.objectContaining({
          id: "dalton-falls",
          lat: -41.908132,
          lng: 146.1201569,
        }),
        expect.objectContaining({
          id: "hartnett-falls",
          lat: -41.9134075,
          lng: 146.1282551,
        }),
      ])
    )
  })
})
