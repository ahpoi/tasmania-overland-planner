# Realistic Fuel Estimator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the coarse fuel estimator with a more realistic profile-aware model and make meal-level calories mathematically consistent.

**Architecture:** Keep the existing drawer contract and UI structure, but rework `lib/fuel-estimator.ts` so it computes a realistic burn estimate from profile-driven resting energy plus hiking effort adjustments. Update the breakdown payload and copy so the drawer honestly explains the new model, and derive meal calories from meal macros instead of a separate calorie split.

**Tech Stack:** Next.js, TypeScript, Vitest, React Testing Library

---

### Task 1: Lock in failing estimator tests

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/fuel-estimator.test.ts`

**Step 1: Write the failing tests**

- Add a test that changing height and age changes the burn estimate for otherwise identical day inputs.
- Add a test that a more demanding terrain tier raises burn for identical time and profile inputs.
- Add a test that each meal calorie value equals `protein * 4 + carbs * 4 + fat * 9`.

**Step 2: Run test to verify it fails**

Run: `pnpm test -- lib/fuel-estimator.test.ts`

Expected: FAIL because the current estimator ignores height and age, ignores the terrain multiplier in burn, and splits meal calories independently from macros.

### Task 2: Implement the realistic estimator

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/fuel-estimator.ts`

**Step 1: Write the minimal implementation**

- Add BMR and resting-calories helpers using Mifflin-St Jeor.
- Replace the final burn calculation with a hybrid model that combines resting hourly energy and hiking effort.
- Apply the terrain multiplier to the hiking effort portion.
- Keep the effective pack weight and day-position logic.
- Derive meal calories from the final meal macros instead of a separate calorie split.

**Step 2: Run the focused tests**

Run: `pnpm test -- lib/fuel-estimator.test.ts`

Expected: PASS

### Task 3: Update the breakdown contract and drawer copy

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/lib/fuel-estimator.ts`
- Modify: `/Users/ian/Workspace/multidays-hike-australia/components/calculation-breakdown.tsx`

**Step 1: Update breakdown data**

- Replace obsolete MET-only fields with the new components needed by the UI.
- Include resting calories, hiking calories, terrain multiplier, and total burn.

**Step 2: Update breakdown rendering**

- Change labels so they match the new estimator exactly.
- Keep the presentation concise and transparent.

**Step 3: Run relevant tests**

Run: `pnpm test -- lib/fuel-estimator.test.ts components/fuel-plan-drawer.test.tsx`

Expected: PASS

### Task 4: Verify full regression safety

**Files:**
- No code changes expected

**Step 1: Run broader checks**

Run: `pnpm test`

Expected: PASS

**Step 2: Review the day 1 output**

- Confirm the day-1 breakdown is internally consistent.
- Confirm meal calories match meal macros.

