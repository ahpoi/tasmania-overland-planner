# Side Trip Elevation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace misleading side-trip overlays in the main elevation chart with branch markers on the day route plus separate mini elevation profiles for selected side trips.

**Architecture:** Simplify the elevation chart data helper so it returns only base-route data and branch markers for the main chart. Extend the elevation card renderer to stack compact side-trip mini charts below the main profile, using each side trip's own `elevationProfile` without remapping it into the day's distance axis.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Recharts, Vitest, Testing Library

---

### Task 1: Update the chart data contract

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.ts`
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.test.ts`

**Step 1: Write the failing test**

Update the existing data-shaping test so it expects:
- a branch marker for the selected side trip
- no overlay data series returned for the main chart
- the main day profile to remain unchanged

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts`
Expected: FAIL because the helper still returns side-trip overlay series.

**Step 3: Write minimal implementation**

- Remove main-chart overlay generation from the helper.
- Keep approximate branch-marker generation.
- Return only the data needed for the base profile and branch markers.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/elevation-chart-data.ts lib/elevation-chart-data.test.ts
git commit -m "refactor: simplify side trip elevation chart data"
```

### Task 2: Render separate mini side-trip profiles

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx`
- Create: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.test.tsx`
- Check: `/Users/ian/Workspace/multidays-hike-australia/lib/overland-data.ts`

**Step 1: Write the failing test**

Create a component test that selects a day with a side trip and expects:
- the main elevation chart to render
- the selected side trip name to appear in a separate mini-profile section
- no main-chart overlay copy or hint that the dashed side-trip line still exists

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/elevation-chart.test.tsx`
Expected: FAIL because the component still renders the side-trip overlay on the main chart and does not render mini profiles.

**Step 3: Write minimal implementation**

- Remove the main-chart side-trip `Line` overlay.
- Keep branch markers on the main chart.
- Render a compact stack of mini charts below the main profile for selected side trips on the active day.
- Show light metadata for each mini chart such as distance and ascent.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/elevation-chart.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/elevation-chart.tsx components/elevation-chart.test.tsx
git commit -m "feat: show side trip elevation in separate mini charts"
```

### Task 3: Re-verify the planner

**Files:**
- No code changes required unless verification reveals issues.

**Step 1: Run focused tests**

Run: `pnpm vitest run lib/elevation-chart-data.test.ts components/elevation-chart.test.tsx app/page.test.tsx components/day-card.test.tsx`
Expected: PASS

**Step 2: Run full test suite**

Run: `pnpm test`
Expected: PASS

**Step 3: Run TypeScript**

Run: `pnpm exec tsc --noEmit`
Expected: PASS

**Step 4: Run production build**

Run: `pnpm build`
Expected: PASS

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: verify side trip elevation redesign"
```

## Notes For Execution

- Keep the mini profiles visually compact to avoid making the sticky rail too tall.
- Do not attempt to infer or simulate a merged route profile on the main chart.
- This workspace is not currently inside a git repository, so commit steps cannot be executed here.
