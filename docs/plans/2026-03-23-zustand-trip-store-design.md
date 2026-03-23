# Zustand Trip Store Design

**Goal:** Replace the current React `TripProvider` context with a zustand-backed trip store while persisting only the `exitMethod` preference in local storage.

## Context

The current trip state lives in [lib/trip-context.tsx](/Users/ian/Workspace/multidays-hike-australia/lib/trip-context.tsx) and mixes ephemeral UI state with trip-domain helpers. The project already uses persisted zustand state for the user profile in [lib/user-profile-store.ts](/Users/ian/Workspace/multidays-hike-australia/lib/user-profile-store.ts), so trip state can follow the same pattern.

The user wants a full migration to zustand for simpler state management, but only wants `exitMethod` to survive reloads. `selectedDay` and `selectedSideTrips` should remain session-only, while totals and itinerary views continue to be recalculated from the canonical track data.

## Proposed Change

- Create a new zustand store in `lib/trip-store.ts`.
- Move all trip state and actions into the store:
  - `exitMethod`
  - `selectedDay`
  - `selectedSideTrips`
  - `setExitMethod`
  - `setSelectedDay`
  - `toggleSideTrip`
- Keep all derived helpers in the store API so consuming components can keep nearly the same usage:
  - `getDayTotals`
  - `getTripTotals`
  - `getActiveDays`
  - `getDaySideTrips`
  - `getDayPosition`
- Persist only `exitMethod` using zustand `persist` + `partialize`.
- Remove the `TripProvider` wrapper from app and test render paths.

## Behavioral Rules To Preserve

- Changing the selected day clears `selectedSideTrips`.
- Switching from `walk` to `ferry` while Day 7 is selected moves selection back to Day 6 and clears `selectedSideTrips`.
- Day totals and trip totals are always derived from `days`, `sideTrips`, and current selections rather than stored aggregate numbers.

## Testing Strategy

- Add focused store tests for default state, persistence scope, and action behavior.
- Update component and page tests to read from the zustand store directly instead of wrapping with `TripProvider`.
- Verify the page and key trip-driven components still pass with the new state source.
