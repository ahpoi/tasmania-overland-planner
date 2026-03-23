# Itinerary Exit Toggle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the ferry versus walk toggle into the `Daily Itinerary` header and remove the helper text.

**Architecture:** Keep the existing trip context state and switch behavior unchanged. Update the page layout so the sticky header only contains branding and profile actions, and render the existing switch pill in the itinerary header with responsive wrapping.

**Tech Stack:** Next.js App Router, React, Testing Library, Vitest, Tailwind CSS

---

### Task 1: Update page layout expectations

**Files:**
- Modify: `app/page.test.tsx`
- Test: `app/page.test.tsx`

**Step 1: Write the failing test**

Add assertions that:
- the sticky header no longer exposes the exit-method switch
- the itinerary header still shows `Daily Itinerary`
- the helper text is gone
- the itinerary header contains the ferry versus walk switch

**Step 2: Run test to verify it fails**

Run: `pnpm test app/page.test.tsx`
Expected: FAIL because the switch is still rendered in the sticky header and the helper text still exists.

**Step 3: Write minimal implementation**

Move the existing switch group markup from the sticky header into the itinerary header row and remove the helper text span.

**Step 4: Run test to verify it passes**

Run: `pnpm test app/page.test.tsx`
Expected: PASS

### Task 2: Verify no regressions in the page layout test

**Files:**
- Modify: `app/page.test.tsx`
- Modify: `app/page.tsx`

**Step 1: Run the focused page test suite**

Run: `pnpm test app/page.test.tsx`
Expected: PASS with the updated layout assertions.

**Step 2: Clean up only if needed**

Adjust class assertions if the responsive itinerary header needs different wrapping classes after the move.
