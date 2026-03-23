# Flush Itinerary / Map Layout Design

**Date:** 2026-03-23

## Goal

Remove the "cards inside cards" feeling from the desktop planner layout so the itinerary and map read as two continuous adjacent surfaces. Keep the small itinerary heading row, but remove the extra panel chrome and internal spacing around the day list and the map.

## Approved Direction

- Keep the `Daily Itinerary` heading row at the top of the left column.
- Remove the rounded outer section card that currently wraps the itinerary list.
- Convert the day list from separated cards into a flush vertical stack with dividers between days.
- Keep the selected day expanded, but style it as part of the shared left-column surface instead of an isolated floating card.
- Make the right-side map fill the sticky panel height with no surrounding "card" padding and much lighter chrome.
- Preserve the horizontal gutter between the itinerary column and the map column.
- Remove extra desktop spacing around the map and between day sections; do not remove the center gap between columns.

## Component Impact

### `app/page.tsx`

- Simplify the left column wrapper so it behaves like a continuous panel instead of a padded card.
- Keep the two-column desktop grid and existing sticky map behavior.
- Preserve mobile drawer behavior unless the new styling requires small consistency tweaks.

### `components/day-card.tsx`

- Replace the current `Card`-based presentation with a flatter section layout.
- Use separators and subtle background changes to indicate state instead of isolated rounded cards and shadows.
- Keep all current data, interactions, and side-trip toggles.

### `components/track-map.tsx`

- Reduce or remove the immersive card shell so the map area becomes the dominant surface.
- Keep the current map header/meta text and legend, but make them feel like thin rails attached to the map instead of a separate card.
- Preserve all existing map interactions, markers, and overlays.

## UX Notes

- The selected day should still be obvious without relying on a heavy border or drop shadow.
- The map should feel visually larger even though the actual column layout stays the same.
- Side trips can remain grouped within the selected day, but the parent day should no longer feel boxed.

## Testing Expectations

- Existing rendering tests should continue to pass after class-name updates.
- Desktop layout should be verified to ensure the sticky map still fills the intended height and the elevation overlay still anchors correctly.
