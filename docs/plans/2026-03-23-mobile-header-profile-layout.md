# Mobile Header Profile Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep the mobile header profile trigger beside the title instead of below it.

**Architecture:** Adjust the existing header flex classes in `app/page.tsx` so the brand block and profile trigger share one mobile row. Protect the behavior with a targeted layout assertion in `app/page.test.tsx`.

**Tech Stack:** Next.js, React, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Header layout test

**Files:**
- Modify: `app/page.test.tsx`

**Step 1: Write the failing test**

Add a test that renders `Page`, finds the planner title and profile button, and asserts their shared header container includes `flex-row` and does not include `flex-col`.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/page.test.tsx`
Expected: FAIL because the header container still uses a stacked mobile column layout.

### Task 2: Header layout implementation

**Files:**
- Modify: `app/page.tsx`
- Test: `app/page.test.tsx`

**Step 1: Write minimal implementation**

Update the header wrapper classes so mobile uses a row layout with `items-start`/`justify-between`, give the title block `min-w-0 flex-1`, and keep the profile action wrapper `shrink-0`.

**Step 2: Run test to verify it passes**

Run: `pnpm vitest run app/page.test.tsx`
Expected: PASS with the new mobile header layout assertion green.
