# Mobile Card Spacing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce stacked mobile padding around the trip builder cards so segment cards feel more compact on narrow screens.

**Architecture:** Keep the existing page and card structure intact and only adjust responsive Tailwind spacing classes at the mobile breakpoint. Add regression tests that assert the intended mobile class names on the itinerary list and card container.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Add regression tests for compact mobile spacing

**Files:**
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.test.tsx`

**Step 1: Write the failing test**

Add assertions that:

- the itinerary list keeps compact mobile gutters via `px-2.5 sm:px-3 lg:px-4`
- the day card content wrapper keeps compact mobile padding via `px-4 py-4 sm:px-5 sm:py-5 lg:px-6`

**Step 2: Run test to verify it fails**

Run: `pnpm test -- app/page.test.tsx components/day-card.test.tsx`

Expected: FAIL because the current mobile spacing classes still use larger base padding.

**Step 3: Write minimal implementation**

Update the responsive class names in:

- `app/page.tsx`
- `components/day-card.tsx`

Only change the mobile spacing values needed for the approved balanced trim.

**Step 4: Run test to verify it passes**

Run: `pnpm test -- app/page.test.tsx components/day-card.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx components/day-card.tsx components/day-card.test.tsx docs/plans/2026-03-24-mobile-card-spacing-design.md docs/plans/2026-03-24-mobile-card-spacing.md
git commit -m "fix: tighten mobile trip card spacing"
```
