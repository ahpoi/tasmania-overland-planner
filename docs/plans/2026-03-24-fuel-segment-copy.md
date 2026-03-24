# Fuel Segment Copy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the remaining day-based wording in the fuel UI with segment-based wording.

**Architecture:** Update only the visible fuel-related copy in the drawer and calculation breakdown, then refresh the tests that assert those labels. Keep the calculation logic and state model unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library

---

### Task 1: Update fuel drawer copy

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`
- Modify: `components/fuel-plan-drawer.test.tsx`

**Step 1: Write the failing test**

Update the tests to expect segment-based wording in the fuel drawer and note.

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/fuel-plan-drawer.test.tsx`

Expected: FAIL because the component still renders day-based strings.

**Step 3: Write minimal implementation**

Replace visible day-based copy in the drawer with segment-based wording.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/fuel-plan-drawer.test.tsx`

Expected: PASS

### Task 2: Update calculation breakdown labels

**Files:**
- Modify: `components/calculation-breakdown.tsx`
- Modify tests only if needed by existing coverage

**Step 1: Write or extend the failing expectation**

Add or adjust assertions for the changed breakdown label text if it is covered in current tests.

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/fuel-plan-drawer.test.tsx`

Expected: FAIL if the old label is still rendered.

**Step 3: Write minimal implementation**

Change visible labels like `Completed prior days` to `Completed prior segments`.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/fuel-plan-drawer.test.tsx`

Expected: PASS

### Task 3: Final verification

**Files:**
- No planned code changes unless verification finds issues

**Step 1: Run focused checks**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/fuel-plan-drawer.test.tsx`

Expected: PASS

**Step 2: Run the full suite**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test`

Expected: PASS
