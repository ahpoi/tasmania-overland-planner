# Main Track Geometry Design

**Goal:** Replace the simplified Overland Track polyline with stored OSM-backed trail geometry from Ronny Creek to Cynthia Bay, including the optional Day 7 walking segment.

## Approach

Store the full main-route geometry locally in the repo, just like the side-trip geometry. Use that full geometry for the base map line, and derive day highlight segments from day-specific slice boundaries instead of the current hard-coded simplified index ranges.

## Data Rules

- Tasmania Parks remains the source of truth for day distances and itinerary metadata.
- OpenStreetMap geometry is the source of truth for rendered route shape.
- Day 7 must remain part of the stored walking geometry even when the UI is configured for ferry exit.

## Rendering

- Base route: full stored geometry
- Day highlight: slice of the full stored geometry keyed by day
- Ferry exit: hide Day 7 highlight when ferry is selected, but keep the stored Day 7 geometry available

## Validation

Add tests that verify:

- the main route has substantially more than the current handful of points
- day slices return multi-point paths
- the Day 7 slice exists and ends near Cynthia Bay
