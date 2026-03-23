# Side Trip Trail Geometry Design

**Goal:** Replace straight-line side-trip map segments with stored trail-shaped polylines sourced primarily from OpenStreetMap geometry, while keeping official Tasmania Parks walk notes as the authority for trip distance and timing metadata.

## Context

The current map draws selected side trips using only a junction point and a destination point. That produces a straight segment that does not resemble the actual walking track. The user wants side trips to read more like AllTrails, where the line follows the trail itself.

## Source Strategy

Use three levels of trust:

1. Tasmania Parks walk notes for official side-trip inclusion, day assignment, distance, and time.
2. OpenStreetMap-based trail geometry for the rendered side-trip path shape.
3. Small manual fallback polylines only when OSM coverage is missing or obviously incomplete.

AllTrails is useful as a visual cross-check, but not the stored geometry source.

## Data Model

Add a local side-trip geometry dataset keyed by side-trip id. Each entry will store:

- `path`: ordered `[lat, lng]` points for the displayed trail polyline
- optional metadata notes for fallback/manual entries

This keeps the UI fast, deterministic, and offline-friendly. The app should not fetch routing data at runtime.

## Rendering

`buildSideTripPath()` should return the stored geometry polyline when available. If a side trip has no stored geometry, it may fall back to the existing simplified path logic, but only as a last resort.

The existing map styling can stay the same:

- orange
- dashed
- popup with side-trip name and stats

## Validation

Add tests that prove:

- a known side trip such as `cradle-summit` returns more than two points
- the first point stays near the intended junction
- the final point stays near the side-trip waypoint
- the map data helper still returns `null` for unknown side-trip ids

## Risks

- OSM may map a nearby alternative line rather than the exact hiker-preferred route.
- Some side trips may be mapped as disconnected fragments, requiring manual stitching or fallback.
- Existing waypoint coordinates may still need minor correction once real trail geometry is inspected.

## Decision

Proceed with locally stored OSM-backed geometry, preserve Parks metadata for trip stats, and only use manual fallback polylines where mapping quality is insufficient.
