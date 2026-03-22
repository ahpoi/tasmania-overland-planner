import {
  mainTrackDayPaths,
  mainTrackDaySlices,
  mainTrackFullGeometry,
  type LatLngTuple,
} from "@/lib/main-track-geometry"

type ExitMethod = "ferry" | "walk"

function getExitDay(exitMethod: ExitMethod) {
  return exitMethod === "ferry" ? 6 : 7
}

export function getDayTrackPath(dayId: number): LatLngTuple[] | null {
  const dayPath = mainTrackDayPaths[String(dayId)]

  return dayPath ? dayPath.map(([lat, lng]) => [lat, lng]) : null
}

export function getDayTrackSlice(dayId: number) {
  return mainTrackDaySlices[String(dayId)] ?? null
}

export function getFullTrackPath(exitMethod: ExitMethod = "walk"): LatLngTuple[] {
  if (exitMethod === "walk") {
    return mainTrackFullGeometry.map(([lat, lng]) => [lat, lng])
  }

  const finalDaySlice = getDayTrackSlice(getExitDay(exitMethod))
  if (!finalDaySlice) {
    return mainTrackFullGeometry.map(([lat, lng]) => [lat, lng])
  }

  return mainTrackFullGeometry.slice(0, finalDaySlice.end + 1).map(([lat, lng]) => [lat, lng])
}
