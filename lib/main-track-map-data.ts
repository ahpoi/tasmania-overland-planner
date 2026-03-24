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

export function getSelectedTrackPaths(
  selectedSegmentIds: number[],
  exitMethod: ExitMethod = "walk"
): LatLngTuple[][] {
  const allowedSegmentIds = new Set(
    selectedSegmentIds.filter((segmentId) => exitMethod === "walk" || segmentId <= 6)
  )
  const contiguousRanges: Array<{ start: number; end: number }> = []

  Object.entries(mainTrackDaySlices)
    .map(([dayId, slice]) => ({ dayId: Number(dayId), slice }))
    .filter(({ dayId }) => allowedSegmentIds.has(dayId))
    .sort((left, right) => left.dayId - right.dayId)
    .forEach(({ slice }) => {
      const previousRange = contiguousRanges[contiguousRanges.length - 1]

      if (!previousRange) {
        contiguousRanges.push({ start: slice.start, end: slice.end })
        return
      }

      if (slice.start <= previousRange.end + 1) {
        previousRange.end = Math.max(previousRange.end, slice.end)
        return
      }

      contiguousRanges.push({ start: slice.start, end: slice.end })
    })

  return contiguousRanges.map((range) =>
    mainTrackFullGeometry.slice(range.start, range.end + 1).map(([lat, lng]) => [lat, lng])
  )
}
