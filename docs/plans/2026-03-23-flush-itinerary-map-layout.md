# Flush Itinerary / Map Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Flatten the desktop planner layout so the itinerary days and the map read as continuous surfaces with only the center gutter separating them.

**Architecture:** Keep the existing page structure and interactions, but replace the card-oriented styling with shared-surface containers, divider-based separation, and thinner map chrome. Update the day item component and immersive map shell together so the selected day, legend, and elevation overlay still align correctly.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, shadcn/ui, Vitest, Testing Library

---

### Task 1: Update the planner page shell

**Files:**
- Modify: `app/page.tsx`

**Step 1: Write the failing test**

Review existing page tests to see whether the desktop container classes are asserted directly. If no targeted test exists for this styling-only behavior, do not add a brittle class-name test.

**Step 2: Run test to verify baseline**

Run: `pnpm vitest app/page.test.tsx --run`
Expected: current page tests pass before layout edits.

**Step 3: Write minimal implementation**

- Remove the rounded/padded itinerary section card.
- Keep the itinerary heading row.
- Preserve the desktop grid and sticky map stage.
- Keep the center gutter between itinerary and map.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest app/page.test.tsx --run`
Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: flatten planner page shell"
```

### Task 2: Flatten the day presentation

**Files:**
- Modify: `components/day-card.tsx`
- Test: `components/day-card.test.tsx`

**Step 1: Write the failing test**

Add or adjust a test in `components/day-card.test.tsx` only if needed to protect behavior that could regress while removing the `Card` wrapper, such as selected-day expansion or side-trip toggling.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest components/day-card.test.tsx --run`
Expected: FAIL only if a new behavior assertion was added.

**Step 3: Write minimal implementation**

- Remove `Card` / `CardContent`.
- Build a full-width section with divider-oriented styling.
- Keep selected-day emphasis through border/background treatment rather than shadows and detached card chrome.
- Preserve all click, keyboard, checkbox, and side-trip interactions.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest components/day-card.test.tsx --run`
Expected: PASS

**Step 5: Commit**

```bash
git add components/day-card.tsx components/day-card.test.tsx
git commit -m "feat: flatten itinerary day layout"
```

### Task 3: Make the immersive map edge-to-edge

**Files:**
- Modify: `components/track-map.tsx`
- Test: `app/page.test.tsx`

**Step 1: Write the failing test**

If the immersive map structure changes accessible text or test IDs, update `app/page.test.tsx` with the smallest assertion necessary to preserve intended rendering.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest app/page.test.tsx --run`
Expected: FAIL only if a new or updated assertion was added.

**Step 3: Write minimal implementation**

- Remove the heavy immersive card shell.
- Keep the map meta row and legend as thin attached bars.
- Ensure the map canvas fills the sticky height cleanly.
- Preserve elevation overlay integration and immersive sizing behavior.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest app/page.test.tsx --run`
Expected: PASS

**Step 5: Commit**

```bash
git add components/track-map.tsx app/page.test.tsx
git commit -m "feat: make planner map edge to edge"
```

### Task 4: Verify the combined layout

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/day-card.tsx`
- Modify: `components/track-map.tsx`

**Step 1: Run targeted verification**

Run: `pnpm vitest app/page.test.tsx components/day-card.test.tsx --run`
Expected: PASS

**Step 2: Run lint or type verification if available and fast**

Run: `pnpm test -- --runInBand`
Expected: Use only if this repo maps `test` to a quick targeted suite; otherwise skip in favor of the explicit Vitest command above.

**Step 3: Review final diff**

Run: `git diff -- app/page.tsx components/day-card.tsx components/track-map.tsx`
Expected: Only the layout-flattening changes appear.

**Step 4: Commit**

```bash
git add app/page.tsx components/day-card.tsx components/track-map.tsx
git commit -m "feat: flatten itinerary and map layout"
```
