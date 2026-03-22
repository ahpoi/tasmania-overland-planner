import { describe, expect, it } from "vitest"

import { buildSideTripPath } from "@/lib/side-trip-map-data"

describe("buildSideTripPath", () => {
  it("returns trail-shaped geometry for mapped side trips", () => {
    const cradlePath = buildSideTripPath("cradle-summit")
    const barnBluffPath = buildSideTripPath("barn-bluff")
    const mtOssaPath = buildSideTripPath("mt-ossa")
    const mtOakleighPath = buildSideTripPath("mt-oakleigh")

    expect(cradlePath).not.toBeNull()
    expect(cradlePath!.length).toBeGreaterThan(2)
    expect(cradlePath![0]).toEqual([-41.676908, 145.947534])
    expect(cradlePath![cradlePath!.length - 1]).toEqual([-41.684644, 145.951304])

    expect(barnBluffPath).not.toBeNull()
    expect(barnBluffPath!.length).toBeGreaterThan(10)
    expect(barnBluffPath![0]).toEqual([-41.7052, 145.94527])
    expect(barnBluffPath![barnBluffPath!.length - 1]).toEqual([-41.72404, 145.92303])

    expect(mtOssaPath).not.toBeNull()
    expect(mtOssaPath!.length).toBeGreaterThan(10)
    expect(mtOssaPath![0]).toEqual([-41.86397, 146.05812])
    expect(mtOssaPath![mtOssaPath!.length - 1]).toEqual([-41.87072, 146.03297])

    expect(mtOakleighPath).not.toBeNull()
    expect(mtOakleighPath!.length).toBeGreaterThan(10)
    expect(mtOakleighPath![0]).toEqual([-41.82964, 146.04639])
    expect(mtOakleighPath![mtOakleighPath!.length - 1]).toEqual([-41.805, 146.03611])
  })

  it("returns null for unknown side trips", () => {
    expect(buildSideTripPath("unknown-side-trip")).toBeNull()
  })
})
