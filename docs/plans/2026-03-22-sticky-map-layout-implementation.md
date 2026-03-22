# Sticky Map Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update the planner so desktop uses a stronger sticky right rail with map-over-elevation, mobile uses a drag-to-dismiss drawer, selected side trips are easier to toggle, and the elevation chart shows where each selected side trip branches from the day route.

**Architecture:** Keep the existing page-level composition in `app/page.tsx`, but swap the mobile map container from `Sheet` to `Drawer` and tighten the desktop sticky rail sizing. Refactor the elevation chart to derive richer display data for base-route segments, branch markers, and side-trip overlays. Improve `DayCard` so the entire side-trip row toggles selection without interfering with day selection.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Recharts, Vaul drawer, Radix checkbox

---

### Task 1: Add minimal test tooling for component behavior

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/package.json`
- Create: `/Users/ian/Workspace/multidays-hike-australia/vitest.config.ts`
- Create: `/Users/ian/Workspace/multidays-hike-australia/test/setup.ts`

**Step 1: Write the failing test**

Create a simple smoke test file later in Tasks 2 and 3 that imports a component and uses a DOM environment. The test should fail first because no test runner is configured yet.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run`
Expected: command fails because Vitest and the jsdom test environment are not configured.

**Step 3: Write minimal implementation**

- Add `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/user-event` as dev dependencies.
- Add a `test` script to `package.json`.
- Configure `vitest.config.ts` with a jsdom environment and setup file.
- Add `test/setup.ts` for Testing Library setup.

**Step 4: Run test to verify it passes**

Run: `pnpm install` then `pnpm vitest run`
Expected: the runner starts successfully, even if later task-specific tests still fail.

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts test/setup.ts
git commit -m "test: add vitest setup for planner ui"
```

### Task 2: Cover the side-trip row toggle interaction

**Files:**
- Create: `/Users/ian/Workspace/multidays-hike-australia/components/day-card.test.tsx`
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/day-card.tsx`
- Check: `/Users/ian/Workspace/multidays-hike-australia/lib/trip-context.tsx`

**Step 1: Write the failing test**

Write a test that renders a selected day card inside `TripProvider`, clicks the side-trip row text area instead of the checkbox control, and expects the row to toggle into the selected state. Add another assertion that clicking the side-trip row does not collapse or deselect the day card.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/day-card.test.tsx`
Expected: FAIL because only the checkbox toggles the side trip today.

**Step 3: Write minimal implementation**

- Make each side-trip row keyboard- and pointer-accessible.
- Toggle selection when the row container is activated.
- Preserve checkbox semantics and checked state.
- Stop propagation so row interaction does not trigger the parent day-card click handler.
- Strengthen the selected styling enough to make state changes obvious.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/day-card.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/day-card.tsx components/day-card.test.tsx
git commit -m "feat: improve side trip toggle hit area"
```

### Task 3: Cover elevation chart branch-point rendering

**Files:**
- Create: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.test.tsx`
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx`
- Optional Create: `/Users/ian/Workspace/multidays-hike-australia/lib/elevation-chart-data.ts`

**Step 1: Write the failing test**

Write a test for the chart data shaping logic that selects a day with side trips, enables one side trip, and expects:
- the main day profile to remain intact
- a branch marker to exist at the side-trip start location
- side-trip points to be tagged with the selected side-trip name
- side-trip points to appear near the branch distance rather than only after the full day distance

If the chart logic is hard to test inside the component, extract a pure helper and test that helper directly.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/elevation-chart.test.tsx`
Expected: FAIL because the current code appends side-trip data after the end of the base profile and does not expose a branch marker.

**Step 3: Write minimal implementation**

- Add approximate branch distances for each side trip on its day profile.
- Refactor the chart data shaping so selected side trips are inserted as detour overlays at their branch point.
- Add a visible branch marker and compact label treatment.
- Update tooltip labeling for side-trip points.
- Keep the chart readable when no side trips are selected.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/elevation-chart.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/elevation-chart.tsx components/elevation-chart.test.tsx lib/elevation-chart-data.ts
git commit -m "feat: anchor side trips in elevation chart"
```

### Task 4: Replace the mobile sheet with a bottom drawer

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/app/page.tsx`
- Check: `/Users/ian/Workspace/multidays-hike-australia/components/ui/drawer.tsx`

**Step 1: Write the failing test**

Add a component test or focused render test that expects the mobile control to use the drawer primitives instead of the sheet primitives. If a DOM-level assertion is too brittle, test for the drawer handle text and the dialog content structure that only the drawer path renders.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/page.test.tsx`
Expected: FAIL because the current mobile interaction uses `Sheet`.

**Step 3: Write minimal implementation**

- Replace `Sheet` imports and usage with the existing `Drawer` components.
- Keep the trigger button wording and location unless visual polish suggests a small improvement.
- Ensure the drawer content is scrollable and stacks the map over the elevation chart.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: use mobile drawer for map tools"
```

### Task 5: Tighten the desktop sticky rail layout

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/app/page.tsx`
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/track-map.tsx`
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/elevation-chart.tsx`

**Step 1: Write the failing test**

Add a lightweight render test that expects the desktop utility rail wrapper to include the sticky container and both the map and elevation chart in the right-hand layout. If class assertions feel too implementation-specific, test for the rail’s content structure and sticky intent via accessible headings plus a wrapper test id.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/page.test.tsx`
Expected: FAIL because the current layout does not include the updated rail structure or sizing hooks.

**Step 3: Write minimal implementation**

- Adjust the desktop grid proportions if needed.
- Give the sticky rail a viewport-aware height strategy.
- Tune the map and chart container heights so both remain visible in common laptop viewports.
- Keep the left itinerary list scroll-driven and the right rail sticky.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx components/track-map.tsx components/elevation-chart.tsx app/page.test.tsx
git commit -m "feat: refine sticky map and elevation rail"
```

### Task 6: Verify the whole feature set

**Files:**
- No code changes required unless verification exposes issues.

**Step 1: Run focused tests**

Run: `pnpm vitest run components/day-card.test.tsx components/elevation-chart.test.tsx app/page.test.tsx`
Expected: PASS

**Step 2: Run the full test suite**

Run: `pnpm test`
Expected: PASS

**Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS

**Step 4: Run production build**

Run: `pnpm build`
Expected: PASS

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: verify sticky planner interactions"
```

## Notes For Execution

- Use the smallest possible branch-distance mapping that covers the current side trips.
- If Recharts makes mixed series rendering awkward, extract chart data logic into a helper and keep the rendered series simple.
- Do not introduce more responsive states than required for desktop sticky rail plus mobile drawer.
- This workspace is not currently inside a git repository, so the commit steps cannot be executed until the project is opened from a git-backed directory.
