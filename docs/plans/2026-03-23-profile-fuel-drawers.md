# Profile and Fuel Drawers Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a persisted user profile drawer and a selected-day fuel planning drawer in the header, with inspectable estimate math driven by the current itinerary state.

**Architecture:** Keep trip selection and day totals in the existing trip context, add a dedicated Zustand profile store for persisted user inputs, and centralize all calorie and macro calculations in a pure utility module. The header drawers should stay presentational and read derived data from the context plus the store so the logic remains testable.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zustand, Vitest, Testing Library, shadcn/ui primitives

---

### Task 1: Add Zustand and create the persisted profile store

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `lib/user-profile-store.ts`
- Test: `lib/user-profile-store.test.ts`

**Step 1: Write the failing test**

Create `lib/user-profile-store.test.ts` covering:
- default profile values
- updating a field
- resetting the profile if a reset action is included
- persistence key shape if practical to assert in jsdom

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/user-profile-store.test.ts`
Expected: FAIL because the store file and dependency do not exist yet.

**Step 3: Write minimal implementation**

- Add `zustand` to dependencies.
- Create a persisted store with fields:
  - `heightCm`
  - `weightKg`
  - `age`
  - `startingPackWeightKg`
  - `dailyPackReductionKg`
- Add actions to update individual fields and optionally reset.
- Configure `persist` with a stable local storage key.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/user-profile-store.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml lib/user-profile-store.ts lib/user-profile-store.test.ts
git commit -m "feat: add persisted user profile store"
```

### Task 2: Add pure selected-day fuel estimation utilities

**Files:**
- Create: `lib/fuel-estimator.ts`
- Test: `lib/fuel-estimator.test.ts`

**Step 1: Write the failing test**

Create `lib/fuel-estimator.test.ts` covering:
- effective pack weight decreases by completed prior days
- pack weight never drops below zero
- side-trip-inclusive day totals produce higher estimates than the base day alone
- terrain classification matches representative easy and demanding sample days
- returned meal plan totals sum back to the daily intake target within rounding tolerance

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/fuel-estimator.test.ts`
Expected: FAIL because the estimator module does not exist yet.

**Step 3: Write minimal implementation**

- Define input/output types.
- Implement:
  - completed-days calculation helper input contract
  - effective pack weight logic
  - terrain score and tier classification
  - calorie burn estimate
  - intake target
  - macro targets
  - meal split
  - formula breakdown structure for the popover

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/fuel-estimator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/fuel-estimator.ts lib/fuel-estimator.test.ts
git commit -m "feat: add selected-day fuel estimator"
```

### Task 3: Extend trip context with selected-day itinerary position helpers

**Files:**
- Modify: `lib/trip-context.tsx`
- Test: `app/page.test.tsx`

**Step 1: Write the failing test**

Add or extend a test to verify:
- the active itinerary changes when ferry versus walk changes
- the selected day exposes the correct completed prior day count for the estimator

**Step 2: Run test to verify it fails**

Run: `pnpm test app/page.test.tsx`
Expected: FAIL because the new helper is not available yet.

**Step 3: Write minimal implementation**

- Add a helper such as `getSelectedDayIndex()` or `getDayPosition(dayId)`.
- Keep side-trip clearing behavior unchanged.
- Ensure the helper derives from `getActiveDays()` instead of hard-coded ids.

**Step 4: Run test to verify it passes**

Run: `pnpm test app/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/trip-context.tsx app/page.test.tsx
git commit -m "feat: expose selected day position helpers"
```

### Task 4: Build the profile drawer UI in the header

**Files:**
- Create: `components/user-profile-drawer.tsx`
- Modify: `app/page.tsx`
- Test: `components/user-profile-drawer.test.tsx`

**Step 1: Write the failing test**

Create `components/user-profile-drawer.test.tsx` covering:
- opening the drawer
- editing fields
- reflecting saved values after rerender
- showing units and helper copy

**Step 2: Run test to verify it fails**

Run: `pnpm test components/user-profile-drawer.test.tsx`
Expected: FAIL because the component does not exist yet.

**Step 3: Write minimal implementation**

- Build a drawer using existing UI primitives.
- Render numeric form fields for all profile inputs.
- Wire inputs to the Zustand store.
- Add a compact summary or readiness state.
- Add the trigger to the header without breaking the existing exit toggle layout.

**Step 4: Run test to verify it passes**

Run: `pnpm test components/user-profile-drawer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/user-profile-drawer.tsx app/page.tsx components/user-profile-drawer.test.tsx
git commit -m "feat: add profile drawer to header"
```

### Task 5: Build the selected-day fuel drawer and calculation popover

**Files:**
- Create: `components/calculation-popover.tsx`
- Create: `components/fuel-plan-drawer.tsx`
- Modify: `app/page.tsx`
- Test: `components/fuel-plan-drawer.test.tsx`

**Step 1: Write the failing test**

Create `components/fuel-plan-drawer.test.tsx` covering:
- missing-profile empty state
- selected-day estimate rendering with known mock data
- calculation popover opening and showing the formula breakdown
- effective pack weight changing when the selected day changes

**Step 2: Run test to verify it fails**

Run: `pnpm test components/fuel-plan-drawer.test.tsx`
Expected: FAIL because the drawer and popover do not exist yet.

**Step 3: Write minimal implementation**

- Build the fuel drawer with:
  - selected day header
  - terrain badge or label
  - calorie estimate
  - intake target
  - macro totals
  - meal split rows
- Add the popover trigger and render the structured breakdown returned by the estimator.
- Add the trigger into the header actions next to the profile drawer.

**Step 4: Run test to verify it passes**

Run: `pnpm test components/fuel-plan-drawer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/calculation-popover.tsx components/fuel-plan-drawer.tsx app/page.tsx components/fuel-plan-drawer.test.tsx
git commit -m "feat: add selected-day fuel planning drawer"
```

### Task 6: Integrate the estimator with live itinerary state

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`
- Modify: `components/day-card.test.tsx`
- Modify: `app/page.test.tsx`

**Step 1: Write the failing test**

Extend an integration-style test that:
- selects a day
- toggles a side trip
- opens the fuel drawer
- verifies calories or terrain tier update accordingly

**Step 2: Run test to verify it fails**

Run: `pnpm test app/page.test.tsx components/day-card.test.tsx`
Expected: FAIL because the fuel drawer is not yet wired to live itinerary changes.

**Step 3: Write minimal implementation**

- Connect the fuel drawer to `useTrip()` day totals and side-trip state.
- Use the selected day position helper to compute completed prior days.
- Ensure toggling side trips causes the estimate and popover details to update immediately.

**Step 4: Run test to verify it passes**

Run: `pnpm test app/page.test.tsx components/day-card.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/fuel-plan-drawer.tsx components/day-card.test.tsx app/page.test.tsx
git commit -m "feat: connect fuel planning to itinerary state"
```

### Task 7: Run full verification and polish copy

**Files:**
- Modify: any files touched above as needed for final polish

**Step 1: Run targeted tests**

Run: `pnpm test lib/user-profile-store.test.ts lib/fuel-estimator.test.ts components/user-profile-drawer.test.tsx components/fuel-plan-drawer.test.tsx app/page.test.tsx components/day-card.test.tsx`
Expected: PASS

**Step 2: Run the full suite**

Run: `pnpm test`
Expected: PASS

**Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS

**Step 4: Manually verify in the app**

Run: `pnpm dev`
Check:
- header actions fit on mobile and desktop
- profile values persist after refresh
- fuel drawer reflects selected day
- side-trip toggles change the estimate
- popover content is readable

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add header profile and fuel planning experience"
```
