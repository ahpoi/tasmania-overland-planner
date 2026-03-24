import { beforeEach, describe, expect, it } from "vitest"

import {
  TRIP_STORAGE_KEY,
  defaultTripState,
  useTripStore,
} from "@/lib/trip-store"

describe("trip store", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
  })

  it("starts with the default trip selections for a new planner", () => {
    expect(useTripStore.getState()).toMatchObject(defaultTripState)
    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
    expect(useTripStore.getState().selectedSideTrips).toEqual([])
  })

  it("toggles main track segments independently", () => {
    useTripStore.getState().toggleSegment(3)

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 4, 5, 6])

    useTripStore.getState().toggleSegment(3)

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
  })

  it("selects all segments available for the current exit method", () => {
    useTripStore.getState().clearSelections()

    expect(useTripStore.getState().selectedSegmentIds).toEqual([])
    expect(useTripStore.getState().selectedSideTrips).toEqual([])

    useTripStore.getState().selectAllSegments()

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
  })

  it("drops segment 7 when switching to ferry mode", () => {
    useTripStore.getState().setExitMethod("walk")
    useTripStore.getState().selectAllSegments()

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6, 7])

    useTripStore.getState().setExitMethod("ferry")

    expect(useTripStore.getState().exitMethod).toBe("ferry")
    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
  })

  it("calculates trip totals from all selected segments and side trips", () => {
    useTripStore.getState().clearSelections()
    useTripStore.getState().toggleSegment(1)
    useTripStore.getState().toggleSegment(4)
    useTripStore.getState().toggleSideTrip("cradle-summit")
    useTripStore.getState().toggleSideTrip("mt-ossa")

    expect(useTripStore.getState().getTripTotals()).toMatchObject({
      ascent: 1932,
      descent: 1482,
      timeMin: 13,
      timeMax: 18,
      days: 2,
    })
    expect(useTripStore.getState().getTripTotals().distance).toBeCloseTo(26.5, 5)
  })

  it("persists exit method, selected segments, and side trips under the expected storage key", async () => {
    useTripStore.getState().setExitMethod("walk")
    useTripStore.getState().selectAllSegments()
    useTripStore.getState().toggleSideTrip("mt-ossa")

    await useTripStore.persist.rehydrate()

    const storedValue = localStorage.getItem(TRIP_STORAGE_KEY)

    expect(storedValue).toContain("\"exitMethod\":\"walk\"")
    expect(storedValue).toContain("\"selectedSegmentIds\":[1,2,3,4,5,6,7]")
    expect(storedValue).toContain("\"selectedSideTrips\":[\"mt-ossa\"]")
  })
})
