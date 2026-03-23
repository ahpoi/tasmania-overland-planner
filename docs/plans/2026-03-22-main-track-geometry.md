# Main Track Geometry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Overland Track map so the main route and day highlights follow stored trail geometry instead of a simplified straightened polyline.

**Architecture:** Store full-route OSM-backed geometry in a dedicated module and add day slice boundaries that reference the full route. Update the map to render the full stored route and derive highlighted day segments from those slices.

**Tech Stack:** TypeScript, React, Leaflet, Vitest

---

### Task 1: Add geometry regression tests

**Files:**
- Create: `lib/main-track-map-data.test.ts`

**Step 1: Write the failing test**

Add tests that assert the full main route has more than 20 points, Day 1 and Day 7 slices both return more than 2 points, and Day 7 ends near Cynthia Bay.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: FAIL because no main-track geometry helper exists yet.

**Step 3: Write minimal implementation**

Create a main-track geometry helper and data module.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: PASS

### Task 2: Store full-route geometry and day slice boundaries

**Files:**
- Create: `lib/main-track-geometry.ts`
- Create: `lib/main-track-map-data.ts`

**Step 1: Write the failing test**

Extend the geometry test to check exact start/end points for the full route and a valid Day 7 slice.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: FAIL until the full route data exists.

**Step 3: Write minimal implementation**

Store the OSM-backed route polyline and day slice boundaries in a local module, then expose helpers for the full route and per-day segments.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: PASS

### Task 3: Switch the map to stored main-route geometry

**Files:**
- Modify: `components/track-map.tsx`
- Modify: `lib/overland-data.ts`

**Step 1: Write the failing test**

Use the geometry helper test to assert the rendered data source no longer depends on the simplified line.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: FAIL until the map helper is integrated.

**Step 3: Write minimal implementation**

Render the full route from stored geometry and highlight the selected day from the stored day slice helper.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: PASS

### Task 4: Verify regressions

**Files:**
- Verify: `components/day-card.test.tsx`
- Verify: `components/elevation-chart.test.tsx`
- Verify: `lib/elevation-chart-data.test.ts`
- Verify: `lib/side-trip-map-data.test.ts`
- Verify: `lib/overland-data.test.ts`
- Verify: `app/page.test.tsx`

**Step 1: Run focused regression tests**

Run: `pnpm test components/day-card.test.tsx components/elevation-chart.test.tsx lib/elevation-chart-data.test.ts lib/side-trip-map-data.test.ts lib/overland-data.test.ts app/page.test.tsx`
Expected: PASS

**Step 2: Run the full suite**

Run: `pnpm test`
Expected: PASS
