# Trip And Segment Elevation Design

**Goal:** Separate global trip elevation from segment-specific elevation so the map stays coherent while segment details remain easy to inspect.

## Product Direction

The planner now has two different scopes of information:

- the map shows the whole selected trip and supports segment focus
- elevation can either describe the whole selected trip or a single segment

The current UI mixes those scopes by placing segment elevation inside the map area. That makes the map feel inconsistent because it shows the overall trip while the embedded elevation is local to one segment.

## Interaction Model

The interface should support two distinct elevation views:

- **Trip elevation:** tied to the map panel and derived from the full selected trip
- **Segment elevation:** tied to a chosen segment and shown in the itinerary column

These views should be independent. A user may open one, both, or neither.

### Trip elevation

- Keep a button in the map panel
- Rename it to clearly indicate scope, for example `Show Trip Elevation`
- The resulting chart represents the currently selected trip, including selected side trips where supported by the existing chart logic
- This chart stays associated with the map panel because both are global trip context

### Segment elevation

- Add a `Show Segment Elevation` control to each segment card
- Clicking it opens one shared segment elevation bottom sheet
- Clicking the same segment button again hides the sheet
- Clicking a different segment button switches the open sheet to that segment

This keeps the segment list compact while still making the segment chart easy to access.

## Layout

### Desktop

- Right column: map panel plus optional trip elevation panel
- Left column: trip builder intro and segment cards
- Segment elevation opens in a shared bottom sheet, not inline in the itinerary column

### Mobile

- The map sheet should show the map and the optional trip elevation control/view for the whole selected trip
- Segment elevation should use the same bottom-sheet pattern as desktop

This preserves the same scope split on small screens while keeping the segment-elevation interaction consistent.

## State Changes

Add a dedicated UI state for the active segment elevation sheet:

- `elevationSegmentId: number | null`

Recommended behavior:

- `null` means no segment elevation sheet is open
- clicking a segment elevation button toggles that segment into or out of `elevationSegmentId`
- if the active segment becomes invalid or deselected, clear the segment elevation state safely

This state should remain separate from:

- `focusedSegmentId`, which controls map framing
- `selectedSegmentIds`, which controls trip inclusion

## Component Changes

### `app/page.tsx`

- Remove the inline shared segment elevation panel from the itinerary column
- Keep or restyle the map-level toggle for trip elevation
- Render one shared segment elevation bottom sheet controlled by `elevationSegmentId`

### `components/day-card.tsx`

- Add the segment elevation button
- Reflect whether that segment is the active segment elevation target
- Keep row click behavior for map focus separate from the button action

### Elevation chart

If the current elevation component already supports both trip-wide and segment-specific data sources, reuse it with different props. If not, introduce the smallest possible API expansion so one component can render:

- full selected trip elevation
- one segment elevation

## Labeling

Use labels that make the scope obvious:

- map panel button: `Show Trip Elevation` / `Hide Trip Elevation`
- segment button: `Show Segment Elevation` / `Hide Segment Elevation`
- bottom sheet title: `Segment Elevation`

Avoid generic `Show Elevation` copy in places where scope could be ambiguous.

## Segment Card Controls

The segment header controls should become denser without losing clarity:

- the segment elevation trigger becomes an icon-only button
- the fuel plan trigger becomes an icon-only button
- both buttons keep their existing `aria-label` values for accessibility and tests

The segment elevation icon may continue using the active styling when that sheet is open so the icon-only presentation still communicates state.

## Trip Elevation Markers

The trip elevation overlay should make it easier to orient within the full selected route and feel more like an annotated route profile:

- show subtle segment-boundary markers for the selected main-track segments
- show stronger selected side-trip spans within the trip profile
- keep the underlying trip profile as one continuous line/area

Recommended visual treatment:

- segment boundaries use understated vertical markers with endpoint labels above the chart so the user can quickly see where each selected segment ends
- selected side trips use higher-contrast highlighted spans so they are easy to spot against the main trip profile
- each selected side trip gets a short visible label placed near its highlighted span
- the chart header may include a small legend in trip mode if needed, but the chart itself should remain the main locator

Marker semantics:

- segment-boundary markers indicate where one selected segment ends and the next selected segment begins within the stitched trip profile
- side-trip annotations indicate where a selected side trip leaves the main route and how far that detour extends within the stitched trip profile

The trip chart should feel closer to a route profile than a generic analytics chart:

- endpoint labels sit above the plot, aligned with their boundary lines
- side trips are visible as highlighted spans on top of the trip profile
- side-trip labels are always visible in a shortened form when needed so the user does not have to infer meaning from dots alone

## Testing

Add or update tests to cover:

- map-level elevation toggle still works and is labeled as trip elevation
- segment cards expose a segment elevation button
- clicking a segment elevation button opens the shared bottom sheet for that segment
- clicking the same button again closes the shared bottom sheet
- clicking a different segment elevation button switches the shared bottom-sheet content
- closing the bottom sheet clears `elevationSegmentId`
- map focus still responds to segment card clicks independently of segment elevation

## Scope

In scope:

- separating trip and segment elevation UI
- adding segment elevation toggle state
- moving segment elevation outside the map
- preserving overall trip elevation within the map area

Out of scope:

- redesigning elevation chart visuals
- adding animated panel transitions beyond existing patterns
- creating multiple simultaneous segment elevation panels
