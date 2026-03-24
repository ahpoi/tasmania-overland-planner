# Segment Notes And Trip Overview Design

**Goal:** Let people save notes for each main day segment, keep one overall trip note, and open a trip overview sheet that summarizes the selected route, totals, and trip-level notes.

## Product Direction

The planner already helps people choose segments and side trips, but it still lacks a place to capture planning context. Notes should feel like a natural extension of trip building rather than a separate feature. A hiker should be able to jot down campsite ideas, weather reminders, food plans, and logistics while staying inside the existing selection flow.

The trip-level experience should also provide one place to review the current plan. That overview needs to answer three quick questions:

- which segments are in the trip
- what are the total distance and time ranges
- what notes apply to the whole trip

## Interaction Model

Two note scopes should exist:

- **Segment notes:** one note per main day segment
- **Trip note:** one overall note for the selected trip

Each day card should expose a notes icon button. Clicking it opens a bottom sheet for that segment. The sheet contains the segment name and a textarea for free-form notes.

The header controls near the `Ferry/Walk` switch should expose a `Trip Overview` button. Clicking it opens a shared bottom sheet that combines:

- selected segments in route order
- current trip totals
- the overall trip note textarea

The overview sheet is the single trip-level note entry point. There is no separate top-level notes sheet.

## Persistence And Saving

Notes should live in the existing persisted Zustand trip store so route selections and notes hydrate together from the same local-storage entry.

Add:

- `segmentNotes: Record<number, string>`
- `overallNote: string`

Use debounced writes from the sheet-local draft state into the store. Recommended behavior:

- typing updates local component state immediately
- a `250-400ms` debounce writes the latest text into Zustand
- closing the sheet flushes the latest draft immediately

This avoids a local-storage write on every keystroke while still behaving like auto-save.

## UI Details

### Segment cards

- Add a notes icon button to each main segment card header
- Keep the button separate from the card click target so opening notes does not change map focus accidentally
- Give the button an active visual state when that segment already has a saved note
- Keep the sheet title specific to the active segment

### Trip overview sheet

- Place the trigger beside the trip-level controls in the planner header
- Show selected segments in order using current store helpers
- Present selected segments as an accordion so each one can reveal its saved note without making the sheet overly tall
- Reuse existing trip totals from the store
- Include a textarea for the overall trip note
- Make the drawer content scroll vertically so long trips and notes never disappear below the fold
- Keep the layout compact enough for mobile and desktop bottom sheets

## State And Component Changes

### `lib/trip-store.ts`

- Persist `segmentNotes` and `overallNote`
- Add store actions for updating each note scope

### `components/day-card.tsx`

- Add the segment-notes trigger
- Read whether the segment has a saved note for button styling

### `app/page.tsx`

- Add shared UI state for the active segment-notes sheet
- Add the trip overview trigger and shared bottom sheet
- Manage debounced note drafts and flush on close

## Testing

Add or update tests to cover:

- trip-store defaults for empty notes
- trip-store persistence and hydration for `segmentNotes` and `overallNote`
- segment-card notes trigger rendering and active-state styling when notes exist
- trip overview rendering of selected segments and trip totals
- trip overview accordion rendering of segment notes and empty-state note copy
- trip overview scrollable drawer content
- note text persisting after debounce and on close flush

## Scope

In scope:

- per-segment notes for main day segments
- one overall trip note
- trip overview bottom sheet
- persisted local-storage hydration through the trip store

Out of scope:

- side-trip notes
- markdown or rich-text note editing
- multiple saved trip overviews
- exporting or sharing notes
