# Itinerary Day Separation Design

**Goal:** Make each itinerary day read as a distinct section instead of a single continuous block of text.

## Chosen Direction

Use soft section blocks for each day instead of simple dividers or heavy standalone cards.

## Why

- Plain divider lines would help, but would still leave the itinerary reading like one long list.
- Full cards would improve separation, but would reintroduce the heavier "cards inside cards" feeling the recent layout removed.
- Soft blocks preserve the flatter planner layout while giving each day enough visual structure to scan quickly.

## UI Changes

- Add vertical spacing between itinerary days.
- Give each day a faint border and light warm background tint.
- Keep the selected day visually stronger than unselected days.
- Preserve the current itinerary header row and overall two-column planner layout.

## Scope

- Update the day card container styling in `components/day-card.tsx`.
- Adjust the itinerary list wrapper in `app/page.tsx` so spacing works with separated day blocks.
- Extend tests to assert the new separated block treatment.
