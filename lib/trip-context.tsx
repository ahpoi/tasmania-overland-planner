"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { days, sideTrips, type DaySegment, type SideTrip } from "./overland-data"

interface TripContextType {
  exitMethod: "ferry" | "walk"
  setExitMethod: (method: "ferry" | "walk") => void
  selectedDay: number
  setSelectedDay: (day: number) => void
  selectedSideTrips: string[]
  toggleSideTrip: (id: string) => void
  getDayTotals: (dayId: number) => {
    distance: number
    ascent: number
    descent: number
    timeMin: number
    timeMax: number
  }
  getTripTotals: () => {
    distance: number
    ascent: number
    descent: number
    timeMin: number
    timeMax: number
    days: number
  }
  getActiveDays: () => DaySegment[]
  getDaySideTrips: (dayId: number) => SideTrip[]
  getDayPosition: (dayId: number) => number
}

const TripContext = createContext<TripContextType | undefined>(undefined)

export function TripProvider({ children }: { children: ReactNode }) {
  const [exitMethod, setExitMethod] = useState<"ferry" | "walk">("ferry")
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedSideTrips, setSelectedSideTrips] = useState<string[]>([])

  const getActiveDays = () => {
    return exitMethod === "ferry" ? days.filter((d) => d.id <= 6) : days
  }

  const handleSelectedDayChange = (day: number) => {
    setSelectedDay(day)
    setSelectedSideTrips([])
  }

  const handleExitMethodChange = (method: "ferry" | "walk") => {
    setExitMethod(method)

    if (method === "ferry" && selectedDay === 7) {
      setSelectedDay(6)
      setSelectedSideTrips([])
    }
  }

  const toggleSideTrip = (id: string) => {
    setSelectedSideTrips((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const getDaySideTrips = (dayId: number) => {
    return sideTrips.filter((st) => st.dayId === dayId)
  }

  const getDayPosition = (dayId: number) => {
    const dayIndex = getActiveDays().findIndex((day) => day.id === dayId)
    return dayIndex >= 0 ? dayIndex + 1 : 0
  }

  const getDayTotals = (dayId: number) => {
    const day = days.find((d) => d.id === dayId)
    if (!day) return { distance: 0, ascent: 0, descent: 0, timeMin: 0, timeMax: 0 }

    const activeSideTrips = sideTrips.filter(
      (st) => st.dayId === dayId && selectedSideTrips.includes(st.id)
    )

    return {
      distance:
        day.baseDistanceKm +
        activeSideTrips.reduce((sum, st) => sum + st.distanceKm, 0),
      ascent:
        day.baseAscentM +
        activeSideTrips.reduce((sum, st) => sum + st.ascentM, 0),
      descent:
        day.baseDescentM +
        activeSideTrips.reduce((sum, st) => sum + st.descentM, 0),
      timeMin:
        day.baseTimeHoursMin +
        activeSideTrips.reduce((sum, st) => sum + st.timeHoursMin, 0),
      timeMax:
        day.baseTimeHoursMax +
        activeSideTrips.reduce((sum, st) => sum + st.timeHoursMax, 0),
    }
  }

  const getTripTotals = () => {
    const activeDays = getActiveDays()
    let totalDistance = 0
    let totalAscent = 0
    let totalDescent = 0
    let totalTimeMin = 0
    let totalTimeMax = 0

    activeDays.forEach((day) => {
      const dayTotals = getDayTotals(day.id)
      totalDistance += dayTotals.distance
      totalAscent += dayTotals.ascent
      totalDescent += dayTotals.descent
      totalTimeMin += dayTotals.timeMin
      totalTimeMax += dayTotals.timeMax
    })

    return {
      distance: totalDistance,
      ascent: totalAscent,
      descent: totalDescent,
      timeMin: totalTimeMin,
      timeMax: totalTimeMax,
      days: activeDays.length,
    }
  }

  return (
    <TripContext.Provider
      value={{
        exitMethod,
        setExitMethod: handleExitMethodChange,
        selectedDay,
        setSelectedDay: handleSelectedDayChange,
        selectedSideTrips,
        toggleSideTrip,
        getDayTotals,
        getTripTotals,
        getActiveDays,
        getDaySideTrips,
        getDayPosition,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider")
  }
  return context
}
