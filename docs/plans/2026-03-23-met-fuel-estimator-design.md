# MET Fuel Estimator Design

**Goal:** Replace the custom calorie heuristic with a MET-based hiking estimator and expose the calculation logic in plain language inside the selected-day fuel drawer.

## Decision

Use a composite MET model.

The estimator will no longer build calories from independent calorie add-ons like base burn, distance load, ascent load, and terrain multipliers. Instead, it will calculate a final MET value from hike conditions, then use the standard MET calorie equation:

`estimatedCaloriesBurned = finalMet * bodyWeightKg * hikingHours`

This keeps MET as the core model while still accounting for the inputs the app already collects.

## Formula Shape

Start with a base hiking MET and add explicit adjustments:

- Base hiking MET: fixed baseline for loaded hiking effort.
- Pack adjustment: increases MET as effective pack weight rises.
- Ascent adjustment: increases MET as climbing per hour rises.
- Descent adjustment: smaller increase for downhill effort.
- Duration adjustment: optional bump for longer sustained days.

The result is:

`finalMet = baseMet + packAdjustment + ascentAdjustment + descentAdjustment + durationAdjustment`

Then:

`estimatedCaloriesBurned = round(finalMet * weightKg * hikingHours)`

## Intake Policy

The current unexplained `0.9` intake factor should become an explicit policy in the estimator output and UI. For now, keep the default packing recommendation at 90% of estimated burn, but name it clearly so the UI can explain it as a conservative pack-food target rather than a hidden multiplier.

Recommended naming:

- `intakeFactor`
- `intakePolicyLabel`

## Breakdown UX

The drawer should explain the math in plain language:

- Base hiking MET
- Pack adjustment and why it changed
- Ascent adjustment and why it changed
- Descent adjustment and why it changed
- Duration adjustment if applied
- Final MET
- Calories equation: `MET x body weight x hours`
- Intake equation: `estimated burn x intake factor`

This should replace the current opaque “base burn + loads x terrain multiplier” copy.

## Data Contract

Keep the top-level `FuelPlanResult` shape stable for the drawer where possible:

- `estimatedCaloriesBurned`
- `recommendedIntakeCalories`
- `macros`
- `meals`
- `effectivePackWeightKg`

Change the `breakdown` structure to be MET-oriented so the UI can render the calculation honestly.

## Testing

Add or update tests to verify:

- effective pack weight still decreases by prior day count
- more demanding day inputs produce a higher final MET and calorie estimate
- meal totals still sum to the daily recommendation
- breakdown output includes MET components and intake factor data
- the breakdown UI shows the new MET equation wording
