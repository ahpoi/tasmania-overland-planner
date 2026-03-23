"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { days, sideTrips, type DaySegment, type SideTrip } from "@/lib/overland-data"

export const TRIP_STORAGE_KEY = "trip-preferences"

export interface TripStateValues {
  exitMethod: "ferry" | "walk"
  selectedDay: number
  selectedSideTrips: string[]
}

interface DayTotals {
  distance: number
  ascent: number
  descent: number
  timeMin: number
  timeMax: number
}

interface TripTotals extends DayTotals {
  days: number
}

interface TripStoreState extends TripStateValues {
  setExitMethod: (method: "ferry" | "walk") => void
  setSelectedDay: (day: number) => void
  toggleSideTrip: (id: string) => void
  getDayTotals: (dayId: number) => DayTotals
  getTripTotals: () => TripTotals
  getActiveDays: () => DaySegment[]
  getDaySideTrips: (dayId: number) => SideTrip[]
  getDayPosition: (dayId: number) => number
}

export const defaultTripState: TripStateValues = {
  exitMethod: "ferry",
  selectedDay: 1,
  selectedSideTrips: [],
}

function getActiveDaysForExitMethod(exitMethod: "ferry" | "walk") {
  return exitMethod === "ferry" ? days.filter((day) => day.id <= 6) : days
}

export const useTripStore = create<TripStoreState>()(
  persist(
    (set, get) => ({
      ...defaultTripState,
      setExitMethod: (method) => {
        set((state) => {
          if (method === "ferry" && state.selectedDay === 7) {
            return {
              exitMethod: method,
              selectedDay: 6,
              selectedSideTrips: [],
            }
          }

          return {
            exitMethod: method,
          }
        })
      },
      setSelectedDay: (day) => {
        set(() => ({
          selectedDay: day,
          selectedSideTrips: [],
        }))
      },
      toggleSideTrip: (id) => {
        set((state) => ({
          selectedSideTrips: state.selectedSideTrips.includes(id)
            ? state.selectedSideTrips.filter((tripId) => tripId !== id)
            : [...state.selectedSideTrips, id],
        }))
      },
      getActiveDays: () => getActiveDaysForExitMethod(get().exitMethod),
      getDaySideTrips: (dayId) => sideTrips.filter((sideTrip) => sideTrip.dayId === dayId),
      getDayPosition: (dayId) => {
        const dayIndex = get()
          .getActiveDays()
          .findIndex((day) => day.id === dayId)

        return dayIndex >= 0 ? dayIndex + 1 : 0
      },
      getDayTotals: (dayId) => {
        const day = days.find((entry) => entry.id === dayId)

        if (!day) {
          return { distance: 0, ascent: 0, descent: 0, timeMin: 0, timeMax: 0 }
        }

        const activeSideTrips = sideTrips.filter(
          (sideTrip) =>
            sideTrip.dayId === dayId && get().selectedSideTrips.includes(sideTrip.id)
        )

        return {
          distance: day.baseDistanceKm + activeSideTrips.reduce((sum, trip) => sum + trip.distanceKm, 0),
          ascent: day.baseAscentM + activeSideTrips.reduce((sum, trip) => sum + trip.ascentM, 0),
          descent: day.baseDescentM + activeSideTrips.reduce((sum, trip) => sum + trip.descentM, 0),
          timeMin: day.baseTimeHoursMin + activeSideTrips.reduce((sum, trip) => sum + trip.timeHoursMin, 0),
          timeMax: day.baseTimeHoursMax + activeSideTrips.reduce((sum, trip) => sum + trip.timeHoursMax, 0),
        }
      },
      getTripTotals: () => {
        const activeDays = get().getActiveDays()

        return activeDays.reduce<TripTotals>(
          (totals, day) => {
            const dayTotals = get().getDayTotals(day.id)

            return {
              distance: totals.distance + dayTotals.distance,
              ascent: totals.ascent + dayTotals.ascent,
              descent: totals.descent + dayTotals.descent,
              timeMin: totals.timeMin + dayTotals.timeMin,
              timeMax: totals.timeMax + dayTotals.timeMax,
              days: activeDays.length,
            }
          },
          {
            distance: 0,
            ascent: 0,
            descent: 0,
            timeMin: 0,
            timeMax: 0,
            days: activeDays.length,
          }
        )
      },
    }),
    {
      name: TRIP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        exitMethod: state.exitMethod,
      }),
    }
  )
)
