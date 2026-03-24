"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { days, sideTrips, type DaySegment, type SideTrip } from "@/lib/overland-data"

export const TRIP_STORAGE_KEY = "trip-preferences"

type ExitMethod = "ferry" | "walk"

export interface TripStateValues {
  exitMethod: ExitMethod
  selectedSegmentIds: number[]
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
  setExitMethod: (method: ExitMethod) => void
  toggleSegment: (segmentId: number) => void
  selectAllSegments: () => void
  selectEntireTrip: () => void
  clearSelections: () => void
  isSegmentSelected: (segmentId: number) => boolean
  areAllSegmentsSelected: () => boolean
  getSelectedSegments: () => DaySegment[]
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
  selectedSegmentIds: [1, 2, 3, 4, 5, 6],
  selectedDay: 1,
  selectedSideTrips: [],
}

function getActiveDaysForExitMethod(exitMethod: ExitMethod) {
  return exitMethod === "ferry" ? days.filter((day) => day.id <= 6) : days
}

function getSelectableSegmentIds(exitMethod: ExitMethod) {
  return getActiveDaysForExitMethod(exitMethod).map((day) => day.id)
}

function normalizeSelectedSegmentIds(segmentIds: number[], exitMethod: ExitMethod) {
  const allowedIds = new Set(getSelectableSegmentIds(exitMethod))

  return [...new Set(segmentIds)]
    .filter((segmentId) => allowedIds.has(segmentId))
    .sort((left, right) => left - right)
}

function getSelectableSideTripIds(exitMethod: ExitMethod) {
  const allowedSegmentIds = new Set(getSelectableSegmentIds(exitMethod))

  return sideTrips
    .filter((sideTrip) => allowedSegmentIds.has(sideTrip.dayId))
    .map((sideTrip) => sideTrip.id)
}

export const useTripStore = create<TripStoreState>()(
  persist(
    (set, get) => ({
      ...defaultTripState,
      setExitMethod: (method) => {
        set((state) => {
          return {
            exitMethod: method,
            selectedSegmentIds: normalizeSelectedSegmentIds(state.selectedSegmentIds, method),
            selectedDay: method === "ferry" && state.selectedDay === 7 ? 6 : state.selectedDay,
          }
        })
      },
      toggleSegment: (segmentId) => {
        set((state) => {
          const allowedIds = getSelectableSegmentIds(state.exitMethod)

          if (!allowedIds.includes(segmentId)) {
            return state
          }

          const isCurrentlySelected = state.selectedSegmentIds.includes(segmentId)
          const nextSelectedSegmentIds = isCurrentlySelected
            ? state.selectedSegmentIds.filter((id) => id !== segmentId)
            : [...state.selectedSegmentIds, segmentId]
          const normalizedSelectedSegmentIds = normalizeSelectedSegmentIds(
            nextSelectedSegmentIds,
            state.exitMethod
          )

          return {
            selectedSegmentIds: normalizedSelectedSegmentIds,
            selectedDay: isCurrentlySelected
              ? normalizedSelectedSegmentIds[0] ?? state.selectedDay
              : segmentId,
          }
        })
      },
      selectAllSegments: () => {
        set((state) => ({
          selectedSegmentIds: getSelectableSegmentIds(state.exitMethod),
        }))
      },
      selectEntireTrip: () => {
        set((state) => ({
          selectedSegmentIds: getSelectableSegmentIds(state.exitMethod),
          selectedSideTrips: getSelectableSideTripIds(state.exitMethod),
        }))
      },
      clearSelections: () => {
        set(() => ({
          selectedSegmentIds: [],
          selectedSideTrips: [],
        }))
      },
      isSegmentSelected: (segmentId) => get().selectedSegmentIds.includes(segmentId),
      areAllSegmentsSelected: () => {
        const allowedIds = getSelectableSegmentIds(get().exitMethod)

        return allowedIds.every((segmentId) => get().selectedSegmentIds.includes(segmentId))
      },
      getSelectedSegments: () => {
        const selectedSegmentIds = new Set(get().selectedSegmentIds)

        return days.filter((day) => selectedSegmentIds.has(day.id))
      },
      setSelectedDay: (day) => {
        set(() => ({
          selectedDay: day,
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
        const selectedSegments = get().getSelectedSegments()
        const selectedSideTrips = sideTrips.filter((sideTrip) =>
          get().selectedSideTrips.includes(sideTrip.id)
        )

        const segmentTotals = selectedSegments.reduce<TripTotals>(
          (totals, segment) => {
            const dayTotals = {
              distance: segment.baseDistanceKm,
              ascent: segment.baseAscentM,
              descent: segment.baseDescentM,
              timeMin: segment.baseTimeHoursMin,
              timeMax: segment.baseTimeHoursMax,
            }

            return {
              distance: totals.distance + dayTotals.distance,
              ascent: totals.ascent + dayTotals.ascent,
              descent: totals.descent + dayTotals.descent,
              timeMin: totals.timeMin + dayTotals.timeMin,
              timeMax: totals.timeMax + dayTotals.timeMax,
              days: selectedSegments.length,
            }
          },
          {
            distance: 0,
            ascent: 0,
            descent: 0,
            timeMin: 0,
            timeMax: 0,
            days: selectedSegments.length,
          }
        )

        return selectedSideTrips.reduce<TripTotals>(
          (totals, sideTrip) => ({
            distance: totals.distance + sideTrip.distanceKm,
            ascent: totals.ascent + sideTrip.ascentM,
            descent: totals.descent + sideTrip.descentM,
            timeMin: totals.timeMin + sideTrip.timeHoursMin,
            timeMax: totals.timeMax + sideTrip.timeHoursMax,
            days: totals.days,
          }),
          segmentTotals
        )
      },
    }),
    {
      name: TRIP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        exitMethod: state.exitMethod,
        selectedSegmentIds: state.selectedSegmentIds,
        selectedSideTrips: state.selectedSideTrips,
      }),
    }
  )
)
