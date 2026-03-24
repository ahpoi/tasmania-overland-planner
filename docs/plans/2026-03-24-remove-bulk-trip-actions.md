# Remove Bulk Trip Actions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the `Select Full Trip` and `Clear All` controls from the trip builder and delete the unused bulk-selection store actions.

**Architecture:** Update the page header so the trip builder no longer renders the bulk-action button row, then simplify the Zustand trip store by removing the now-unused action methods. Keep all existing per-segment and per-side-trip selection behavior intact, including persistence and map focus.

**Tech Stack:** Next.js App Router, React, TypeScript, Zustand persist middleware, Vitest, Testing Library

---

### Task 1: Remove bulk-action state APIs

**Files:**
- Modify: `lib/trip-store.ts`
- Modify: `lib/trip-store.test.ts`

**Step 1: Write the failing test**

Update store tests so they no longer expect `selectEntireTrip` or `clearSelections`, and instead verify manual segment toggling remains the supported way to change selections.

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts`

Expected: FAIL because the current tests still reference the bulk helpers.

**Step 3: Write minimal implementation**

Remove:

- `selectEntireTrip`
- `clearSelections`

from the store interface and implementation, plus any now-unused helper logic that only existed for those actions.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts`

Expected: PASS

### Task 2: Remove the bulk-action buttons from the trip-builder header

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`

**Step 1: Write the failing test**

Update the page tests to assert:

- `Select Full Trip` is not rendered
- `Clear All` is not rendered
- the trip-builder header still renders title, description, and exit toggle

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest app/page.test.tsx`

Expected: FAIL because the buttons are still in the UI.

**Step 3: Write minimal implementation**

Remove the button row and clean up any imports or props that only existed for those controls.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest app/page.test.tsx`

Expected: PASS

### Task 3: Final verification

**Files:**
- No planned code changes unless verification finds issues

**Step 1: Run focused regression checks**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts app/page.test.tsx components/day-card.test.tsx`

Expected: PASS

**Step 2: Run the full suite**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test`

Expected: PASS
