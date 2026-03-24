# Fuel Segment Copy Design

**Goal:** Replace remaining day-based wording in the fuel experience with segment-based wording so the copy matches the trip-builder model.

## Product Direction

The planner no longer frames the route as a strict day-by-day itinerary, so the fuel feature should not talk about "days" in its visible copy. The drawer, approximation note, and supporting breakdown labels should all use `Segment` language instead.

## Copy Changes

Update visible fuel-related language such as:

- `selected day` -> `selected segment`
- `Selected-Day Fuel Plan` -> `Selected-Segment Fuel Plan`
- `Completed prior days` -> `Completed prior segments`

The copy should stay plain and functional. This is a wording cleanup, not a feature change.

## Scope

In scope:

- `components/fuel-plan-drawer.tsx`
- `components/calculation-breakdown.tsx`
- any fuel-related tests that assert the old wording

Out of scope:

- renaming internal variable names unless needed for clarity
- changing the underlying fuel calculations
- changing non-fuel UI copy elsewhere in the app
