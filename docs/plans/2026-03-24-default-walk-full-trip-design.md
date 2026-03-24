# Default Walk Full Trip Design

**Goal:** Make a brand-new planner session open in walk mode with all main-track segments selected by default, while keeping side trips unselected.

## Product Direction

The planner should feel immediately complete on first load. A new visitor should land on the full Overland Track rather than the ferry-shortened route, and they should see the entire walk selected without needing any setup clicks.

This means the default experience becomes:

- exit method: `walk`
- selected main segments: `1-7`
- focused segment: first segment
- selected side trips: none

## Persistence Behavior

This change should affect only fresh starts.

- If no saved trip configuration exists, use the new defaults.
- If a saved trip configuration exists, restore it after rehydration as usual.

That keeps returning users' choices intact while improving the first-run experience.

## State Changes

Update the default trip state so it reflects the full walk:

- `exitMethod: "walk"`
- `selectedSegmentIds: [1, 2, 3, 4, 5, 6, 7]`
- `focusedSegmentId: 1`
- `selectedDay: 1`
- `selectedSideTrips: []`

No additional UI controls are needed.

## UI Impact

The immediate visible effect on first load should be:

- the exit toggle starts in walk mode
- segment 7 is selected by default
- the map shows the full route by default

Side trips remain opt-in.

## Testing

Update tests to cover:

- default trip store values now use walk mode and all seven segments
- the planner UI renders with walk mode active by default
- persisted state restoration still overrides the defaults after mount

## Scope

In scope:

- default store state update
- tests and expectations tied to the initial load state

Out of scope:

- changing persistence logic
- changing segment focus behavior
- changing side-trip defaults
