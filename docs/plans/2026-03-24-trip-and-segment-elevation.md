# Trip And Segment Elevation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate trip-wide elevation from segment-specific elevation so the map shows overall context while the itinerary can reveal one segment elevation at a time.

**Architecture:** Keep the dedicated `elevationSegmentId` UI state to identify the active segment, and keep the elevation data/chart layer able to render either a full selected trip profile or a specific segment profile. For trip mode, extend the chart data to include annotation metadata for labeled segment boundaries and selected side-trip spans so the overlay reads more like a route profile. Update the page layout so the map retains a trip-level elevation toggle while segment elevation moves into one shared bottom sheet controlled by buttons in each segment card.

**Tech Stack:** Next.js App Router, React, Zustand, Vitest, Testing Library, Recharts

---

### Task 1: Add trip-store support for active segment elevation

**Files:**
- Modify: `lib/trip-store.ts`
- Test: `lib/trip-store.test.ts`

**Step 1: Write the failing test**

Add tests that prove:
- toggling a segment elevation target stores that segment id
- toggling the same segment again clears it
- toggling a different segment switches the active segment elevation
- deselecting the active segment clears segment elevation safely

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run lib/trip-store.test.ts`

Expected: FAIL because `elevationSegmentId` and its toggle logic do not exist yet.

**Step 3: Write minimal implementation**

Update `lib/trip-store.ts` to:
- add `elevationSegmentId: number | null` to `TripStateValues`
- add `toggleElevationSegment(segmentId: number)` to the store API
- clear or normalize `elevationSegmentId` when exit mode or selected segments make it invalid
- persist `elevationSegmentId` with the rest of the trip UI state if consistent with current store behavior

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run lib/trip-store.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add lib/trip-store.ts lib/trip-store.test.ts
git commit -m "feat: track active segment elevation panel"
```

### Task 2: Expand elevation data to support segment and full-trip modes

**Files:**
- Modify: `lib/elevation-chart-data.ts`
- Test: `lib/elevation-chart-data.test.ts`

**Step 1: Write the failing test**

Add tests that prove:
- a segment-scoped build returns the selected segment profile with only its matching side trips
- a trip-scoped build stitches all selected segments in order into one continuous trip profile
- trip-scoped output includes selected side trips at the correct segment positions
- trip-scoped output includes annotation metadata for labeled segment boundaries and selected side-trip spans

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts`

Expected: FAIL because only single-day `buildElevationChartData(selectedDay, selectedSideTripIds)` behavior exists today.

**Step 3: Write minimal implementation**

Refactor `lib/elevation-chart-data.ts` to:
- extract reusable helpers for segment stitching
- keep existing segment profile behavior available through a clearer API
- add a trip-wide builder that combines the selected main-track segments in route order and inserts chosen side trips within their owning segment
- return annotation metadata that the chart can use to render subtle segment-boundary lines with endpoint labels and stronger selected side-trip spans with short labels for trip mode

Prefer a small API such as:
- `buildSegmentElevationChartData(dayId, selectedSideTripIds)`
- `buildTripElevationChartData(selectedSegmentIds, selectedSideTripIds)`

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add lib/elevation-chart-data.ts lib/elevation-chart-data.test.ts
git commit -m "feat: support trip and segment elevation profiles"
```

### Task 3: Make the chart component render either trip or segment elevation

**Files:**
- Modify: `components/elevation-chart.tsx`
- Test: `components/elevation-chart.test.tsx`

**Step 1: Write the failing test**

Add tests that prove:
- trip mode renders trip-scoped heading/copy and calls trip chart data logic
- segment mode renders segment-scoped heading/copy and shows the chosen segment label
- segment mode only references side trips belonging to the chosen segment
- trip mode renders labeled segment boundaries and selected side-trip labels when annotation metadata exists

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/elevation-chart.test.tsx`

Expected: FAIL because the component only reads `selectedDay` and assumes one segment profile.

**Step 3: Write minimal implementation**

Update `components/elevation-chart.tsx` to accept explicit props for scope, for example:
- `mode="trip" | "segment"`
- `segmentId?: number`

Use those props to:
- build the right chart data
- render appropriate title/subtitle copy
- render trip-mode labeled boundary annotations for selected segments
- render trip-mode highlighted side-trip spans with short visible labels
- preserve existing compact styling support

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/elevation-chart.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add components/elevation-chart.tsx components/elevation-chart.test.tsx
git commit -m "feat: add trip and segment elevation chart modes"
```

### Task 4: Add segment elevation controls to day cards

**Files:**
- Modify: `components/day-card.tsx`
- Test: `components/day-card.test.tsx`

**Step 1: Write the failing test**

Add tests that prove:
- each day card exposes a `Show Segment Elevation` button
- clicking the button opens that segment in bottom-sheet state without changing map focus by accident
- clicking again hides the active segment elevation sheet
- the active segment button label changes to `Hide Segment Elevation`
- the segment elevation trigger and fuel-plan trigger render as icon-only controls
- both controls keep accessible names

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/day-card.test.tsx`

Expected: FAIL because the button and store integration do not exist yet.

**Step 3: Write minimal implementation**

Update `components/day-card.tsx` to:
- read `elevationSegmentId` and `toggleElevationSegment` from the store
- render a segment elevation button in the header controls
- stop propagation on that button so card clicks still belong to map focus
- convert the segment elevation and fuel-plan triggers to icon-only controls
- preserve their current `aria-label`s
- keep current fuel-plan behavior intact

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/day-card.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add components/day-card.tsx components/day-card.test.tsx
git commit -m "feat: add segment elevation controls to day cards"
```

### Task 5: Restructure planner layout for segment elevation bottom sheet and map trip elevation

**Files:**
- Modify: `app/page.tsx`
- Test: `app/page.test.tsx`

**Step 1: Write the failing test**

Add tests that prove:
- the itinerary column no longer renders the inline shared segment elevation panel
- a shared bottom sheet renders segment elevation only when a segment elevation is active
- the map area keeps a `Show Trip Elevation` toggle for overall trip elevation
- the desktop map no longer uses the old segment-elevation overlay behavior
- the mobile map sheet still exposes trip-level elevation, not the segment panel
- closing the segment elevation sheet clears `elevationSegmentId`

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/page.test.tsx`

Expected: FAIL because the current page still renders segment elevation inline in the itinerary column instead of in a shared bottom sheet.

**Step 3: Write minimal implementation**

Update `app/page.tsx` to:
- manage a local `showTripElevation` toggle for the map area
- render `ElevationChart mode="trip"` in the map area when enabled
- remove the old segment-elevation overlay wiring
- render a shared bottom sheet that contains `ElevationChart mode="segment"` when `elevationSegmentId` is set
- clear `elevationSegmentId` when the bottom sheet closes
- keep mobile layout aligned with the same scope split

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/page.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: separate trip and segment elevation panels"
```

### Task 6: Run focused verification

**Files:**
- Modify: none unless a failing test reveals an issue

**Step 1: Run the targeted suite**

Run:

```bash
pnpm vitest run \
  lib/trip-store.test.ts \
  lib/elevation-chart-data.test.ts \
  components/elevation-chart.test.tsx \
  components/day-card.test.tsx \
  app/page.test.tsx
```

Expected: PASS

**Step 2: Run the broader affected UI tests**

Run:

```bash
pnpm vitest run components/track-map.test.ts
```

Expected: PASS, confirming the map focus behavior still works after the elevation split.

**Step 3: Commit**

```bash
git add .
git commit -m "test: verify trip and segment elevation workflow"
```
