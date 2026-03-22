import mainTrackGeometryData from "@/lib/main-track-geometry.json"

export type LatLngTuple = [number, number]

type MainTrackGeometryData = {
  dayPaths: Record<string, LatLngTuple[]>
  slices: Record<string, { start: number; end: number }>
  full: LatLngTuple[]
}

const geometryData = mainTrackGeometryData as unknown as MainTrackGeometryData

function toLatLngTuple(point: number[]): LatLngTuple {
  return [point[0], point[1]]
}

export const mainTrackDayPaths: Record<string, LatLngTuple[]> = Object.fromEntries(
  Object.entries(geometryData.dayPaths).map(([dayId, path]) => [dayId, path.map(toLatLngTuple)])
)

export const mainTrackDaySlices = geometryData.slices
export const mainTrackFullGeometry = geometryData.full.map(toLatLngTuple)
