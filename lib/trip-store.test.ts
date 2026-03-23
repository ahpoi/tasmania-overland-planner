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

  it("starts with the default trip state", () => {
    expect(useTripStore.getState()).toMatchObject(defaultTripState)
  })

  it("clears selected side trips when changing the selected day", () => {
    useTripStore.getState().toggleSideTrip("cradle-summit")

    expect(useTripStore.getState().selectedSideTrips).toEqual(["cradle-summit"])

    useTripStore.getState().setSelectedDay(2)

    expect(useTripStore.getState().selectedDay).toBe(2)
    expect(useTripStore.getState().selectedSideTrips).toEqual([])
  })

  it("returns to day 6 and clears side trips when switching back to ferry from day 7", () => {
    useTripStore.getState().setExitMethod("walk")
    useTripStore.getState().setSelectedDay(7)
    useTripStore.getState().toggleSideTrip("hartnett-falls")

    useTripStore.getState().setExitMethod("ferry")

    expect(useTripStore.getState().exitMethod).toBe("ferry")
    expect(useTripStore.getState().selectedDay).toBe(6)
    expect(useTripStore.getState().selectedSideTrips).toEqual([])
  })

  it("persists only the exit method under the expected storage key", async () => {
    useTripStore.getState().setExitMethod("walk")
    useTripStore.getState().setSelectedDay(4)
    useTripStore.getState().toggleSideTrip("mt-ossa")

    await useTripStore.persist.rehydrate()

    const storedValue = localStorage.getItem(TRIP_STORAGE_KEY)

    expect(storedValue).toContain("\"exitMethod\":\"walk\"")
    expect(storedValue).not.toContain("selectedDay")
    expect(storedValue).not.toContain("selectedSideTrips")
  })
})
