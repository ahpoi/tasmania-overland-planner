# Profile and Fuel Drawers Design

**Date:** 2026-03-23

## Goal

Add a persisted hiker profile in the header and a selected-day fuel planning drawer that estimates calories, macros, meal splits, and effective pack weight based on the chosen itinerary day plus active side trips.

## Approved Direction

- Add a `Profile` drawer in the header with editable numeric fields for height, weight, age, starting pack weight, and daily pack reduction.
- Persist the profile on the client with Zustand backed by `localStorage`.
- Add a `Fuel Plan` drawer in the header that only reflects the currently selected itinerary day.
- Derive the selected-day estimate from the base day segment plus any toggled side trips.
- Derive terrain automatically from combined distance, ascent, descent, and hiking time instead of asking the user to choose it manually.
- Reduce effective pack weight automatically by the selected day's position in the planned itinerary order.
- Show the estimate math in a popover so users can inspect the formula inputs and outputs.

## Architecture

### `lib/trip-context.tsx`

- Keep itinerary selection, side-trip selection, and day total calculations in the existing trip context.
- Add a small helper that returns the selected day's ordinal position inside the active itinerary so the fuel estimator can compute completed prior days without inferring from raw day ids.

### Zustand profile store

- Create a dedicated client store for persisted hiker profile data.
- Store only user-entered profile values and update actions in Zustand.
- Use local storage persistence so profile values survive refreshes.
- Keep calculation logic out of the store so the store remains easy to test and reuse.

### Fuel estimation module

- Add a pure utility module in `lib/` that accepts:
  - selected day totals
  - selected day position in the active itinerary
  - user profile values
- Return:
  - effective pack weight
  - derived terrain tier
  - estimated calories burned
  - recommended intake target
  - total macro grams
  - breakfast/lunch/dinner/snacks split
  - a structured formula breakdown for UI display

## Estimation Model

The first-pass model should stay transparent and adjustable rather than pretending to be physiologically exact.

### Inputs

- Body weight in kilograms
- Height in centimeters
- Age in years
- Starting pack weight in kilograms
- Daily pack reduction in kilograms
- Selected day distance
- Selected day ascent
- Selected day descent
- Selected day hiking time

### Effective pack weight

- Compute `completedDaysBeforeSelected` from the selected day's ordinal position in the active itinerary.
- Compute `effectivePackWeightKg = max(startingPackWeightKg - dailyPackReductionKg * completedDaysBeforeSelected, 0)`.

### Terrain tier

Use the combined day totals including selected side trips:

- `Easy` for shorter/lower-ascent days
- `Moderate` for typical overland hiking days
- `Demanding` for long or steep days
- `Very Demanding` for long and steep days or summit-heavy combinations

The tier should be determined by a weighted score using distance, ascent, descent, and average hiking time.

### Calorie estimate

Use a simple weighted hiking estimate:

- Start with a body-weight and hiking-time base burn
- Add distance load
- Add ascent penalty
- Add smaller descent penalty
- Add pack-weight penalty using effective pack weight
- Apply a modest terrain multiplier from the derived terrain tier

This should be presented in the UI as an estimate, not a medical or sports-science prescription.

### Intake and macro target

- Convert the burn estimate into a practical intake target for carrying food on trail.
- Use a hiking-oriented macro split biased toward carbohydrates, with adequate protein and calorie-dense fat.
- Return total grams for carbs, protein, and fat.

### Meal split

Split the daily target across:

- Breakfast
- Lunch
- Dinner
- Snacks

The split should emphasize snacks and lunch as practical on-trail fuel while keeping dinner substantial for recovery.

## UI Design

### Header actions

- Place two compact buttons in the existing header controls area.
- Keep the exit-method toggle visible and avoid crowding it on small screens.
- Stack or wrap header actions on narrow viewports.

### Profile drawer

- Present the profile form with labeled numeric inputs.
- Save values immediately into the Zustand store.
- Show short helper copy for units and for the daily pack reduction field.
- Include a small summary row showing whether the profile is complete enough to run the estimator.

### Fuel drawer

- Show an empty state if required profile values are missing.
- Otherwise display:
  - selected day name
  - effective pack weight
  - terrain tier
  - estimated calories burned
  - recommended intake target
  - macro totals
  - meal-by-meal suggested calories and macros
- Add a popover trigger near the calorie estimate for the formula breakdown.

### Calculation popover

- Show the exact day inputs used in the estimate:
  - body weight
  - starting pack weight
  - daily pack reduction
  - completed prior days
  - effective pack weight
  - distance
  - ascent
  - descent
  - estimated hiking time
  - terrain tier and multiplier
- Show the formula sections in plain language, not as opaque jargon.

## Validation and Edge Cases

- Clamp numeric inputs to sensible non-negative minimums.
- Treat incomplete profile data as not ready rather than guessing hidden defaults for the user.
- Never allow effective pack weight below zero.
- Ensure side-trip toggles update the fuel drawer immediately because they change the selected day totals.
- Ensure ferry versus walk mode changes the selected-day position logic only through the active itinerary ordering.

## Testing Expectations

- Add unit tests for:
  - effective pack weight reduction
  - terrain tier classification
  - calorie and macro output stability
- Add store tests or component tests confirming profile persistence behavior.
- Add UI tests for:
  - opening and editing the profile drawer
  - showing the missing-profile empty state
  - rendering a selected-day estimate
  - showing the calculation popover breakdown
