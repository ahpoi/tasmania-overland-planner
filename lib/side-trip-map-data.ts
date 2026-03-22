import { mainTrackFullGeometry } from "@/lib/main-track-geometry"
import { sideTrips, waypoints } from "@/lib/overland-data"
import { sideTripGeometries, type LatLngTuple } from "@/lib/side-trip-geometries"

function getSideTripWaypoint(sideTripId: string) {
  return sideTrips.find((trip) => trip.id === sideTripId) ?? null
}

function getSideTripDestination(sideTripId: string) {
  const sideTrip = getSideTripWaypoint(sideTripId)
  if (!sideTrip?.waypointId) {
    return null
  }

  return waypoints.find((waypoint) => waypoint.id === sideTrip.waypointId) ?? null
}

function getDistanceSquared([latA, lngA]: LatLngTuple, [latB, lngB]: LatLngTuple) {
  return (latA - latB) ** 2 + (lngA - lngB) ** 2
}

function getNearestTrackPoint(target: LatLngTuple): LatLngTuple {
  return mainTrackFullGeometry
    .reduce((nearest, candidate) =>
      getDistanceSquared(candidate, target) < getDistanceSquared(nearest, target) ? candidate : nearest
    )
}

export function buildSideTripPath(sideTripId: string): LatLngTuple[] | null {
  const storedGeometry = sideTripGeometries[sideTripId]
  if (storedGeometry) {
    return storedGeometry
  }

  const sideTrip = getSideTripWaypoint(sideTripId)
  const waypoint = getSideTripDestination(sideTripId)
  if (!waypoint) {
    return null
  }

  const destination: LatLngTuple = [waypoint.lat, waypoint.lng]
  const start =
    sideTrip?.junctionLat !== undefined && sideTrip.junctionLng !== undefined
      ? ([sideTrip.junctionLat, sideTrip.junctionLng] as LatLngTuple)
      : getNearestTrackPoint(destination)

  return [start, destination]
}
