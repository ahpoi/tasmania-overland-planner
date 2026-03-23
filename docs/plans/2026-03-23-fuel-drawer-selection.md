# Fuel Drawer Selection Isolation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prevent Fuel Plan drawer interactions from clearing selected side trips on the current day.

**Architecture:** Add a regression test at the day-card level because the bug depends on the React event path from the portal-based drawer back to the clickable card. Then isolate interactions at the drawer content boundary so clicks inside the drawer never bubble to the selected day card beneath it.

**Tech Stack:** Next.js, React, Vaul drawer, Radix accordion, Vitest, Testing Library

---

### Task 1: Reproduce the regression in a component test

**Files:**
- Modify: `components/day-card.test.tsx`

**Step 1: Write the failing test**

Add a test that:
- renders day 1 inside `TripProvider`
- selects the Cradle Mountain Summit side trip
- opens the Fuel Plan drawer
- clicks the `Calculation breakdown` accordion trigger
- expects the side-trip checkbox to remain checked

**Step 2: Run test to verify it fails**

Run: `pnpm test components/day-card.test.tsx`
Expected: FAIL in the new regression test because the accordion click clears the side trip.

### Task 2: Stop drawer interactions from reaching the day card

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`

**Step 1: Write minimal implementation**

Attach event handlers at the drawer content container that stop click or pointer-driven bubbling from reaching `DayCard`.

**Step 2: Run test to verify it passes**

Run: `pnpm test components/day-card.test.tsx`
Expected: PASS, including the new regression test.

### Task 3: Verify nearby behavior still works

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`
- Modify: `components/day-card.test.tsx`

**Step 1: Run focused regression coverage**

Run: `pnpm test components/day-card.test.tsx components/fuel-plan-drawer.test.tsx`
Expected: PASS with existing day-switch behavior intact.
