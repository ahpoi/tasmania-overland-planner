import { elevationProfiles, sideTrips } from "@/lib/overland-data"

export interface ElevationChartPoint {
  distance: number
  elevation: number
}

export interface BranchMarker {
  sideTripId: string
  name: string
  distance: number
  elevation: number
  maxElevation: number
}

const sideTripBranchDistances: Record<string, number> = {
  "cradle-summit": 4.2,
  "barn-bluff": 5.1,
  "mt-ossa": 3.4,
  "pelion-east": 3.4,
  "mt-oakleigh": 3.4,
  "fergusson-falls": 4.8,
  "dalton-falls": 4.8,
  "hartnett-falls": 4.8,
}

function interpolateElevationAtDistance(profile: ElevationChartPoint[], distance: number) {
  if (profile.length === 0) return 0
  if (distance <= profile[0].distance) return profile[0].elevation

  for (let index = 1; index < profile.length; index += 1) {
    const previous = profile[index - 1]
    const current = profile[index]

    if (distance <= current.distance) {
      const segmentLength = current.distance - previous.distance
      if (segmentLength === 0) return current.elevation

      const progress = (distance - previous.distance) / segmentLength
      return previous.elevation + (current.elevation - previous.elevation) * progress
    }
  }

  return profile[profile.length - 1].elevation
}

export function buildElevationChartData(selectedDay: number, selectedSideTripIds: string[]) {
  const mainProfile = elevationProfiles[selectedDay] || []
  const dayDistance = mainProfile[mainProfile.length - 1]?.distance || 0

  const activeSideTrips = sideTrips.filter(
    (sideTrip) => sideTrip.dayId === selectedDay && selectedSideTripIds.includes(sideTrip.id)
  )

  const branchMarkers: BranchMarker[] = []

  activeSideTrips.forEach((sideTrip) => {
    if (!sideTrip.elevationProfile?.length) {
      return
    }

    const branchDistance = Math.min(sideTripBranchDistances[sideTrip.id] ?? dayDistance / 2, dayDistance)
    const branchElevation = interpolateElevationAtDistance(mainProfile, branchDistance)

    branchMarkers.push({
      sideTripId: sideTrip.id,
      name: sideTrip.name,
      distance: branchDistance,
      elevation: branchElevation,
      maxElevation: Math.max(...sideTrip.elevationProfile.map((point) => point.elevation)),
    })
  })

  return {
    mainProfile,
    branchMarkers,
    minElevation: Math.min(...mainProfile.map((point) => point.elevation)) - 50,
    maxElevation: Math.max(
      ...mainProfile.map((point) => point.elevation),
      ...branchMarkers.map((marker) => marker.maxElevation)
    ) + 50,
    maxDistance: dayDistance,
  }
}
