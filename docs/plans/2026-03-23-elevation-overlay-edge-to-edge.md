# Elevation Overlay Edge-to-Edge Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the desktop compact elevation overlay stretch edge-to-edge within the map panel while preserving the current toggle behavior.

**Architecture:** Adjust the desktop map-stage overlay wrapper in `app/page.tsx` so the chart occupies the full panel width and the button remains separately aligned. Reuse `ElevationChart` with override classes instead of introducing a new variant.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Update desktop overlay layout

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/app/page.tsx`

**Step 1: Write the failing test**

Update the planner layout test to expect the desktop overlay chart class to include `w-full` and no longer depend on the old `max-w-[34rem]` floating layout.

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run app/page.test.tsx`

Expected: FAIL because the overlay chart still uses the old width constraints.

**Step 3: Write minimal implementation**

Change the desktop overlay wrapper so:
- the overlay container spans `inset-x-0`
- the button stays right-aligned with interior padding
- the compact chart uses full width with docked border-radius and border overrides

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run app/page.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx docs/plans/2026-03-23-elevation-overlay-edge-to-edge-design.md docs/plans/2026-03-23-elevation-overlay-edge-to-edge.md
git commit -m "feat: dock desktop elevation overlay to map edges"
```
