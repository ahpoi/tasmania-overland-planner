# Realistic Fuel Estimator Design

**Goal:** Improve selected-day fuel guidance so the app separates realistic hiking energy burn from practical food-carry recommendations while keeping the math explainable.

## Problems In The Current Estimator

- Meal rows are internally inconsistent because calories are split independently from macros.
- The terrain label is calculated but does not affect the burn estimate.
- Height and age are collected but unused.
- The current model is a coarse custom MET heuristic, which makes the output harder to trust.

## Decision

Replace the current custom burn heuristic with a simple hybrid energy model:

- Estimate resting daily energy from the hiker profile using the Mifflin-St Jeor equation.
- Convert that resting estimate into an hourly baseline.
- Add hiking energy from moving body weight plus pack weight across time.
- Add explicit uphill and downhill terrain costs.
- Apply the derived terrain multiplier as a modest roughness adjustment.
- Keep `Recommended food to pack` as a separate policy layer derived from estimated burn.

This is more realistic than the current heuristic without introducing inputs the app does not collect.

## Burn Model

### Resting energy

Use the existing profile inputs:

- weight
- height
- age

Assume male metabolism unless the product later adds a sex field. This assumption should be called out in code comments and UI copy should continue to describe the result as an estimate.

Use:

`BMR = 10 * weightKg + 6.25 * heightCm - 5 * age + 5`

Then derive:

`restingCaloriesPerHour = BMR / 24`

### Hiking energy

Use a hiking MET-style movement estimate driven by:

- effective pack weight
- average hiking time
- ascent rate
- descent rate
- terrain tier

This keeps the existing day and side-trip inputs useful while making the profile matter more directly.

### Terrain costs

Burn should include:

- pack adjustment
- ascent adjustment
- smaller descent adjustment
- modest terrain multiplier

The breakdown should show each of these explicitly.

## Intake Policy

Continue to separate:

- `Estimated burn`: realistic all-in day estimate
- `Recommended food to pack`: practical carry target

Keep a conservative intake factor for now, but present it clearly as a policy rather than pretending it is physiology.

## Meal Logic

Meals should be allocated by macro grams first. Meal calories must then be derived from meal macros:

`mealCalories = protein * 4 + carbs * 4 + fat * 9`

This guarantees every meal card is internally consistent.

## Testing

Add tests to verify:

- profile inputs materially affect estimated burn
- terrain multiplier changes the burn output
- meal calories match their displayed macros
- daily meal totals still match daily macro totals
- day 1 still computes effective pack weight correctly
