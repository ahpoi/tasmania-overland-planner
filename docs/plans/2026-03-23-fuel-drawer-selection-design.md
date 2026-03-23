# Fuel Drawer Selection Isolation Design

## Goal

Keep selected side trips unchanged while the user interacts with the Fuel Plan drawer, including expanding the calculation breakdown accordion.

## Root Cause

`DayCard` wraps the selected-day content in a clickable section that calls `setSelectedDay(dayId)` on every click. `FuelPlanDrawer` renders its content in a portal, but React synthetic events still bubble through the React tree to the originating `DayCard`. Clicking an accordion trigger inside the drawer therefore re-triggers the selected day card click handler, and `TripProvider` clears `selectedSideTrips` as part of its selected-day change logic.

## Options Considered

1. Stop interaction events at the drawer content boundary.
2. Stop propagation only on accordion triggers and contents.
3. Refactor the day card so only explicit child controls are clickable.

## Decision

Use option 1. The drawer should behave as an isolated interaction surface, and stopping bubbling at the drawer content boundary prevents the entire class of "drawer click mutates underlying page state" bugs without scattering event guards through individual controls.

## Validation

- Add a regression test that selects a side trip, opens the drawer, clicks the calculation breakdown accordion, and confirms the side trip remains selected.
- Re-run the day-card and fuel-drawer tests to ensure intentional side-trip clearing still happens only when switching days.
