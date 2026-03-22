import { describe, expect, it } from "vitest"

import { getDayTrackPath, getFullTrackPath } from "@/lib/main-track-map-data"

describe("main track map data", () => {
  it("returns trail-shaped geometry for the full walk and each day", () => {
    const fullTrack = getFullTrackPath("walk")
    const ferryTrack = getFullTrackPath("ferry")
    const dayOneTrack = getDayTrackPath(1)
    const daySevenTrack = getDayTrackPath(7)
    const dayOneMinLng = Math.min(...dayOneTrack!.map(([, lng]) => lng))

    expect(fullTrack.length).toBeGreaterThan(1000)
    expect(ferryTrack.length).toBeLessThan(fullTrack.length)
    expect(fullTrack[0]).toEqual([-41.63596, 145.94912])
    expect(fullTrack[fullTrack.length - 1]).toEqual([-42.11645, 146.1745])

    expect(dayOneTrack).not.toBeNull()
    expect(dayOneTrack!.length).toBeGreaterThan(100)
    expect(dayOneTrack![0]).toEqual([-41.63596, 145.94912])
    expect(dayOneTrack![dayOneTrack!.length - 1]).toEqual([-41.71472, 145.94666])
    expect(dayOneMinLng).toBeGreaterThan(145.9435)

    expect(daySevenTrack).not.toBeNull()
    expect(daySevenTrack!.length).toBeGreaterThan(200)
    expect(daySevenTrack![0]).toEqual([-42.01244, 146.1017])
    expect(daySevenTrack![daySevenTrack!.length - 1]).toEqual([-42.11637, 146.17435])
  })

  it("returns null for days outside the mapped route", () => {
    expect(getDayTrackPath(99)).toBeNull()
  })
})
