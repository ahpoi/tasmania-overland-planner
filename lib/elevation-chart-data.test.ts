import { describe, expect, it } from "vitest"

import {
  buildElevationChartData,
  buildSegmentElevationChartData,
  buildTripElevationChartData,
} from "@/lib/elevation-chart-data"
import { elevationProfiles } from "@/lib/overland-data"

describe("buildElevationChartData", () => {
  it("returns the unchanged base profile when no side trips are selected", () => {
    const chartData = buildElevationChartData(1, [])

    expect(chartData.profile).toEqual(elevationProfiles[1])
    expect(chartData.maxDistance).toBe(10.7)
  })

  it("keeps the legacy builder aligned with the segment-scoped builder", () => {
    expect(buildElevationChartData(1, ["barn-bluff"])).toEqual(
      buildSegmentElevationChartData(1, ["barn-bluff"])
    )
  })
})

describe("buildSegmentElevationChartData", () => {
  it("stitches Barn Bluff into the Day 1 profile and extends chart distance", () => {
    const chartData = buildSegmentElevationChartData(1, ["barn-bluff", "mt-ossa"])

    expect(chartData.maxDistance).toBeCloseTo(17.7, 5)
    expect(chartData.maxElevation).toBeGreaterThanOrEqual(1559)
    expect(chartData.profile.at(-1)?.distance).toBeCloseTo(17.7, 5)
  })

  it("stitches multiple selected side trips in route order", () => {
    const chartData = buildSegmentElevationChartData(1, ["barn-bluff", "cradle-summit"])
    const summitPoint = chartData.profile.find((point) => point.elevation === 1545)
    const bluffPoint = chartData.profile.find((point) => point.elevation === 1559)

    expect(summitPoint?.distance).toBeLessThan(bluffPoint?.distance ?? Number.POSITIVE_INFINITY)
    expect(chartData.maxDistance).toBeCloseTo(19.7, 5)
  })
})

describe("buildTripElevationChartData", () => {
  it("stitches selected main-track segments into one continuous trip profile", () => {
    const chartData = buildTripElevationChartData([1, 2], [])

    expect(chartData.profile[0]).toEqual(elevationProfiles[1][0])
    expect(chartData.profile.at(-1)).toEqual({
      distance: 18.5,
      elevation: 780,
    })
    expect(chartData.maxDistance).toBeCloseTo(18.5, 5)
    expect(chartData.markers).toEqual([
      expect.objectContaining({
        key: "segment-boundary-1",
        markerType: "segment-boundary",
        label: "Waterfall Valley Huts",
        shortLabel: "Waterfall Valley",
        distance: 10.7,
      }),
    ])
  })

  it("inserts selected side trips into the full trip profile within their owning segment", () => {
    const chartData = buildTripElevationChartData([1, 2], ["barn-bluff", "cradle-summit"])
    const summitPoint = chartData.profile.find((point) => point.elevation === 1545)
    const bluffPoint = chartData.profile.find((point) => point.elevation === 1559)

    expect(summitPoint?.distance).toBeLessThan(bluffPoint?.distance ?? Number.POSITIVE_INFINITY)
    expect(chartData.profile.at(-1)).toEqual({
      distance: 27.5,
      elevation: 780,
    })
    expect(chartData.maxDistance).toBeCloseTo(27.5, 5)
    expect(chartData.markers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "side-trip-cradle-summit",
          markerType: "side-trip",
          label: "Cradle Mountain Summit",
          shortLabel: "Cradle Mtn",
          distance: 4.2,
          endDistance: 6.2,
        }),
        expect.objectContaining({
          key: "side-trip-barn-bluff",
          markerType: "side-trip",
          label: "Barn Bluff",
          shortLabel: "Barn Bluff",
          distance: 7.1,
          endDistance: 14.1,
        }),
        expect.objectContaining({
          key: "segment-boundary-1",
          markerType: "segment-boundary",
          label: "Waterfall Valley Huts",
          shortLabel: "Waterfall Valley",
          distance: 19.7,
        }),
      ])
    )
  })
})
