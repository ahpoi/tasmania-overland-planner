# Elevation Overlay Edge-to-Edge Design

## Goal

Make the desktop elevation overlay feel visually aligned with the map panel by extending it flush to the map card's left and right edges while keeping it as an overlay.

## Chosen Approach

Use the existing desktop overlay placement in `app/page.tsx`, but change the overlay wrapper from a right-aligned floating column to a full-width docked overlay. Keep the toggle button offset from the right edge so it still reads as a control floating over the map, while letting the compact chart span the full available width.

## UI Notes

- The chart should remain in overlay mode.
- The chart should feel edge-to-edge horizontally.
- The chart should lose its bottom border and side borders in this desktop overlay state so it visually blends into the map panel edge.
- Existing mobile and non-compact elevation layouts should remain unchanged.

## Validation

- Desktop layout test should confirm the overlay chart now receives a full-width class rather than the previous max-width floating treatment.
- Existing toggle behavior should remain unchanged.
