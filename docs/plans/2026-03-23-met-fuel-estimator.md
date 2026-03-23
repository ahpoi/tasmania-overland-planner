# MET Fuel Estimator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the selected-day fuel estimator with a MET-based calorie model and update the drawer breakdown to explain the logic in plain language.

**Architecture:** Keep the existing drawer contract for calories, macros, meals, and pack weight, but replace the internals of `lib/fuel-estimator.ts` with a composite MET calculation. Update the breakdown payload and `components/calculation-breakdown.tsx` together so the UI reflects the new model exactly. Use tests first for both the estimator and the breakdown copy.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, Testing Library

---

### Task 1: Add failing estimator tests for MET behavior

**Files:**
- Modify: `lib/fuel-estimator.test.ts`

**Step 1: Write the failing test**

Add tests covering:
- final MET increases when pack, ascent, descent, or duration increase
- estimated calories use `MET x weight x hours`
- intake factor is returned in the breakdown

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/fuel-estimator.test.ts`
Expected: FAIL because the breakdown and formula are still based on the old heuristic.

**Step 3: Write minimal implementation**

- Replace the old calorie component model with a composite MET model.
- Return the new MET-oriented breakdown fields.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/fuel-estimator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/fuel-estimator.ts lib/fuel-estimator.test.ts
git commit -m "feat: switch fuel estimator to MET model"
```

### Task 2: Add failing breakdown UI tests for explanation copy

**Files:**
- Modify: `components/fuel-plan-drawer.test.tsx`
- Modify: `components/calculation-breakdown.tsx`

**Step 1: Write the failing test**

Add UI assertions covering:
- the breakdown mentions MET explicitly
- the breakdown shows the calories equation in plain language
- the breakdown shows the intake factor and policy wording

**Step 2: Run test to verify it fails**

Run: `pnpm test components/fuel-plan-drawer.test.tsx`
Expected: FAIL because the UI still renders the old “base burn + loads” explanation.

**Step 3: Write minimal implementation**

- Update the breakdown component to render MET-based equations and component values.
- Keep the visual structure aligned with the existing drawer UI.

**Step 4: Run test to verify it passes**

Run: `pnpm test components/fuel-plan-drawer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/calculation-breakdown.tsx components/fuel-plan-drawer.test.tsx
git commit -m "feat: explain MET fuel estimate breakdown"
```

### Task 3: Run focused regression verification

**Files:**
- Modify: `lib/fuel-estimator.ts`
- Modify: `lib/fuel-estimator.test.ts`
- Modify: `components/calculation-breakdown.tsx`
- Modify: `components/fuel-plan-drawer.test.tsx`

**Step 1: Run the focused test suite**

Run: `pnpm test lib/fuel-estimator.test.ts components/fuel-plan-drawer.test.tsx`
Expected: PASS

**Step 2: Refactor names and copy if needed**

- Clean up MET field names if test output shows confusing wording.
- Keep all tests green.

**Step 3: Re-run the focused test suite**

Run: `pnpm test lib/fuel-estimator.test.ts components/fuel-plan-drawer.test.tsx`
Expected: PASS

**Step 4: Commit**

```bash
git add lib/fuel-estimator.ts lib/fuel-estimator.test.ts components/calculation-breakdown.tsx components/fuel-plan-drawer.test.tsx docs/plans/2026-03-23-met-fuel-estimator-design.md docs/plans/2026-03-23-met-fuel-estimator.md
git commit -m "feat: adopt MET-based fuel estimation"
```
