# Trip Elevation Label Layout Design

**Goal:** Keep trip boundary labels always visible on desktop without overlapping, while hiding them on mobile where space is too tight.

## Product Direction

The current trip elevation overlay correctly adds route labels, but the labels are positioned by marker center alone. When two boundary markers land close together, the labels collide and become hard to read.

The fix should preserve the annotated-route feel instead of removing the labels entirely.

## Recommended Approach

Use a collision-aware desktop label rail and hide the rail on mobile.

- desktop keeps all selected segment-boundary labels visible
- labels use the existing shortened hut names
- labels can move between two rows when needed to avoid overlap
- labels can shift slightly left or right near edges to stay inside the chart safely
- mobile hides the boundary-label rail entirely

This keeps the desktop chart legible and avoids forcing overly aggressive abbreviations.

## Layout Rules

### Desktop

- render the trip boundary labels in an overlay above the chart
- measure or estimate each label width before assigning its position
- place labels from left to right
- prefer the top row first
- if a label would overlap the previous top-row label, place it on the second row
- if it would also collide there, nudge it horizontally within safe chart bounds
- keep the existing boundary guide lines aligned with the true marker position even if the text itself is nudged slightly

### Mobile

- hide the boundary-label rail entirely
- keep the side-trip span labels only if they already fit within the current mobile treatment
- do not introduce rotated or truncated boundary labels on mobile

## Implementation Notes

The smallest clean change is to compute a presentational label layout array in the chart component:

- input: trip boundary markers and chart width assumptions
- output: `leftPercent`, `rowIndex`, and optional `textAlign`/transform hints for each label

This logic should stay separate from the data builder because the collision behavior is visual layout, not route data.

## Testing

Add or update tests to cover:

- desktop trip mode still renders the expected boundary labels
- closely spaced labels render in separate rows or with layout classes that prove collision handling
- mobile trip mode hides the boundary-label rail

