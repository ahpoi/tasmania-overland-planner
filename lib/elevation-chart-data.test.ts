import { describe, expect, it } from "vitest"

import { buildElevationChartData } from "@/lib/elevation-chart-data"
import { elevationProfiles } from "@/lib/overland-data"

describe("buildElevationChartData", () => {
  it("returns the unchanged base profile when no side trips are selected", () => {
    const chartData = buildElevationChartData(1, [])

    expect(chartData.profile).toEqual(elevationProfiles[1])
    expect(chartData.maxDistance).toBe(10.7)
  })

  it("stitches Barn Bluff into the Day 1 profile and extends chart distance", () => {
    const chartData = buildElevationChartData(1, ["barn-bluff"])

    expect(chartData.maxDistance).toBeCloseTo(17.7, 5)
    expect(chartData.maxElevation).toBeGreaterThanOrEqual(1559)
    expect(chartData.profile.at(-1)?.distance).toBeCloseTo(17.7, 5)
  })

  it("stitches multiple selected side trips in route order", () => {
    const chartData = buildElevationChartData(1, ["barn-bluff", "cradle-summit"])
    const summitPoint = chartData.profile.find((point) => point.elevation === 1545)
    const bluffPoint = chartData.profile.find((point) => point.elevation === 1559)

    expect(summitPoint?.distance).toBeLessThan(bluffPoint?.distance ?? Number.POSITIVE_INFINITY)
    expect(chartData.maxDistance).toBeCloseTo(19.7, 5)
  })
})
