"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { days, sideTrips, type DaySegment, type SideTrip } from "@/lib/overland-data"

export const TRIP_STORAGE_KEY = "trip-preferences"

type ExitMethod = "ferry" | "walk"

export interface TripStateValues {
  exitMethod: ExitMethod
  selectedSegmentIds: number[]
  focusedSegmentId: number | null
  elevationSegmentId: number | null
  selectedDay: number
  selectedSideTrips: string[]
  segmentNotes: Record<number, string>
  overallNote: string
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
  setFocusedSegment: (segmentId: number | null) => void
  toggleElevationSegment: (segmentId: number) => void
  isSegmentSelected: (segmentId: number) => boolean
  areAllSegmentsSelected: () => boolean
  getSelectedSegments: () => DaySegment[]
  setSelectedDay: (day: number) => void
  toggleSideTrip: (id: string) => void
  setSegmentNote: (segmentId: number, note: string) => void
  setOverallNote: (note: string) => void
  getDayTotals: (dayId: number) => DayTotals
  getTripTotals: () => TripTotals
  getActiveDays: () => DaySegment[]
  getDaySideTrips: (dayId: number) => SideTrip[]
  getDayPosition: (dayId: number) => number
}

export const defaultTripState: TripStateValues = {
  exitMethod: "ferry",
  selectedSegmentIds: [1, 2, 3, 4, 5, 6],
  focusedSegmentId: 1,
  elevationSegmentId: null,
  selectedDay: 1,
  selectedSideTrips: [],
  segmentNotes: {},
  overallNote: "",
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

function isValidSegmentId(segmentId: number) {
  return days.some((day) => day.id === segmentId)
}

function normalizeFocusedSegmentId(
  focusedSegmentId: number | null,
  exitMethod: ExitMethod,
  selectedSegmentIds: number[]
) {
  if (focusedSegmentId === null) {
    return selectedSegmentIds[0] ?? null
  }

  const allowedIds = new Set(getSelectableSegmentIds(exitMethod))

  if (allowedIds.has(focusedSegmentId)) {
    return focusedSegmentId
  }

  return selectedSegmentIds[0] ?? null
}

function normalizeElevationSegmentId(
  elevationSegmentId: number | null,
  exitMethod: ExitMethod,
  selectedSegmentIds: number[]
) {
  if (elevationSegmentId === null) {
    return null
  }

  const allowedIds = new Set(getSelectableSegmentIds(exitMethod))

  if (allowedIds.has(elevationSegmentId) && selectedSegmentIds.includes(elevationSegmentId)) {
    return elevationSegmentId
  }

  return null
}

export const useTripStore = create<TripStoreState>()(
  persist(
    (set, get) => ({
      ...defaultTripState,
      setExitMethod: (method) => {
        set((state) => {
          const normalizedSelectedSegmentIds = normalizeSelectedSegmentIds(
            state.selectedSegmentIds,
            method
          )
          const normalizedFocusedSegmentId = normalizeFocusedSegmentId(
            state.focusedSegmentId,
            method,
            normalizedSelectedSegmentIds
          )

          return {
            exitMethod: method,
            selectedSegmentIds: normalizedSelectedSegmentIds,
            focusedSegmentId: normalizedFocusedSegmentId,
            elevationSegmentId: normalizeElevationSegmentId(
              state.elevationSegmentId,
              method,
              normalizedSelectedSegmentIds
            ),
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
            focusedSegmentId: isCurrentlySelected
              ? normalizeFocusedSegmentId(
                  state.focusedSegmentId === segmentId ? null : state.focusedSegmentId,
                  state.exitMethod,
                  normalizedSelectedSegmentIds
                )
              : segmentId,
            elevationSegmentId: isCurrentlySelected
              ? normalizeElevationSegmentId(
                  state.elevationSegmentId === segmentId ? null : state.elevationSegmentId,
                  state.exitMethod,
                  normalizedSelectedSegmentIds
                )
              : state.elevationSegmentId,
            selectedDay: isCurrentlySelected
              ? normalizedSelectedSegmentIds[0] ?? state.selectedDay
              : segmentId,
          }
        })
      },
      setFocusedSegment: (segmentId) => {
        set((state) => ({
          focusedSegmentId: normalizeFocusedSegmentId(
            segmentId,
            state.exitMethod,
            state.selectedSegmentIds
          ),
          selectedDay: segmentId ?? state.selectedDay,
        }))
      },
      toggleElevationSegment: (segmentId) => {
        set((state) => {
          const allowedIds = getSelectableSegmentIds(state.exitMethod)

          if (!allowedIds.includes(segmentId)) {
            return state
          }

          return {
            elevationSegmentId: state.elevationSegmentId === segmentId ? null : segmentId,
          }
        })
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
      setSegmentNote: (segmentId, note) => {
        if (!isValidSegmentId(segmentId)) {
          return
        }

        set((state) => ({
          segmentNotes: {
            ...state.segmentNotes,
            [segmentId]: note,
          },
        }))
      },
      setOverallNote: (note) => {
        set(() => ({
          overallNote: note,
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
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        exitMethod: state.exitMethod,
        selectedSegmentIds: state.selectedSegmentIds,
        focusedSegmentId: state.focusedSegmentId,
        elevationSegmentId: state.elevationSegmentId,
        selectedSideTrips: state.selectedSideTrips,
        segmentNotes: state.segmentNotes,
        overallNote: state.overallNote,
      }),
    }
  )
)
