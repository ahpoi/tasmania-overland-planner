import { describe, expect, it } from "vitest"

import { buildElevationChartData } from "@/lib/elevation-chart-data"
import { elevationProfiles } from "@/lib/overland-data"

describe("buildElevationChartData", () => {
  it("returns the main profile and branch markers without side-trip overlays", () => {
    const chartData = buildElevationChartData(1, ["cradle-summit"])

    expect(chartData.mainProfile).toEqual(elevationProfiles[1])
    expect(chartData.branchMarkers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sideTripId: "cradle-summit",
          name: "Cradle Mountain Summit",
        }),
      ])
    )
    expect(chartData.branchMarkers[0].distance).toBeLessThan(
      elevationProfiles[1][elevationProfiles[1].length - 1].distance
    )
    expect("sideTripOverlays" in chartData).toBe(false)
  })
})
