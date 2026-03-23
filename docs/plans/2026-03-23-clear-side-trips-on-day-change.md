# Clear Side Trips On Day Change Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure changing the selected hiking day also clears any previously selected side trips so the UI and map stay in sync.

**Architecture:** Keep the rule in `TripProvider` so every day-selection path gets the same behavior. Cover it with a component-level test that reproduces the bug through the existing `DayCard` UI.

**Tech Stack:** React 19, Next.js, Vitest, Testing Library

---

### Task 1: Lock in the regression with a test

**Files:**
- Modify: `components/day-card.test.tsx`
- Test: `components/day-card.test.tsx`

**Step 1: Write the failing test**

Add a test that renders two `DayCard` components inside `TripProvider`, selects a side trip on day 1, clicks day 2, and expects the day 1 side trip checkbox to become unchecked.

**Step 2: Run test to verify it fails**

Run: `pnpm test components/day-card.test.tsx`
Expected: FAIL because selected side trips are still preserved after changing day.

### Task 2: Implement the minimal fix

**Files:**
- Modify: `lib/trip-context.tsx`

**Step 3: Write minimal implementation**

Replace direct `setSelectedDay` exposure with a small wrapper that updates the selected day and clears `selectedSideTrips`.

**Step 4: Run tests to verify they pass**

Run: `pnpm test components/day-card.test.tsx`
Expected: PASS

### Task 3: Verify touched behavior

**Files:**
- Test: `components/day-card.test.tsx`
- Test: `app/page.test.tsx`

**Step 5: Run broader verification**

Run: `pnpm test components/day-card.test.tsx app/page.test.tsx`
Expected: PASS
