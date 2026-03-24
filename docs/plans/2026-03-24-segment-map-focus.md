# Segment Map Focus Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users click a trip segment to focus the map on that segment and its selected side trips while keeping the full selected trip rendered.

**Architecture:** Add a dedicated `focusedSegmentId` to the trip store so selection and focus stay separate. Update the segment row click behavior to set focus, then refactor the map bounds helper so it frames either the focused segment plus its selected side trips or the full selected trip when no focus is set.

**Tech Stack:** Next.js App Router, React, TypeScript, Zustand persist middleware, Vitest, Testing Library, Leaflet

---

### Task 1: Add focused-segment state to the trip store

**Files:**
- Modify: `lib/trip-store.ts`
- Modify: `lib/trip-store.test.ts`

**Step 1: Write the failing test**

Add tests that cover:

- `focusedSegmentId` defaults sensibly
- clicking focus setter updates the focused segment without changing selections
- deselecting the focused segment clears or reassigns focus safely
- switching to ferry mode removes invalid focus on segment `7`

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts`

Expected: FAIL because `focusedSegmentId` and focus setters do not exist yet.

**Step 3: Write minimal implementation**

Add:

- `focusedSegmentId: number | null`
- `setFocusedSegment`
- focus normalization when exit mode or selection changes

Keep selection and focus distinct.

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest lib/trip-store.test.ts`

Expected: PASS

### Task 2: Derive focused map paths

**Files:**
- Modify: `components/track-map.tsx`
- Modify: `components/track-map.test.ts`
- Check: `lib/main-track-map-data.ts`
- Check: `lib/overland-data.ts`

**Step 1: Write the failing test**

Add helper-level tests for:

- focused segment path plus matching selected side trips
- fallback to full selected trip when no focused segment exists
- ignoring side trips that belong to other segments

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/track-map.test.ts`

Expected: FAIL because the focus helper does not exist yet.

**Step 3: Write minimal implementation**

Update the map to:

- keep rendering all selected trip geometry
- compute separate bounds input from `focusedSegmentId`
- fit to the focused segment plus its selected side trips when focus exists
- fall back to full selected trip bounds otherwise

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/track-map.test.ts`

Expected: PASS

### Task 3: Wire segment clicks to map focus and verify the planner

**Files:**
- Modify: `components/day-card.tsx`
- Modify: `components/day-card.test.tsx`
- Modify: `app/page.test.tsx`

**Step 1: Write the failing test**

Add tests that verify:

- clicking a segment row sets focus
- checkbox toggling still controls selection only
- focus styling stays on the clicked segment

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/day-card.test.tsx app/page.test.tsx`

Expected: FAIL because row click does not yet drive map focus explicitly.

**Step 3: Write minimal implementation**

Update the segment card so:

- row click sets `focusedSegmentId`
- checkbox click still only toggles inclusion

**Step 4: Run focused verification**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm vitest components/day-card.test.tsx app/page.test.tsx lib/trip-store.test.ts components/track-map.test.ts`

Expected: PASS

### Task 4: Final verification

**Files:**
- No planned code changes unless verification finds issues

**Step 1: Run the full suite**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test`

Expected: PASS

**Step 2: Run the production build**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm build`

Expected: PASS
