# Side Trip Elevation Redesign

## Summary

The current elevation chart implies that selected side trips can be drawn accurately on top of the main day route. That is not true with the available data. The fix is to keep the main day chart honest by showing only branch markers on the main route, and move each selected side trip's elevation profile into its own compact inset chart below the main profile.

## Goals

- Stop showing misleading side-trip elevation overlays on the main day chart.
- Preserve the branch-point cue on the main route.
- Still give users a clear view of each selected side trip's elevation shape.
- Keep the change local to the elevation card.

## Non-Goals

- Rework the page layout, sticky rail, or mobile drawer.
- Introduce new GPS or survey-grade route data.
- Build a fully separate analytics panel for side trips.

## Current Problem

- The main chart currently compresses side-trip profiles into the day-route width.
- Branch distances are approximate, and the resulting overlay can suggest a false relationship between main-route and detour elevations.
- In screenshots like the `Hartnett Falls` example, the dashed line reads as if it is a true route alignment when it is only a visual approximation.

## Chosen Approach

Render the main day profile without side-trip overlays. Keep a small branch marker on the main chart for each selected side trip. Under the main chart, render one compact mini profile per selected side trip using that side trip's own stored `elevationProfile`.

## Alternatives Considered

### 1. Branch markers plus inset side-trip charts

Chosen. This keeps the day chart accurate while still exposing side-trip elevation data.

### 2. Branch markers only

Safe, but too sparse. Users lose the useful elevation context for optional detours.

### 3. Keep overlays and improve approximation

Not chosen. Even with better approximation, it still suggests precision the dataset does not support.

## Interaction Design

- The main chart continues to show the selected day's base route.
- Each selected side trip gets a labeled branch marker on the main chart.
- The dashed overlay line is removed from the main chart.
- Selected side trips render below the main chart in the same card as compact profiles with their name and key stats.
- Multiple selected side trips stack vertically in day-list order.

## Data Strategy

- Keep approximate branch distances only for marker placement on the main day chart.
- Do not remap side-trip profile points into the base-route distance axis.
- Reuse the existing side-trip `elevationProfile` values directly for mini charts.

## Testing Strategy

- Update the data-shaping test to assert branch markers without overlay series.
- Add or update a component test to confirm selected side trips render as separate mini profiles.
- Re-run the existing planner tests, TypeScript, and production build.

## Risks

- Branch markers are still approximate, so labeling should stay modest and avoid implying exact route coordinates.
- Several selected side trips could make the elevation card taller, so the mini profiles need to stay compact.

## Notes

- This redesign intentionally favors honest presentation over a denser chart.
- The workspace is not a git repository from this directory, so this design document cannot be committed here.
