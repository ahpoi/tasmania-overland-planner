# Side Trip GPX Refresh Design

**Goal:** Replace the stored geometry and endpoint metadata for `barn-bluff`, `mt-ossa`, and `mt-oakleigh` with the user-provided GPX tracks so the side-trip lines and markers reflect the actual walking routes.

## Context

The current side-trip map support is already structured around stored local polylines in `lib/side-trip-geometries.ts`. That makes this update straightforward: swap in better source data for the supported trips rather than changing rendering behavior.

The user provided GPX files for three side trips, and those files are a better source than the current approximate OSM-derived shapes because they contain actual recorded trail tracks.

## Recommended Approach

Use each GPX file as the canonical geometry source for its matching side trip:

- `Barn_Bluff.gpx` -> `barn-bluff`
- `Mount_Ossa_Summit_Track.gpx` -> `mt-ossa`
- `Mount_Oakleigh_Track.gpx` -> `mt-oakleigh`

For each track:

- store the full ordered GPX polyline in `lib/side-trip-geometries.ts`
- update the corresponding `junctionLat` / `junctionLng` to the GPX start point
- update the waypoint lat/lng for the destination marker to the GPX end point

This keeps the line and destination marker aligned and avoids a mixed state where the path is accurate but the marker is still approximate.

## Alternatives Considered

1. Replace only the line geometry.
This is lower-risk but leaves markers slightly off the actual track endpoint.

2. Replace geometry plus endpoint metadata.
This is the best fit because it fixes both the visual route and the destination anchor while staying narrowly scoped.

3. Introduce runtime GPX parsing.
This is unnecessary. The app already prefers local stored geometry, and static conversion is simpler and faster.

## Data Handling

The GPX files should be copied into the repo as local source artifacts so the change is reproducible. A small one-off conversion step can translate `trkpt` entries into the existing `[lat, lng]` arrays.

The rest of the side trips should remain unchanged for now.

## Validation

Tests should confirm:

- each refreshed side trip returns a multi-point geometry
- the first point matches the GPX-derived junction
- the last point matches the GPX-derived destination marker
- the updated waypoint coordinates in `lib/overland-data.ts` align with the geometry endpoints

## Decision

Proceed with GPX-backed replacement for `barn-bluff`, `mt-ossa`, and `mt-oakleigh`, including both geometry and endpoint metadata, while leaving all other side trips on their current sources.
