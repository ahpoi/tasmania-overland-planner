import { describe, expect, it } from "vitest"

import { getDayTrackPath } from "@/lib/main-track-map-data"
import { buildSideTripPath } from "@/lib/side-trip-map-data"
import { getFocusedItineraryPaths } from "@/components/track-map"

describe("getFocusedItineraryPaths", () => {
  it("returns the selected day path when no side trips are selected", () => {
    expect(getFocusedItineraryPaths(getDayTrackPath(2), [])).toEqual([getDayTrackPath(2)])
  })

  it("appends selected side trip paths to the selected day path", () => {
    const paths = getFocusedItineraryPaths(getDayTrackPath(4), ["mt-ossa", "pelion-east"])

    expect(paths).toEqual([
      getDayTrackPath(4),
      buildSideTripPath("mt-ossa"),
      buildSideTripPath("pelion-east"),
    ])
  })
})
