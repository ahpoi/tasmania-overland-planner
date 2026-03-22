# Compact Sticky Map Layout Design

## Summary

Redesign the trip planner so it feels more like Airbnb or Agoda: on desktop, the left side becomes a compact planning column while the right side becomes a sticky full-height map stage beneath the header. The elevation profile should float over the map instead of consuming its own full rail row. On mobile, preserve the drawer pattern for map tools without trying to force the desktop split layout into a narrow viewport.

## Goals

- Keep map context visible while browsing the daily itinerary on desktop.
- Make the overall layout feel more compact and screen-efficient.
- Let the map dominate the right side as a dedicated visual stage.
- Float the elevation chart over the map so it stays available without shrinking the map too aggressively.
- Show where selected side trips branch off in the elevation chart.
- Make side-trip toggles easier to click and unclick on desktop and mobile.

## Non-Goals

- Rebuild the entire visual identity or add brand-new information architecture.
- Replace Leaflet or Recharts.
- Add new trip data beyond what already exists in `lib/overland-data.ts`.

## Current State

- [`/Users/ian/Workspace/multidays-hike-australia/app/page.tsx`](/Users/ian/Workspace/multidays-hike-australia/app/page.tsx) currently renders a conventional two-column layout with a hero section, a separate summary row, and a sticky right rail that stacks the map above the elevation chart.
- [`/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx`](/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx) appends selected side-trip elevation data after the main day profile, which makes the detours look disconnected from the base route.
- [`/Users/ian/Workspace/multidays-hike-australia/components/day-card.tsx`](/Users/ian/Workspace/multidays-hike-australia/components/day-card.tsx) renders side-trip controls as compact rows with a checkbox, but most of the row is not a toggle target.
- [`/Users/ian/Workspace/multidays-hike-australia/components/ui/drawer.tsx`](/Users/ian/Workspace/multidays-hike-australia/components/ui/drawer.tsx) already exists, so mobile can switch from a sheet to a drawer without introducing a new dependency.

## Chosen Approach

Use a denser split-screen desktop layout. The left column will hold a compact trip-summary strip and the itinerary cards. The right column will become a sticky viewport-aware map panel that fills the available height below the header. The elevation profile will render as a floating glass-style overlay pinned near the bottom of the map so the right side still reads as a single cohesive surface. The chart data model will continue to insert selected side trips at their branch point instead of appending them to the end of the day.

## Alternatives Considered

### 1. Full-height map stage with floating elevation card

This is the chosen option. It best matches the requested Airbnb-style mental model, keeps the map visually primary, and makes the desktop layout feel much more compact without introducing tabs or extra toggles.

### 2. Traditional sticky rail with chart under map

This would be simpler to keep, but it still spends too much vertical space on separate boxed panels and does not create the desired marketplace-style split layout.

### 3. Toggleable map overlay tray

This would save space, but it adds interaction complexity and hides key terrain context behind another control.

## Interaction Design

### Desktop

- Keep the itinerary list in the left column.
- Move the trip summary into that same left column as a compact overview strip instead of a full-width section.
- Use a tighter overall grid so the planning content reads as one compact stack.
- Turn the right side into a sticky map panel sized to the viewport height minus the header.
- Float the elevation profile inside the map panel as an overlay card near the bottom edge.
- Allow the overlay to feel detachable from the page chrome through translucency, shadow, and rounded corners.

### Mobile

- Keep the mobile drawer trigger because it is the right interaction for limited viewport width.
- Preserve the stacked order inside the drawer: map first, elevation chart second.
- Do not float the chart over the map on small screens if that would reduce legibility or touch comfort.

### Side Trips

- Make each side-trip row a larger interactive target.
- Tapping or clicking anywhere on the row toggles the side trip.
- Prevent row interactions from accidentally selecting the outer day card.
- Keep a visible selected state that is stronger than the current subtle background tint.

## Elevation Chart Behavior

- Continue showing the base day elevation profile.
- For each selected side trip on the active day, place its detour segment at the branch point that corresponds to the trip waypoint instead of appending it after the entire profile.
- Mark the branch point with a side-trip indicator.
- Style detour segments differently from the main route so users can immediately see where the side trip happens.
- Update tooltip text to identify side-trip points by name.
- Support a more compact desktop presentation so the chart remains legible in an overlay footprint.

## Data Strategy

- Add a lightweight mapping from side-trip IDs to their approximate branch distance along the selected day profile.
- Build chart data that can distinguish between:
  - main-route points
  - branch marker points
  - side-trip points
- Keep the data model local to the elevation chart unless reuse becomes necessary.

## Layout Strategy

- Keep the header sticky at the top of the page.
- Collapse or remove the tall hero treatment on desktop so the map can begin higher on the page.
- Use a two-column desktop grid with a narrower planning column and a wider map column.
- Apply a viewport-aware sticky height such as `calc(100vh - headerHeight - spacing)` to the map stage.
- Render the floating elevation card inside the map stage container so it moves with the map and stays within the sticky bounds.
- Preserve a simpler stacked layout for tablet and mobile breakpoints.

## Testing Strategy

- Add focused tests for the chart data shaping and the side-trip toggle interaction.
- If no test runner exists yet, add the smallest practical test setup needed to cover those behaviors.
- Run lint and the relevant tests before claiming completion.

## Risks

- The branch-point distances are approximate, so the chart marker location will be indicative rather than survey-accurate.
- Multiple side trips on one day can clutter the chart, so labels need to stay compact.
- Sticky height tuning may need small iteration to feel right across laptop sizes.
- A floating chart overlay can block map interaction if it is too large or badly positioned.
- Compacting the left column too aggressively could hurt scanability of day details.

## Rollout Notes

- This is a local UI behavior change with no backend impact.
- The design document is saved, but it could not be committed because this workspace is not currently inside a git repository.
