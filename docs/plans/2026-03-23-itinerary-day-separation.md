# Itinerary Day Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make each itinerary day easier to scan by separating rows into soft visual blocks.

**Architecture:** Keep the existing flat itinerary panel in `app/page.tsx`, but change the list wrapper from shared dividers to spaced items. Update `DayCard` to render as a lightly bordered, softly tinted block with a stronger selected state so each day reads as its own section without returning to heavy nested cards.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock in the separated itinerary structure with tests

**Files:**
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.test.tsx`

**Step 1: Write the failing tests**

- Add an assertion in `app/page.test.tsx` that the itinerary list wrapper uses vertical spacing instead of shared divide classes.
- Add assertions in `components/day-card.test.tsx` that a day panel renders with rounded corners, a border, and a soft background treatment.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest app/page.test.tsx components/day-card.test.tsx`
Expected: FAIL because the current classes still reflect the flatter divider-based list.

**Step 3: Write minimal implementation**

- Update `app/page.tsx` to replace the dividing wrapper with a spaced stack.
- Update `components/day-card.tsx` to use a soft block container and stronger selected-state styling.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest app/page.test.tsx components/day-card.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx components/day-card.tsx components/day-card.test.tsx docs/plans/2026-03-23-itinerary-day-separation-design.md docs/plans/2026-03-23-itinerary-day-separation.md
git commit -m "feat: separate itinerary day blocks"
```

### Task 2: Verify the planner still behaves as expected

**Files:**
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.test.tsx`

**Step 1: Run the focused verification suite**

Run: `pnpm vitest app/page.test.tsx components/day-card.test.tsx`
Expected: PASS

**Step 2: Review for regressions**

- Confirm the itinerary header remains visible.
- Confirm day selection still works.
- Confirm side-trip interaction still works after the container style changes.

**Step 3: Commit**

```bash
git add app/page.tsx app/page.test.tsx components/day-card.tsx components/day-card.test.tsx
git commit -m "test: verify itinerary separation styling"
```
