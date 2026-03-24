# Trip-Focused Selection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the planner from a single-day itinerary into a persisted trip builder with multi-select main segments, multi-select side trips, and trip-wide map rendering.

**Architecture:** Refactor the Zustand trip store so selection is based on arrays of chosen main segments and side trips instead of a single `selectedDay`. Update the planner UI to render compact selectable trip segments with trip-level controls, then switch map derivation to render all selected route geometry together. Preserve the existing route and side-trip data model where possible so the change is mostly in selection state, derived helpers, and presentation.

**Tech Stack:** Next.js App Router, React, TypeScript, Zustand persist middleware, Vitest, Testing Library, Leaflet

---

### Task 1: Rework trip-store state around trip selections

**Files:**
- Modify: `lib/trip-store.ts`
- Modify: `lib/trip-store.test.ts`
- Check: `lib/overland-data.ts`

**Step 1: Write the failing tests**

Add tests that describe the new store contract:

- default state selects all allowed main segments for the current exit method
- side trips are persisted alongside main segment selections
- switching to `ferry` removes segment `7` if present
- `toggleSegment`, `selectAllSegments`, and `clearSelections` behave correctly
- trip totals sum only selected main segments plus selected side trips

Example expectations:

```ts
expect(useTripStore.getState().selectedSegmentIds).toEqual([1, 2, 3, 4, 5, 6])
expect(useTripStore.getState().selectedSideTrips).toEqual([])
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest lib/trip-store.test.ts`

Expected: FAIL because `selectedSegmentIds` and new helpers do not exist yet.

**Step 3: Write minimal implementation**

Update `lib/trip-store.ts` to:

- replace `selectedDay` with `selectedSegmentIds: number[]`
- persist `selectedSegmentIds`, `selectedSideTrips`, and `exitMethod`
- add helpers for `toggleSegment`, `selectAllSegments`, `clearSelections`, `isSegmentSelected`, `getSelectedSegments`, `areAllSegmentsSelected`
- keep exit-method filtering so `ferry` only allows segments `1-6`
- compute totals from selected segments only

Keep naming close to existing structures so the rest of the app can migrate incrementally.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest lib/trip-store.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add lib/trip-store.ts lib/trip-store.test.ts
git commit -m "refactor: store trip selections by segment"
```

### Task 2: Add trip-wide route geometry helpers

**Files:**
- Modify: `lib/main-track-map-data.ts`
- Modify: `lib/main-track-map-data.test.ts`
- Check: `lib/main-track-geometry.ts`
- Check: `lib/side-trip-map-data.ts`

**Step 1: Write the failing tests**

Add tests for helpers that derive geometry from multiple selected segments:

- returns a combined path for contiguous selections
- returns multiple paths for disjoint selections if needed by rendering
- omits day 7 geometry in ferry mode
- preserves existing single-day helpers only if still needed elsewhere

Example expectation:

```ts
const selectedPaths = getSelectedTrackPaths([1, 2, 3], "walk")
expect(selectedPaths.length).toBe(1)
expect(selectedPaths[0][0]).toEqual([-41.63596, 145.94912])
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest lib/main-track-map-data.test.ts`

Expected: FAIL because multi-segment helpers do not exist yet.

**Step 3: Write minimal implementation**

Extend `lib/main-track-map-data.ts` with helpers such as:

- `getSelectableSegments(exitMethod)`
- `getSelectedTrackPaths(selectedSegmentIds, exitMethod)`
- optionally `getSelectedTrackBoundsInput(...)`

Prefer returning one or more ordered polyline arrays so the map can render all selected main-track geometry without needing UI-specific logic.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest lib/main-track-map-data.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add lib/main-track-map-data.ts lib/main-track-map-data.test.ts
git commit -m "feat: derive multi-segment track geometry"
```

### Task 3: Replace the day-focused planner UI with a trip builder

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.tsx`
- Optionally rename later: `components/day-card.tsx` -> `components/trip-segment-card.tsx`
- Check: `components/fuel-plan-drawer.tsx`
- Check: `lib/overland-data.ts`

**Step 1: Write the failing tests**

Update page-level tests to assert the new UI contract:

- header copy is trip-focused
- segment rows are multi-select instead of single-select
- quick actions like `Select all` and `Clear all` exist
- the page no longer depends on a `selectedDay`
- persisted selection state can drive restored checkboxes

Add focused component tests if needed for the segment row behavior.

Example expectations:

```ts
expect(screen.getByRole("heading", { name: /Trip Builder/i })).toBeVisible()
expect(screen.getByRole("button", { name: /Select all/i })).toBeVisible()
expect(screen.getByLabelText(/Ronny Creek/i)).toBeChecked()
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest app/page.test.tsx components/day-card.test.tsx`

Expected: FAIL because the current UI still renders `Daily Itinerary` and single-day behavior.

**Step 3: Write minimal implementation**

Update the left rail to:

- rename itinerary copy to trip-focused language
- render all main segments as checkbox-style rows
- keep side trips visible as optional add-ons without requiring a currently selected segment
- add `Select all` and `Clear all` controls
- remove `selectedDay`-specific affordances and copy

If `components/day-card.tsx` remains in place for this task, reshape it into a compact selectable segment row first; rename it only if that keeps scope manageable.

Make sure the UI reads clearly as "select the trip pieces you want" instead of "click a day for details."

**Step 4: Run test to verify it passes**

Run: `pnpm vitest app/page.test.tsx components/day-card.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx components/day-card.tsx components/day-card.test.tsx
git commit -m "feat: replace itinerary rail with trip builder"
```

### Task 4: Render the full selected trip on the map

**Files:**
- Modify: `components/track-map.tsx`
- Modify: `components/track-map.test.ts`
- Check: `lib/main-track-map-data.ts`
- Check: `lib/side-trip-map-data.ts`
- Check: `lib/overland-data.ts`

**Step 1: Write the failing tests**

Add tests for map data derivation and rendering behavior:

- map highlights all selected main segments
- map includes all selected side trips
- fit-bounds uses all selected geometry
- no selected-segment state falls back sensibly

If rendering Leaflet directly is awkward in unit tests, keep most assertions around exported helper functions from `components/track-map.tsx`.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest components/track-map.test.ts`

Expected: FAIL because the map still depends on `selectedDayPath`.

**Step 3: Write minimal implementation**

Refactor `components/track-map.tsx` to:

- read `selectedSegmentIds` from the store
- derive selected main-track paths from `lib/main-track-map-data.ts`
- render every selected path at once
- include all selected side-trip polylines
- fit bounds against the entire selected trip composition

Keep the full-track background line if it still helps orientation, but make the selected trip the primary highlighted geometry.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest components/track-map.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add components/track-map.tsx components/track-map.test.ts
git commit -m "feat: show selected trip composition on map"
```

### Task 5: Verify restored state and regression coverage

**Files:**
- Modify as needed: `app/page.test.tsx`
- Modify as needed: `lib/trip-store.test.ts`
- Modify as needed: `components/track-map.test.ts`
- Check: `components/elevation-chart.tsx`
- Check: `lib/elevation-chart-data.ts`

**Step 1: Add final regression tests**

Cover the end-to-end behavior most likely to regress:

- persisted selected segments restore after rehydration
- persisted side trips restore after rehydration
- ferry mode removes invalid segment `7` from restored selections
- any remaining elevation behavior still renders without a `selectedDay`

**Step 2: Run focused suite**

Run: `pnpm vitest lib/trip-store.test.ts lib/main-track-map-data.test.ts components/track-map.test.ts app/page.test.tsx`

Expected: PASS

**Step 3: Run broader verification**

Run: `pnpm test`

Expected: PASS, or if the repo does not define `test`, run `pnpm vitest`

**Step 4: Commit**

```bash
git add app/page.test.tsx lib/trip-store.test.ts components/track-map.test.ts
git commit -m "test: cover trip-focused persisted planner flow"
```

### Notes for Implementation

- Preserve the existing raw route and side-trip content in `lib/overland-data.ts`; only rename displayed labels if needed.
- Be careful with the current dirty worktree. Stage only files touched by this plan.
- If the elevation chart has unavoidable coupling to `selectedDay`, keep the UI functional first and document any temporary trip-wide chart limitation in the implementation notes rather than blocking the map/store migration.
