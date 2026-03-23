# Itinerary Exit Toggle Design

**Goal:** Move the ferry versus walk toggle from the sticky page header into the `Daily Itinerary` header, aligned on the right, and remove the helper copy that currently says "Click a day for details."

## Context

The current page header contains both global branding and the itinerary exit-mode control. The itinerary panel header still shows instructional copy on the right. The user wants the toggle moved into that right-side slot and visible on all screen sizes.

## Proposed Change

- Keep the sticky page header focused on branding and profile access.
- Reuse the existing ferry versus walk switch styling and behavior inside the `Daily Itinerary` header row.
- Remove the helper text entirely.
- Allow the itinerary header row to wrap on small screens so the title and toggle remain usable without overlap.

## Notes

- This is a relocation only; trip state and toggle behavior should remain unchanged.
- Existing tests around page layout should be updated to assert the new placement and the removal of the helper text.
