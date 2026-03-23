# Selected Trip Fuel Trigger Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the Fuel Plan trigger out of the header and into the currently selected trip card.

**Architecture:** Keep the existing fuel drawer content and calculation logic in `components/fuel-plan-drawer.tsx`, but allow the trigger UI to be rendered from `components/day-card.tsx`. The selected day card will own the trigger placement, and the drawer component will stay responsible for profile gating and drawer content.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, Testing Library, Radix Drawer, Zustand

---

### Task 1: Lock the new trigger behavior with tests

**Files:**
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.test.tsx`
- Modify: `components/fuel-plan-drawer.test.tsx`

**Step 1: Write the failing tests**

Add assertions that:
- the header no longer shows the Fuel Plan trigger
- only the selected day card shows the Fuel Plan trigger when the profile is complete
- the drawer still opens from the selected day card trigger

**Step 2: Run test to verify it fails**

Run: `pnpm test app/page.test.tsx components/day-card.test.tsx components/fuel-plan-drawer.test.tsx`
Expected: FAIL because the header still owns the trigger and the day card does not.

**Step 3: Write minimal implementation**

Move trigger rendering to the selected day card and keep profile gating in the drawer component.

**Step 4: Run test to verify it passes**

Run: `pnpm test app/page.test.tsx components/day-card.test.tsx components/fuel-plan-drawer.test.tsx`
Expected: PASS

### Task 2: Refactor the drawer API for trigger composition

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`
- Modify: `components/day-card.tsx`

**Step 1: Write the failing test**

Add or extend a test that proves the selected day trigger still opens the existing drawer and uses the selected day totals.

**Step 2: Run test to verify it fails**

Run: `pnpm test components/day-card.test.tsx`
Expected: FAIL because the trigger is not rendered inside the selected day card yet.

**Step 3: Write minimal implementation**

Allow `FuelPlanDrawer` to accept a custom trigger element and render it with `DrawerTrigger asChild`, then mount it from the selected day card.

**Step 4: Run test to verify it passes**

Run: `pnpm test components/day-card.test.tsx`
Expected: PASS
