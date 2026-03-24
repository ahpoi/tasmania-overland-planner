# Mobile Map Fullscreen And Header Overflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the mobile "View Map" experience edge-to-edge fullscreen and prevent the mobile page header from causing horizontal body overflow.

**Architecture:** Replace the mobile-only map drawer in `app/page.tsx` with the existing Radix-based `Sheet` primitive configured as a fullscreen takeover. Keep the mobile map stack intact inside the fullscreen panel, then tighten the page shell and header row sizing classes so title text and actions can shrink without pushing the body wider than the viewport.

**Tech Stack:** Next.js App Router, React, Zustand, Radix UI sheet/dialog primitives, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Lock in the new mobile fullscreen behavior with tests

**Files:**
- Modify: `/Users/ian/Workspace/multidays-hike-australia/app/page.test.tsx`
- Test: `/Users/ian/Workspace/multidays-hike-australia/app/page.test.tsx`

**Step 1: Write the failing test**

Add assertions that the mobile map open action renders `sheet-content` instead of `drawer-content`, that the sheet uses fullscreen classes, and that the page shell/header row include horizontal overflow protection and shrink-safe mobile layout classes.

**Step 2: Run test to verify it fails**

Run: `pnpm test app/page.test.tsx`
Expected: FAIL because the page still renders the mobile map with `Drawer` classes and the new overflow-protection assertions are not yet satisfied.

**Step 3: Write minimal implementation**

Update `app/page.tsx` to use the repo's `Sheet` primitives for the mobile map takeover and adjust the page/header class names to satisfy the new mobile overflow constraints.

**Step 4: Run test to verify it passes**

Run: `pnpm test app/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx docs/plans/2026-03-24-mobile-map-fullscreen-and-header-overflow.md
git commit -m "feat: use fullscreen mobile map sheet"
```

### Task 2: Verify the targeted regression surface

**Files:**
- Test: `/Users/ian/Workspace/multidays-hike-australia/app/page.test.tsx`

**Step 1: Run the focused verification**

Run: `pnpm test app/page.test.tsx`
Expected: PASS

**Step 2: Commit**

```bash
git add app/page.tsx app/page.test.tsx docs/plans/2026-03-24-mobile-map-fullscreen-and-header-overflow.md
git commit -m "test: verify fullscreen mobile map layout"
```
