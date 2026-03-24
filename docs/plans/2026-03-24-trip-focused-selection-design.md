# Trip-Focused Selection Design

**Goal:** Replace the current day-at-a-time planner with a trip builder that lets people select multiple main track segments and side trips, shows the full selected route on the map, and restores those selections from local storage.

## Product Direction

Shift the planner away from "build one day" toward "compose your whole trip." The left rail should no longer imply a prescribed day-by-day itinerary. Instead, it should present the Overland Track as a set of selectable route segments plus optional side trips that can later be combined into real hiking days by the user.

The default state for a brand-new visitor should feel useful immediately:

- All main track segments selected.
- No side trips selected.
- Exit method preserved as part of the trip configuration.

This keeps the full Overland Track visible from first load without overwhelming the user with every optional detour.

## Interaction Model

The current single-selection model should be removed. There should no longer be one active day controlling the map and side-trip panel. Instead:

- Main track segments are independently selectable.
- Side trips are independently selectable.
- The map renders the full set of selected items at once.
- Totals are calculated from every selected main segment and side trip.
- Segment and side-trip selections persist across reloads.

The planner can still present the route in ordered sections, but those sections should read as trip segments or stages rather than mandatory days.

## UI Structure

Rename the itinerary rail to reflect trip-building behavior. The panel should read more like a checklist or planner builder than a current-day inspector.

Recommended structure:

- A header row with trip-level controls and summary context.
- Quick actions such as `Select all` and `Clear all`.
- A main-segment section listing each route segment in order.
- A side-trip section listing optional detours.

Each main-segment row should show the same useful metadata the day cards currently expose, but in a more compact selectable format:

- segment name
- from/to labels
- difficulty
- distance, time, ascent, descent

Expanded descriptive content is optional, but the interaction emphasis should move from "open the selected day" to "toggle this segment into my trip."

## Data and State Changes

The trip store should become selection-oriented rather than active-day-oriented.

Replace or deprecate:

- `selectedDay`
- day-scoped side-trip visibility assumptions
- any selector that depends on a single focused day

Add or persist:

- `selectedSegmentIds`
- `selectedSideTrips`
- `exitMethod`

Derived helpers should support:

- retrieving selected main segments in route order
- retrieving available side trips, optionally grouped by segment
- computing totals from all selected content
- checking whether all main segments are selected
- selecting all main segments
- clearing all main segments and side trips

Persist these values in local storage so the full trip configuration is restored when the app reopens.

## Map and Elevation Behavior

The map should render the union of all selected route geometry, not just the previously active day. Selected side trips should also appear simultaneously. The visual result should be "this is my current trip plan" rather than "this is the day I clicked most recently."

The elevation chart should follow the same principle where feasible: prioritize showing the currently selected trip composition instead of a single-day profile. If the current implementation requires a transitional step, the first acceptable milestone is to make the map fully trip-aware while keeping the elevation chart behavior stable, but the intended direction is trip-wide visualization.

## Copy Changes

Replace day-oriented language with trip-oriented language, for example:

- `Daily Itinerary` -> `Trip Builder` or `Trip Plan`
- `current day` copy -> `selected trip`
- `Day` labels -> `Segment`, `Stage`, or route names

The wording should make it clear that users can later combine these segments into actual hiking days however they like.

## Testing

Add or update tests to cover:

- default selection state for first-time users
- persisted restoration of selected segments and side trips
- multi-selection totals across several segments and side trips
- `Select all` and `Clear all` behavior
- map-facing data derivation for all selected content
- UI rendering that no longer depends on a single selected day

## Scope Boundaries

In scope:

- trip-focused selection model
- persisted multi-select state
- trip-wide map rendering
- panel copy and controls needed for the new model

Out of scope for this change:

- auto-generating custom hiking day groupings from selected segments
- advanced itinerary optimization
- saved named trip presets
