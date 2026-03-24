import { describe, expect, it } from "vitest"

import { getSelectedTrackPaths, getDayTrackPath } from "@/lib/main-track-map-data"
import { buildSideTripPath } from "@/lib/side-trip-map-data"
import { getMapFocusPaths, getSelectedTripPaths, getTrackMapStatusText } from "@/components/track-map"

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

describe("getMapFocusPaths", () => {
  it("focuses the chosen segment and its selected side trips", () => {
    expect(
      getMapFocusPaths({
        selectedTripPaths: getSelectedTrackPaths([1, 4], "walk"),
        focusedSegmentId: 4,
        focusedSegmentPath: getDayTrackPath(4),
        selectedSideTripIds: ["cradle-summit", "mt-ossa", "pelion-east"],
      })
    ).toEqual([
      getDayTrackPath(4),
      buildSideTripPath("mt-ossa"),
      buildSideTripPath("pelion-east"),
    ])
  })

  it("falls back to the full selected trip when no focused segment exists", () => {
    const selectedTripPaths = getSelectedTripPaths(getSelectedTrackPaths([2, 3], "walk"), ["mt-oakleigh"])

    expect(
      getMapFocusPaths({
        selectedTripPaths,
        focusedSegmentId: null,
        focusedSegmentPath: null,
        selectedSideTripIds: ["mt-oakleigh"],
      })
    ).toEqual(selectedTripPaths)
  })

  it("falls back to the full selected trip when the focused path is unavailable", () => {
    const selectedTripPaths = getSelectedTripPaths(getSelectedTrackPaths([2, 3], "walk"), [])

    expect(
      getMapFocusPaths({
        selectedTripPaths,
        focusedSegmentId: 99,
        focusedSegmentPath: null,
        selectedSideTripIds: [],
      })
    ).toEqual(selectedTripPaths)
  })
})

describe("getTrackMapStatusText", () => {
  it("describes the focused segment and selected side trip count", () => {
    expect(getTrackMapStatusText(4, 2)).toBe("Segment 4 focused | 2 side trips shown")
  })

  it("falls back to the selected trip summary when no segment is focused", () => {
    expect(getTrackMapStatusText(null, 1)).toBe("Selected trip shown | 1 side trip shown")
  })
})
