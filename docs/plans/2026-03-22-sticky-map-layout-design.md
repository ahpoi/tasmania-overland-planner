# Sticky Map Layout Design

## Summary

Improve the trip planner so the map behaves more like Airbnb or Agoda: on desktop, the right rail stays visible while the itinerary scrolls on the left, with the elevation chart docked directly below the map. On mobile, replace the bottom sheet with a drag-to-dismiss drawer. Selected side trips should feel easier to toggle and should be represented more clearly in the elevation chart.

## Goals

- Keep map context visible while browsing the daily itinerary on desktop.
- Place the elevation chart directly below the map in the sticky right rail.
- Show where selected side trips branch off in the elevation chart.
- Replace the mobile bottom sheet with a bottom drawer interaction.
- Make side-trip toggles easier to click and unclick on desktop and mobile.

## Non-Goals

- Rebuild the overall page visual design.
- Replace Leaflet or Recharts.
- Add new trip data beyond what already exists in `lib/overland-data.ts`.

## Current State

- [`/Users/ian/Workspace/multidays-hike-australia/app/page.tsx`](/Users/ian/Workspace/multidays-hike-australia/app/page.tsx) already renders a two-column desktop layout and stacks the map and elevation chart in a sticky container.
- [`/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx`](/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx) appends selected side-trip elevation data after the main day profile, which makes the detours look disconnected from the base route.
- [`/Users/ian/Workspace/multidays-hike-australia/components/day-card.tsx`](/Users/ian/Workspace/multidays-hike-australia/components/day-card.tsx) renders side-trip controls as compact rows with a checkbox, but most of the row is not a toggle target.
- [`/Users/ian/Workspace/multidays-hike-australia/components/ui/drawer.tsx`](/Users/ian/Workspace/multidays-hike-australia/components/ui/drawer.tsx) already exists, so mobile can switch from a sheet to a drawer without introducing a new dependency.

## Chosen Approach

Use a stronger sticky right rail on desktop, keep the map and elevation chart visible together, and update the elevation chart data model so selected side trips are inserted at their branch point instead of being appended to the end of the day. On mobile, open the map plus elevation stack inside a bottom drawer. In day cards, make the entire side-trip row interactive while keeping checkbox semantics for accessibility.

## Alternatives Considered

### 1. Docked sticky rail with map over chart

This is the chosen option. It matches the requested Airbnb-style mental model, preserves current component boundaries, and improves comprehension without adding tabbing or panel controls.

### 2. Collapsible chart under a dominant map

This would give the map more space, but it adds controls and state that the current product request does not need.

### 3. Tabbed map/chart rail

This would reduce vertical space pressure, but it conflicts with the request to keep the map on the right and the elevation below it.

## Interaction Design

### Desktop

- Keep the itinerary list in the left column.
- Increase the sense of a dedicated utility rail on the right.
- Keep the map pinned at the top of the rail.
- Render the elevation chart directly below the map in the same sticky container.
- Constrain heights so both panels remain usable on shorter laptop screens.

### Mobile

- Replace the bottom sheet trigger with a bottom drawer trigger.
- Preserve the stacked order: map first, elevation chart second.
- Allow drag-to-dismiss with an internal scroll area for the content.

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

## Data Strategy

- Add a lightweight mapping from side-trip IDs to their approximate branch distance along the selected day profile.
- Build chart data that can distinguish between:
  - main-route points
  - branch marker points
  - side-trip points
- Keep the data model local to the elevation chart unless reuse becomes necessary.

## Testing Strategy

- Add focused tests for the chart data shaping and the side-trip toggle interaction.
- If no test runner exists yet, add the smallest practical test setup needed to cover those behaviors.
- Run lint and the relevant tests before claiming completion.

## Risks

- The branch-point distances are approximate, so the chart marker location will be indicative rather than survey-accurate.
- Multiple side trips on one day can clutter the chart, so labels need to stay compact.
- Sticky height tuning may need small iteration to feel right across laptop sizes.

## Rollout Notes

- This is a local UI behavior change with no backend impact.
- The design document is saved, but it could not be committed because this workspace is not currently inside a git repository.
