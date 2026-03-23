# Itinerary Selection Rail Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the selected day indicator match the rounded itinerary card instead of appearing as a square full-height bar.

**Architecture:** Keep the existing left-edge selection accent in `components/day-card.tsx`, but inset it from the card edges and give it rounded ends. Add a focused test assertion that locks in the new indicator classes on the selected day.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock in the rounded selected rail with a test

**Files:**
- Modify: `components/day-card.test.tsx`
- Modify: `components/day-card.tsx`

**Step 1: Write the failing test**

- Add an assertion that the selected day exposes a dedicated selection rail test id.
- Assert the rail uses inset positioning and rounded corners.

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 20.14.0 >/dev/null && pnpm vitest components/day-card.test.tsx`
Expected: FAIL because the current rail has no dedicated test id and still uses the square full-height shape.

**Step 3: Write minimal implementation**

- Add a `data-testid` to the selected rail in `components/day-card.tsx`.
- Change the rail classes to use top/bottom/left inset positioning and rounded corners.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 20.14.0 >/dev/null && pnpm vitest components/day-card.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/day-card.tsx components/day-card.test.tsx docs/plans/2026-03-23-itinerary-selection-rail.md
git commit -m "fix: round itinerary selection rail"
```
