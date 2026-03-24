# Remove Bulk Trip Actions Design

**Goal:** Remove the `Select Full Trip` and `Clear All` controls from the trip builder and delete the supporting bulk-selection actions from state so selection happens only through segment and side-trip toggles.

## Product Direction

The trip builder should feel direct and manual. Instead of offering high-level bulk actions, the interface should rely on the individual segment and side-trip controls people are already using. This keeps the interaction model simpler and avoids introducing a "reset everything" concept the product no longer wants.

## UI Changes

Remove the secondary action row beneath the trip-builder header:

- remove `Select Full Trip`
- remove `Clear All`

Keep the rest of the header intact:

- trip-builder title and description
- ferry/walk exit toggle

The trip-builder rail should then flow directly from the header into the segment list.

## State Changes

Delete the bulk-action APIs that were only supporting those buttons:

- `selectEntireTrip`
- `clearSelections`

If no other components use them, they should be removed from:

- the store interface
- the store implementation
- any tests that reference them

Other selection behavior should remain unchanged:

- segment checkbox toggles inclusion
- side-trip checkbox toggles inclusion
- persisted selections still restore from local storage

## Testing

Update tests to reflect the simpler header:

- page tests should assert the two buttons are absent
- store tests should stop depending on bulk-action helpers
- any interaction coverage should continue validating manual segment and side-trip selection

## Scope

In scope:

- removing the two buttons
- removing the unused store actions
- updating affected tests

Out of scope:

- changing default selected segments
- changing focus-on-click behavior
- changing persistence rules
