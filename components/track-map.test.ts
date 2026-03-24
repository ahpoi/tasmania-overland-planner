import { describe, expect, it } from "vitest"

import { getSelectedTrackPaths, getDayTrackPath } from "@/lib/main-track-map-data"
import { buildSideTripPath } from "@/lib/side-trip-map-data"
import { getSelectedTripPaths } from "@/components/track-map"

describe("getSelectedTripPaths", () => {
  it("returns selected main-track paths when no side trips are selected", () => {
    const selectedTrackPaths = getSelectedTrackPaths([2, 3], "walk")

    expect(getSelectedTripPaths(selectedTrackPaths, [])).toEqual(selectedTrackPaths)
  })

  it("appends selected side trip paths to the selected main-track paths", () => {
    const selectedTrackPaths = [getDayTrackPath(4)!]

    expect(getSelectedTripPaths(selectedTrackPaths, ["mt-ossa", "pelion-east"])).toEqual([
      ...selectedTrackPaths,
      buildSideTripPath("mt-ossa"),
      buildSideTripPath("pelion-east"),
    ])
  })

  it("supports map bounds even when only side trips are selected", () => {
    expect(getSelectedTripPaths([], ["mt-ossa"])).toEqual([buildSideTripPath("mt-ossa")])
  })
})
