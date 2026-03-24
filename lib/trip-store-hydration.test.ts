import { beforeEach, describe, expect, it, vi } from "vitest"

import { TRIP_STORAGE_KEY } from "@/lib/trip-store"

describe("trip store hydration", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it("does not apply persisted trip selections until rehydrate is called", async () => {
    localStorage.setItem(
      TRIP_STORAGE_KEY,
      JSON.stringify({
        state: {
          exitMethod: "walk",
          selectedSegmentIds: [1, 2, 3, 4, 5, 6, 7],
          focusedSegmentId: 4,
          selectedSideTrips: ["mt-ossa"],
          segmentNotes: {
            4: "Aim for early start",
          },
          overallNote: "Pack extra layers",
        },
        version: 0,
      })
    )

    const { defaultTripState, useTripStore } = await import("@/lib/trip-store")

    expect(useTripStore.persist.hasHydrated()).toBe(false)
    expect(useTripStore.getState()).toMatchObject(defaultTripState)

    await useTripStore.persist.rehydrate()

    expect(useTripStore.persist.hasHydrated()).toBe(true)
    expect(useTripStore.getState()).toMatchObject({
      exitMethod: "walk",
      selectedSegmentIds: [1, 2, 3, 4, 5, 6, 7],
      focusedSegmentId: 4,
      selectedSideTrips: ["mt-ossa"],
      segmentNotes: {
        4: "Aim for early start",
      },
      overallNote: "Pack extra layers",
    })
  })
})
