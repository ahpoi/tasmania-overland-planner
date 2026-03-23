# Mobile Header Profile Layout Design

**Date:** 2026-03-23

## Goal

Keep the `Profile` drawer trigger on the same header row as the app title on mobile instead of letting it drop below the title block.

## Approved Direction

- Keep the existing header structure in `app/page.tsx`.
- Change the mobile header container from a stacked column to a single horizontal row.
- Allow the title block to shrink with `min-w-0` so the text can wrap as needed on narrow screens.
- Keep the profile drawer control as a non-shrinking action on the right edge of the row.

## Testing

- Add a focused layout test in `app/page.test.tsx` that asserts the top-level mobile header actions container is a row and not a column.
