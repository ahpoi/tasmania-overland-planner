# Segment Map Focus Design

**Goal:** When a user clicks a selected trip segment, keep the whole selected trip rendered on the map but zoom the map to that segment and any selected side trips attached to it.

## Product Direction

The planner now supports building a whole trip, so map rendering should continue to show the full selected route. At the same time, editing the planner should feel precise. Clicking a segment should not change what is selected for the trip, but it should help the user inspect that part of the route.

## Interaction Model

Selection and focus should become separate concepts:

- `selectedSegmentIds` controls which main-track segments are included in the trip.
- `selectedSideTrips` controls which optional detours are included in the trip.
- `focusedSegmentId` controls which part of the selected trip the map frames.

When a user clicks a segment row:

- that segment becomes the focused segment
- the map fits to that segment's main-track geometry
- any selected side trips belonging to that segment are included in the focus bounds
- the rest of the selected trip remains visible on the map

If there is no focused segment, the map should fall back to framing the full selected trip.

## State Changes

Add a persisted or session-level focus field to the trip store:

- `focusedSegmentId: number | null`

Recommended behavior:

- default it to the first selected segment when useful
- update it when a segment row is clicked
- clear it if the focused segment is deselected
- keep it constrained to valid segments for the current exit method

Persisting this focus in local storage is acceptable and consistent with the trip builder, but it is less important than persisting selections. The critical requirement is that selection and focus remain distinct in the logic.

## Map Behavior

The map should continue drawing:

- the background full-track line
- all selected main-track highlighted lines
- all selected side-trip lines

Only the bounds calculation changes:

- if `focusedSegmentId` is set, use that segment's path plus selected side trips for that segment
- otherwise use all selected trip paths
- if nothing is selected, fall back to the visible full track

This keeps the visual context of the whole trip while making inspection of a chosen segment much easier.

## UI Behavior

Segment rows already support click interaction. That click should become the map-focus trigger.

Recommended visual treatment:

- keep the current subtle focus ring on the clicked segment
- do not overload the checkbox with focus behavior
- checkbox toggles inclusion
- card click sets focus

This preserves a clear mental model:

- checkbox = include in trip
- click row = inspect on map

## Testing

Add or update tests to cover:

- clicking a segment updates `focusedSegmentId`
- deselecting the focused segment clears or reassigns focus safely
- map focus-path derivation includes selected side trips for the focused segment
- map focus falls back to the full selected trip when no segment is focused

## Scope

In scope:

- focus state in the store
- focused-bounds derivation for the map
- segment click behavior

Out of scope:

- custom animated fly-to behavior
- side-trip-specific focus state
- separate map focus controls outside the segment list
