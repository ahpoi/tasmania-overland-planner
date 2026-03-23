# Zustand Trip Store Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the React trip context with a zustand trip store and persist only `exitMethod` in local storage.

**Architecture:** Create a single zustand store that owns both trip session state and derived trip helpers. Use zustand `persist` with `partialize` so only `exitMethod` is stored in local storage, while `selectedDay` and `selectedSideTrips` remain in-memory and are recalculated against canonical trip data on each session.

**Tech Stack:** Next.js App Router, React, Zustand, Zustand persist middleware, Vitest, Testing Library, Tailwind CSS

---

### Task 1: Add a trip zustand store test suite

**Files:**
- Create: `lib/trip-store.test.ts`
- Test: `lib/trip-store.test.ts`

**Step 1: Write the failing test**

Add tests that verify:
- the store starts with `exitMethod: "ferry"`, `selectedDay: 1`, and no selected side trips
- changing day clears side trips
- switching to `ferry` while day 7 is selected moves selection to day 6 and clears side trips
- persistence writes only `exitMethod` under the trip storage key

**Step 2: Run test to verify it fails**

Run: `source "$HOME/.nvm/nvm.sh" && nvm use >/dev/null && pnpm test lib/trip-store.test.ts`
Expected: FAIL because `lib/trip-store.ts` and its exported API do not exist yet.

**Step 3: Write minimal implementation**

Create `lib/trip-store.ts` with zustand state, actions, derived helpers, and persisted `exitMethod`.

**Step 4: Run test to verify it passes**

Run: `source "$HOME/.nvm/nvm.sh" && nvm use >/dev/null && pnpm test lib/trip-store.test.ts`
Expected: PASS

### Task 2: Migrate consumers from context to store

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.tsx`
- Modify: `components/day-card.test.tsx`
- Modify: `components/elevation-chart.tsx`
- Modify: `components/elevation-chart.test.tsx`
- Modify: `components/fuel-plan-drawer.tsx`
- Modify: `components/fuel-plan-drawer.test.tsx`
- Modify: `components/track-map.tsx`
- Modify: `lib/trip-context.tsx`

**Step 1: Write the failing migration assertions**

Update existing tests that currently import `TripProvider` or `useTrip` from `lib/trip-context.tsx` so they target the new zustand store API and fail until components are migrated.

**Step 2: Run test to verify it fails**

Run: `source "$HOME/.nvm/nvm.sh" && nvm use >/dev/null && pnpm test app/page.test.tsx components/day-card.test.tsx components/elevation-chart.test.tsx components/fuel-plan-drawer.test.tsx`
Expected: FAIL because components and tests still reference the removed context API.

**Step 3: Write minimal implementation**

Swap `useTrip()` imports to `useTripStore(...)`, remove `TripProvider` wrappers, and replace `lib/trip-context.tsx` with a compatibility shim or remove it if no references remain.

**Step 4: Run test to verify it passes**

Run: `source "$HOME/.nvm/nvm.sh" && nvm use >/dev/null && pnpm test app/page.test.tsx components/day-card.test.tsx components/elevation-chart.test.tsx components/fuel-plan-drawer.test.tsx`
Expected: PASS

### Task 3: Verify the refactor across the trip UI surface

**Files:**
- Modify: `components/track-map.test.ts`
- Check: `lib/trip-store.ts`

**Step 1: Run the targeted verification suite**

Run: `source "$HOME/.nvm/nvm.sh" && nvm use >/dev/null && pnpm test lib/trip-store.test.ts app/page.test.tsx components/day-card.test.tsx components/elevation-chart.test.tsx components/fuel-plan-drawer.test.tsx components/track-map.test.ts`
Expected: PASS

**Step 2: Clean up**

Remove any dead context code and keep exports aligned with actual usage.
