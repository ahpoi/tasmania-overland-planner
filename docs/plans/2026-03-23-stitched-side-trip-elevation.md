# Stitched Side-Trip Elevation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the elevation chart stitch selected side trips into the main day profile so the chart distance and peak elevation expand to reflect the planned walking route for that day.

**Architecture:** Keep the change local to the elevation feature by replacing the current `mainProfile + branchMarkers` data model with a stitched profile builder in `lib/elevation-chart-data.ts`. The chart component will continue to render a single main profile, but that profile will now represent the base day route with each selected side trip inserted at its branch point in route order.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library, Recharts

---

### Task 1: Lock the stitched profile data contract with tests

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.test.ts`
- Reference: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.ts`
- Reference: `/Users/ian/Workspace/multidays-hike-australia/lib/overland-data.ts`

**Step 1: Write the failing tests**

Add tests that assert:

```ts
it("returns the unchanged base profile when no side trips are selected", () => {
  const chartData = buildElevationChartData(1, [])

  expect(chartData.profile).toEqual(elevationProfiles[1])
  expect(chartData.maxDistance).toBe(10.7)
})

it("stitches Barn Bluff into the Day 1 profile and extends chart distance", () => {
  const chartData = buildElevationChartData(1, ["barn-bluff"])

  expect(chartData.maxDistance).toBeCloseTo(17.7, 5)
  expect(chartData.maxElevation).toBeGreaterThanOrEqual(1559)
  expect(chartData.profile.at(-1)?.distance).toBeCloseTo(17.7, 5)
})

it("stitches multiple selected side trips in route order", () => {
  const chartData = buildElevationChartData(1, ["barn-bluff", "cradle-summit"])
  const summitPoint = chartData.profile.find((point) => point.elevation === 1545)
  const bluffPoint = chartData.profile.find((point) => point.elevation === 1559)

  expect(summitPoint?.distance).toBeLessThan(bluffPoint?.distance ?? Number.POSITIVE_INFINITY)
  expect(chartData.maxDistance).toBeCloseTo(19.7, 5)
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts`

Expected: FAIL because the current helper returns `mainProfile` and `branchMarkers` instead of a stitched `profile`.

**Step 3: Commit**

```bash
git add lib/elevation-chart-data.test.ts
git commit -m "test: define stitched elevation profile behavior"
```

### Task 2: Implement stitched elevation chart data

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.ts`
- Reference: `/Users/ian/Workspace/multidays-hike-australia/lib/overland-data.ts`
- Test: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.test.ts`

**Step 1: Write the minimal implementation**

Implement helper logic that:

```ts
type ElevationChartPoint = {
  distance: number
  elevation: number
}

function sliceMainProfile(
  profile: ElevationChartPoint[],
  startDistance: number,
  endDistance: number
): ElevationChartPoint[] {
  // Return the portion of the base route between two distances,
  // including interpolated boundary points when needed.
}

export function buildElevationChartData(selectedDay: number, selectedSideTripIds: string[]) {
  // 1. Load the base profile for the selected day.
  // 2. Find selected side trips for that day and sort by branch distance.
  // 3. Copy the base route up to each branch point.
  // 4. Insert the side trip's own elevationProfile with distance offset.
  // 5. Resume the base profile from the same branch point onward.
  // 6. Return a single stitched `profile` plus min/max chart bounds.
}
```

**Step 2: Run tests to verify they pass**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts`

Expected: PASS

**Step 3: Commit**

```bash
git add lib/elevation-chart-data.ts lib/elevation-chart-data.test.ts
git commit -m "feat: stitch side trips into elevation chart data"
```

### Task 3: Update the chart component to use the stitched profile

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx`
- Test: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.test.tsx`
- Reference: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.ts`

**Step 1: Write the failing component test**

Replace the current mini-profile expectation with assertions like:

```tsx
it("renders a single stitched elevation chart for selected side trips", async () => {
  render(
    <TripProvider>
      <ChartScenario />
    </TripProvider>
  )

  expect(await screen.findByText(/planned route/i)).toBeVisible()
  expect(screen.queryByText(/mini profile/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/Orange markers show/i)).not.toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/elevation-chart.test.tsx`

Expected: FAIL because the component still renders branch-marker copy and mini profiles.

**Step 3: Write the minimal implementation**

Update the component to:

```tsx
const chartData = buildElevationChartData(selectedDay, selectedSideTrips)

<ComposedChart data={chartData.profile}>
  <Area dataKey="elevation" name="Planned Route" />
</ComposedChart>
```

Also:
- remove branch marker rendering
- remove the side-trip mini-profile stack
- update the subtitle to clarify that selected side trips extend the displayed route

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/elevation-chart.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add components/elevation-chart.tsx components/elevation-chart.test.tsx
git commit -m "feat: show stitched planned route in elevation chart"
```

### Task 4: Verify planner behavior end-to-end

**Files:**
- Reference: `/Users/ian/Workspace/multidays-hike-australia/app/page.tsx`
- Reference: `/Users/ian/Workspace/multidays-hike-australia/app/page.test.tsx`
- Reference: `/Users/ian/Workspace/multidays-hike-australia/components/day-card.test.tsx`

**Step 1: Run targeted regression tests**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts components/elevation-chart.test.tsx app/page.test.tsx components/day-card.test.tsx`

Expected: PASS

**Step 2: Run broader verification**

Run: `pnpm vitest run`

Expected: PASS

**Step 3: Run production verification**

Run: `pnpm build`

Expected: successful Next.js production build

**Step 4: Commit**

```bash
git add .
git commit -m "chore: verify stitched elevation route update"
```
