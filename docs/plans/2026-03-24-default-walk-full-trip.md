# Default Walk Full Trip Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make first load default to walk mode with all seven main-track segments selected and no side trips selected.

**Architecture:** Update the default trip-store state only, leaving persistence behavior intact so saved preferences still win after rehydration. Then adjust the store and page tests so their first-load expectations match the new walk-mode default.

**Tech Stack:** Next.js App Router, React, TypeScript, Zustand persist middleware, Vitest, Testing Library

---

### Task 1: Update the default trip-store state

**Files:**
- Modify: `lib/trip-store.ts`
- Modify: `lib/trip-store.test.ts`

**Step 1: Write the failing test**

Update store tests so they expect:

- `exitMethod` defaults to `walk`
- `selectedSegmentIds` defaults to `[1,2,3,4,5,6,7]`
- `focusedSegmentId` remains `1`
- side trips remain empty

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts`

Expected: FAIL because the current defaults still use ferry mode and six selected segments.

**Step 3: Write minimal implementation**

Update `defaultTripState` to use walk mode and all seven segments.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts`

Expected: PASS

### Task 2: Update planner expectations for first load

**Files:**
- Modify: `app/page.test.tsx`

**Step 1: Write the failing test**

Adjust the page-level first-load assertions so they expect:

- walk mode active by default
- segment 7 available and selected

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest app/page.test.tsx`

Expected: FAIL because the UI expectations still reflect ferry mode defaults.

**Step 3: Write minimal implementation**

Only if needed, adjust any derived first-load logic so the UI correctly reflects the new store defaults.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest app/page.test.tsx`

Expected: PASS

### Task 3: Final verification

**Files:**
- No planned code changes unless verification finds issues

**Step 1: Run focused checks**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts app/page.test.tsx`

Expected: PASS

**Step 2: Run full suite**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test`

Expected: PASS
