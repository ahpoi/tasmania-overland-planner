# Itinerary Map Focus Design

**Date:** 2026-03-23

## Goal

When a user selects a day in the itinerary, the map should automatically pan and zoom to that day's route instead of staying framed to the entire Overland Track.

## Approved Direction

- Fit the map to the selected day's main track segment whenever the selected day changes.
- If the selected day has active side trips, expand the fitted bounds to include those side-trip paths as well.
- Keep the full track as a subdued background line so users maintain overall route context.
- Do not force any popup open while refocusing; the change should feel like a smooth framing update only.

## Component Impact

### `components/track-map.tsx`

- Derive a single set of bounds from the selected day path plus any selected side-trip paths.
- Refit the Leaflet map when those visible itinerary paths change.
- Keep the initial full-track fit for first render, but hand off to itinerary-focused bounds after selection state is available.

### `lib/trip-context.tsx`

- No behavior change required beyond the existing selected day and side-trip state.

## UX Notes

- Day selection should feel immediate and spatially helpful.
- Adding or removing side trips should update the frame without losing the selected day's main route.
- Ferry versus walk exit mode should continue to affect the background full-track path only.

## Testing Expectations

- Add a map-focused unit test around the bounds-selection logic.
- Verify the map still renders and that existing itinerary tests remain green.
