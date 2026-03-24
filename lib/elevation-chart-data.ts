import { days, elevationProfiles, sideTrips } from "@/lib/overland-data"

export interface ElevationChartPoint {
  distance: number
  elevation: number
}

export interface ElevationChartMarker {
  key: string
  distance: number
  elevation: number
  label: string
  shortLabel?: string
  endDistance?: number
  markerType: "segment-boundary" | "side-trip"
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

const sideTripShortLabels: Record<string, string> = {
  "cradle-summit": "Cradle Mtn",
  "barn-bluff": "Barn Bluff",
  "mt-ossa": "Mt Ossa",
  "pelion-east": "Pelion East",
  "mt-oakleigh": "Mt Oakleigh",
  "fergusson-falls": "Fergusson Falls",
  "dalton-falls": "D'Alton Falls",
  "hartnett-falls": "Hartnett Falls",
}

function shortenSegmentLabel(label: string) {
  return label
    .replace(/\s+Huts?$/u, "")
    .replace(/\s+Hut$/u, "")
    .replace(/^New\s+/u, "")
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

function hasExactDistance(profile: ElevationChartPoint[], distance: number) {
  return profile.some((point) => point.distance === distance)
}

function sliceMainProfile(
  profile: ElevationChartPoint[],
  startDistance: number,
  endDistance: number
) {
  if (profile.length === 0 || endDistance < startDistance) {
    return []
  }

  const segment: ElevationChartPoint[] = []

  segment.push({
    distance: startDistance,
    elevation: interpolateElevationAtDistance(profile, startDistance),
  })

  profile.forEach((point) => {
    if (point.distance > startDistance && point.distance < endDistance) {
      segment.push(point)
    }
  })

  if (endDistance > startDistance || !hasExactDistance(profile, startDistance)) {
    segment.push({
      distance: endDistance,
      elevation: interpolateElevationAtDistance(profile, endDistance),
    })
  }

  return segment
}

function appendSegment(
  stitched: ElevationChartPoint[],
  segment: ElevationChartPoint[],
  sourceStartDistance: number,
  targetStartDistance: number
) {
  segment.forEach((point, index) => {
    const mappedPoint = {
      distance: targetStartDistance + (point.distance - sourceStartDistance),
      elevation: point.elevation,
    }

    const previousPoint = stitched[stitched.length - 1]
    if (
      index === 0 &&
      previousPoint &&
      previousPoint.distance === mappedPoint.distance &&
      previousPoint.elevation === mappedPoint.elevation
    ) {
      return
    }

    stitched.push(mappedPoint)
  })
}

function buildChartSummary(profile: ElevationChartPoint[], markers: ElevationChartMarker[] = []) {
  if (profile.length === 0) {
    return {
      profile,
      markers,
      minElevation: 0,
      maxElevation: 0,
      maxDistance: 0,
    }
  }

  const elevations = profile.map((point) => point.elevation)

  return {
    profile,
    markers,
    minElevation: Math.min(...elevations) - 50,
    maxElevation: Math.max(...elevations) + 50,
    maxDistance: profile[profile.length - 1]?.distance ?? 0,
  }
}

function getActiveSideTripsForDay(selectedDay: number, selectedSideTripIds: string[], dayDistance: number) {
  return sideTrips
    .filter(
      (sideTrip) =>
        sideTrip.dayId === selectedDay &&
        selectedSideTripIds.includes(sideTrip.id) &&
        sideTrip.elevationProfile?.length
    )
    .sort((a, b) => {
      const aDistance = sideTripBranchDistances[a.id] ?? dayDistance / 2
      const bDistance = sideTripBranchDistances[b.id] ?? dayDistance / 2
      return aDistance - bDistance
    })
}

function buildSegmentProfile(selectedDay: number, selectedSideTripIds: string[]) {
  const mainProfile = elevationProfiles[selectedDay] || []
  const dayDistance = mainProfile[mainProfile.length - 1]?.distance || 0

  const activeSideTrips = getActiveSideTripsForDay(selectedDay, selectedSideTripIds, dayDistance)

  const profile: ElevationChartPoint[] = []
  let currentBaseDistance = 0

  activeSideTrips.forEach((sideTrip) => {
    const branchDistance = Math.min(sideTripBranchDistances[sideTrip.id] ?? dayDistance / 2, dayDistance)
    const baseSegment = sliceMainProfile(mainProfile, currentBaseDistance, branchDistance)
    const stitchedDistance = profile[profile.length - 1]?.distance ?? 0

    appendSegment(profile, baseSegment, currentBaseDistance, stitchedDistance)

    const sideTripStartDistance = profile[profile.length - 1]?.distance ?? stitchedDistance
    appendSegment(profile, sideTrip.elevationProfile ?? [], 0, sideTripStartDistance)

    currentBaseDistance = branchDistance
  })

  const remainingBaseSegment = sliceMainProfile(mainProfile, currentBaseDistance, dayDistance)
  const remainingStartDistance = profile[profile.length - 1]?.distance ?? 0

  appendSegment(profile, remainingBaseSegment, currentBaseDistance, remainingStartDistance)

  return profile.length > 0 ? profile : mainProfile
}

function buildSegmentSideTripMarkers(selectedDay: number, selectedSideTripIds: string[]) {
  const mainProfile = elevationProfiles[selectedDay] || []
  const dayDistance = mainProfile[mainProfile.length - 1]?.distance || 0
  const activeSideTrips = getActiveSideTripsForDay(selectedDay, selectedSideTripIds, dayDistance)
  const profile: ElevationChartPoint[] = []
  const markers: ElevationChartMarker[] = []
  let currentBaseDistance = 0

  activeSideTrips.forEach((sideTrip) => {
    const branchDistance = Math.min(
      sideTripBranchDistances[sideTrip.id] ?? dayDistance / 2,
      dayDistance
    )
    const baseSegment = sliceMainProfile(mainProfile, currentBaseDistance, branchDistance)
    const stitchedDistance = profile[profile.length - 1]?.distance ?? 0

    appendSegment(profile, baseSegment, currentBaseDistance, stitchedDistance)

    const sideTripStartDistance = profile[profile.length - 1]?.distance ?? stitchedDistance
    markers.push({
      key: `side-trip-${sideTrip.id}`,
      distance: sideTripStartDistance,
      elevation: interpolateElevationAtDistance(mainProfile, branchDistance),
      label: sideTrip.name,
      shortLabel: sideTripShortLabels[sideTrip.id] ?? sideTrip.name,
      endDistance:
        sideTripStartDistance +
        (sideTrip.elevationProfile?.[sideTrip.elevationProfile.length - 1]?.distance ?? 0),
      markerType: "side-trip",
    })

    appendSegment(profile, sideTrip.elevationProfile ?? [], 0, sideTripStartDistance)
    currentBaseDistance = branchDistance
  })

  return markers
}

export function buildSegmentElevationChartData(selectedDay: number, selectedSideTripIds: string[]) {
  return buildChartSummary(buildSegmentProfile(selectedDay, selectedSideTripIds))
}

export function buildTripElevationChartData(
  selectedSegmentIds: number[],
  selectedSideTripIds: string[]
) {
  const profile: ElevationChartPoint[] = []
  const markers: ElevationChartMarker[] = []
  const sortedSegmentIds = [...selectedSegmentIds].sort((left, right) => left - right)

  sortedSegmentIds.forEach((segmentId, index) => {
      const segmentProfile = buildSegmentProfile(segmentId, selectedSideTripIds)
      const segmentSideTripMarkers = buildSegmentSideTripMarkers(segmentId, selectedSideTripIds)
      const targetStartDistance = profile[profile.length - 1]?.distance ?? 0

      appendSegment(profile, segmentProfile, 0, targetStartDistance)
      segmentSideTripMarkers.forEach((marker) => {
        markers.push({
          ...marker,
          distance: targetStartDistance + marker.distance,
        })
      })

      if (index < sortedSegmentIds.length - 1) {
        const day = days.find((candidate) => candidate.id === segmentId)

        markers.push({
          key: `segment-boundary-${segmentId}`,
          distance: targetStartDistance + (segmentProfile[segmentProfile.length - 1]?.distance ?? 0),
          elevation: segmentProfile[segmentProfile.length - 1]?.elevation ?? 0,
          label: day?.to ?? `Segment ${segmentId}`,
          shortLabel: shortenSegmentLabel(day?.to ?? `Segment ${segmentId}`),
          markerType: "segment-boundary",
        })
      }
    })

  return buildChartSummary(profile, markers)
}

export function buildElevationChartData(selectedDay: number, selectedSideTripIds: string[]) {
  return buildSegmentElevationChartData(selectedDay, selectedSideTripIds)
}
