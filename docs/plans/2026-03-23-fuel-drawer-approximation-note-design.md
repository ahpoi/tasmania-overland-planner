# Fuel Drawer Approximation Note Design

## Goal

Add a visible but calm disclaimer in the Fuel Plan drawer so users understand the numbers are approximate.

## Decision

Use a compact inline note near the top of the drawer content, immediately before the main metric cards. This keeps the disclaimer visible before users interpret the calorie and pack-food figures, without making the drawer feel alarm-heavy.

## Content

The note should clearly say the values are estimates derived from the user's profile, selected day, and active side trips, and that weather, pace, and personal needs can change the real result.

## Validation

- Add a drawer test that opens the Fuel Plan and expects the approximation note to be visible.
- Re-run the focused fuel drawer tests after adding the note.
