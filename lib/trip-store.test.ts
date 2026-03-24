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
    expect(useTripStore.getState().focusedSegmentId).toBe(1)
    expect(useTripStore.getState().segmentNotes).toEqual({})
    expect(useTripStore.getState().overallNote).toBe("")
  })

  it("toggles main track segments independently", () => {
    useTripStore.getState().toggleSegment(3)

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 4, 5, 6])
    expect(useTripStore.getState().focusedSegmentId).toBe(1)

    useTripStore.getState().toggleSegment(3)

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
    expect(useTripStore.getState().focusedSegmentId).toBe(3)
  })

  it("lets people deselect every segment manually", () => {
    ;[1, 2, 3, 4, 5, 6].forEach((segmentId) => {
      useTripStore.getState().toggleSegment(segmentId)
    })

    expect(useTripStore.getState().selectedSegmentIds).toEqual([])
    expect(useTripStore.getState().selectedSideTrips).toEqual([])
    expect(useTripStore.getState().focusedSegmentId).toBeNull()
  })

  it("drops segment 7 when switching to ferry mode", () => {
    useTripStore.getState().setExitMethod("walk")
    useTripStore.getState().toggleSegment(7)
    useTripStore.getState().setFocusedSegment(7)

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(useTripStore.getState().focusedSegmentId).toBe(7)

    useTripStore.getState().setExitMethod("ferry")

    expect(useTripStore.getState().exitMethod).toBe("ferry")
    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
    expect(useTripStore.getState().focusedSegmentId).toBe(1)
  })

  it("tracks focused segments independently from trip selections", () => {
    useTripStore.getState().setFocusedSegment(4)

    expect(useTripStore.getState().focusedSegmentId).toBe(4)
    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
  })

  it("toggles the active segment elevation panel independently from map focus", () => {
    useTripStore.getState().toggleElevationSegment(4)

    expect(useTripStore.getState().elevationSegmentId).toBe(4)
    expect(useTripStore.getState().focusedSegmentId).toBe(1)

    useTripStore.getState().toggleElevationSegment(4)

    expect(useTripStore.getState().elevationSegmentId).toBeNull()
  })

  it("switches the active segment elevation panel when a different segment is chosen", () => {
    useTripStore.getState().toggleElevationSegment(2)
    useTripStore.getState().toggleElevationSegment(5)

    expect(useTripStore.getState().elevationSegmentId).toBe(5)
  })

  it("clears the segment elevation panel when its segment is deselected", () => {
    useTripStore.getState().toggleElevationSegment(3)

    expect(useTripStore.getState().elevationSegmentId).toBe(3)

    useTripStore.getState().toggleSegment(3)

    expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 4, 5, 6])
    expect(useTripStore.getState().elevationSegmentId).toBeNull()
  })

  it("calculates trip totals from all selected segments and side trips", () => {
    ;[2, 3, 5, 6].forEach((segmentId) => {
      useTripStore.getState().toggleSegment(segmentId)
    })
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
    useTripStore.getState().toggleSegment(7)
    useTripStore.getState().toggleSideTrip("mt-ossa")
    useTripStore.getState().setFocusedSegment(4)
    useTripStore.getState().toggleElevationSegment(5)
    useTripStore.getState().setSegmentNote(4, "Check hut availability")
    useTripStore.getState().setOverallNote("Call parks before departure")

    await useTripStore.persist.rehydrate()

    const storedValue = localStorage.getItem(TRIP_STORAGE_KEY)

    expect(storedValue).toContain("\"exitMethod\":\"walk\"")
    expect(storedValue).toContain("\"selectedSegmentIds\":[1,2,3,4,5,6,7]")
    expect(storedValue).toContain("\"selectedSideTrips\":[\"mt-ossa\"]")
    expect(storedValue).toContain("\"focusedSegmentId\":4")
    expect(storedValue).toContain("\"elevationSegmentId\":5")
    expect(storedValue).toContain("\"segmentNotes\":{\"4\":\"Check hut availability\"}")
    expect(storedValue).toContain("\"overallNote\":\"Call parks before departure\"")
  })

  it("stores and replaces notes for main day segments only", () => {
    useTripStore.getState().setSegmentNote(3, "Take extra water")
    useTripStore.getState().setSegmentNote(3, "Refill at creek crossing")
    useTripStore.getState().setSegmentNote(99, "Ignore invalid segment")

    expect(useTripStore.getState().segmentNotes).toEqual({
      3: "Refill at creek crossing",
    })
  })

  it("stores and replaces the overall trip note", () => {
    useTripStore.getState().setOverallNote("Book transport")
    expect(useTripStore.getState().overallNote).toBe("Book transport")

    useTripStore.getState().setOverallNote("Book transport and ferry timing")
    expect(useTripStore.getState().overallNote).toBe("Book transport and ferry timing")
  })
})
