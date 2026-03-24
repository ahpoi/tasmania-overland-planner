import { describe, expect, it } from "vitest"

import {
  getDayTrackPath,
  getFullTrackPath,
  getSelectedTrackPaths,
} from "@/lib/main-track-map-data"

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

  it("groups contiguous selected segments into a single rendered path", () => {
    const selectedPaths = getSelectedTrackPaths([1, 2, 3], "walk")

    expect(selectedPaths).toHaveLength(1)
    expect(selectedPaths[0][0]).toEqual([-41.63596, 145.94912])
    expect(selectedPaths[0][selectedPaths[0].length - 1][0]).toBeCloseTo(-41.83, 2)
    expect(selectedPaths[0][selectedPaths[0].length - 1][1]).toBeCloseTo(146.046, 3)
  })

  it("keeps disjoint selected segments as separate rendered paths", () => {
    const selectedPaths = getSelectedTrackPaths([1, 3, 6], "walk")

    expect(selectedPaths).toHaveLength(3)
    expect(selectedPaths[0]).toEqual(getDayTrackPath(1))
    expect(selectedPaths[1]).toEqual(getDayTrackPath(3))
    expect(selectedPaths[2]).toEqual(getDayTrackPath(6))
  })

  it("omits segment 7 when the selected trip uses ferry exit", () => {
    const selectedPaths = getSelectedTrackPaths([6, 7], "ferry")

    expect(selectedPaths).toHaveLength(1)
    expect(selectedPaths[0]).toEqual(getDayTrackPath(6))
  })

  it("returns an empty list for selections outside the mapped route", () => {
    expect(getSelectedTrackPaths([99], "walk")).toEqual([])
    expect(getDayTrackPath(99)).toBeNull()
  })
})
