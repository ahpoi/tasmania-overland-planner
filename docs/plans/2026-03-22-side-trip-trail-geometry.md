# Side Trip Trail Geometry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make selected side trips render as trail-shaped map polylines instead of straight lines.

**Architecture:** Store normalized side-trip geometry in the repo and have the map helper prefer that geometry over synthetic `[junction, destination]` lines. Keep Tasmania Parks as the source for side-trip stats and use OSM-derived geometry only for rendered path shape.

**Tech Stack:** TypeScript, React, Leaflet, Vitest

---

### Task 1: Add Regression Tests For Stored Geometry

**Files:**
- Modify: `lib/side-trip-map-data.test.ts`

**Step 1: Write the failing test**

Add assertions that `buildSideTripPath("cradle-summit")` returns more than 2 points, starts near the intended junction, and ends at the Cradle Mountain waypoint.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/side-trip-map-data.test.ts`
Expected: FAIL because current path helper returns only 2 points.

**Step 3: Write minimal implementation**

Add stored side-trip geometry support in the map data layer.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/side-trip-map-data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/side-trip-map-data.test.ts lib/side-trip-map-data.ts
git commit -m "test: cover side trip trail geometry"
```

### Task 2: Store OSM-Backed Side Trip Polylines

**Files:**
- Create: `lib/side-trip-geometries.ts`

**Step 1: Write the failing test**

Extend the path test to check a second geometry such as `barn-bluff` or `mt-ossa`.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/side-trip-map-data.test.ts`
Expected: FAIL until stored geometry exists for the second route.

**Step 3: Write minimal implementation**

Add normalized lat/lng polyline arrays for the mapped side trips. Keep entries compact but detailed enough to visibly follow the trail.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/side-trip-map-data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/side-trip-geometries.ts lib/side-trip-map-data.test.ts
git commit -m "feat: add side trip trail geometries"
```

### Task 3: Switch Map Rendering To Stored Geometry

**Files:**
- Modify: `lib/side-trip-map-data.ts`
- Modify: `components/track-map.tsx`

**Step 1: Write the failing test**

Add assertions that known side trips use stored geometry and unknown ids still return `null`.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/side-trip-map-data.test.ts`
Expected: FAIL before the helper prefers stored geometry.

**Step 3: Write minimal implementation**

Import the geometry dataset, return that path first, and keep the simplified fallback only if geometry is absent.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/side-trip-map-data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/side-trip-map-data.ts components/track-map.tsx
git commit -m "feat: render trail-shaped side trip paths"
```

### Task 4: Verify Existing Planner Behavior

**Files:**
- Verify: `components/day-card.test.tsx`
- Verify: `components/elevation-chart.test.tsx`
- Verify: `lib/elevation-chart-data.test.ts`
- Verify: `app/page.test.tsx`

**Step 1: Run targeted regression tests**

Run: `pnpm test components/day-card.test.tsx components/elevation-chart.test.tsx lib/elevation-chart-data.test.ts app/page.test.tsx`
Expected: PASS

**Step 2: Run the full suite**

Run: `pnpm test`
Expected: PASS

**Step 3: Commit**

```bash
git add .
git commit -m "chore: verify side trip geometry update"
```
