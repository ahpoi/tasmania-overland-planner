# Segment Notes And Trip Overview Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add persisted segment notes and a trip overview bottom sheet that shows the selected segments, trip totals, and an overall trip note.

**Architecture:** Keep notes inside the existing persisted Zustand trip store so trip configuration and notes hydrate together from one local-storage entry. Use shared bottom sheets in the page layer for segment notes and the trip overview, with local draft state that debounces writes into the store and flushes on close.

**Tech Stack:** Next.js App Router, React, Zustand persist middleware, Vitest, Testing Library, Lucide, Vaul drawer

---

### Task 1: Extend the trip store with persisted notes

**Files:**
- Modify: `lib/trip-store.ts`
- Test: `lib/trip-store.test.ts`
- Test: `lib/trip-store-hydration.test.ts`

**Step 1: Write the failing tests**

Add tests that prove:
- the default trip state starts with empty `segmentNotes` and `overallNote`
- `setSegmentNote(segmentId, note)` stores and replaces the note for a main segment
- `setOverallNote(note)` stores and replaces the trip note
- persisted storage includes both note fields
- hydration restores both note fields

**Step 2: Run tests to verify they fail**

Run:

```bash
pnpm vitest run lib/trip-store.test.ts lib/trip-store-hydration.test.ts
```

Expected: FAIL because note state and setter actions do not exist yet.

**Step 3: Write minimal implementation**

Update `lib/trip-store.ts` to:
- add `segmentNotes` and `overallNote` to `TripStateValues`
- add `setSegmentNote` and `setOverallNote` to the store API
- keep notes inside the persisted store payload
- normalize segment-note writes so only valid main segment ids are stored

**Step 4: Run tests to verify they pass**

Run:

```bash
pnpm vitest run lib/trip-store.test.ts lib/trip-store-hydration.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add lib/trip-store.ts lib/trip-store.test.ts lib/trip-store-hydration.test.ts
git commit -m "feat: persist trip and segment notes"
```

### Task 2: Add failing UI tests for notes controls and the trip overview

**Files:**
- Modify: `components/day-card.test.tsx`
- Modify: `app/page.test.tsx`

**Step 1: Write the failing tests**

Add tests that prove:
- each day card renders a segment-notes button with an accessible name
- the button shows active styling when the segment has a saved note
- the page renders a `Trip Overview` button near the trip-level controls
- opening the trip overview shows selected segment names in order
- the trip overview shows the current distance and time totals
- the trip overview includes the overall note textarea
- opening segment notes shows a textarea for that segment

**Step 2: Run tests to verify they fail**

Run:

```bash
pnpm vitest run components/day-card.test.tsx app/page.test.tsx
```

Expected: FAIL because the notes buttons and overview sheet do not exist yet.

**Step 3: Confirm failure output**

Read the failure messages and make sure they fail for missing notes and overview behavior, not for unrelated regressions.

**Step 4: Commit**

Do not commit yet. Continue directly into implementation once the failure mode is confirmed.

### Task 3: Add the segment-notes trigger to each day card

**Files:**
- Modify: `components/day-card.tsx`
- Test: `components/day-card.test.tsx`

**Step 1: Write the minimal implementation**

Update `components/day-card.tsx` to:
- read `segmentNotes` from the trip store
- add an icon-only notes button to the segment header controls
- stop event propagation so clicking the notes button does not trigger the card click handler
- expose a stable accessible name such as `Open notes for {segmentLabel}`
- apply an active visual treatment when the segment already has a saved note
- accept a callback prop from the page layer to open the shared notes sheet for the current segment

**Step 2: Run tests to verify they pass**

Run:

```bash
pnpm vitest run components/day-card.test.tsx
```

Expected: PASS

**Step 3: Commit**

```bash
git add components/day-card.tsx components/day-card.test.tsx
git commit -m "feat: add segment notes trigger"
```

### Task 4: Build the trip overview and segment-notes bottom sheets

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/day-card.tsx` if a small prop or label adjustment is needed

**Step 1: Write minimal implementation**

Update `app/page.tsx` to:
- add local state for the active segment-notes sheet id
- render a `Trip Overview` button near the `Ferry/Walk` switch
- render a trip overview bottom sheet with:
  - selected segments in route order
  - selected segments rendered as an accordion
  - each accordion panel showing the saved segment note or a fallback message when empty
  - trip totals from `getTripTotals()`
  - an overall note textarea
- make the trip overview sheet body scrollable so long content remains reachable
- render one shared segment-notes bottom sheet with:
  - the active segment title
  - a segment note textarea
- keep sheet draft state local and synchronize it from the current store values when sheets open or switch targets

**Step 2: Add debounced persistence**

Implement debounced writes so:
- typing updates local draft state immediately
- note changes are written to the store after a short debounce window
- closing a sheet flushes the latest draft immediately

**Step 3: Run tests to verify they pass**

Run:

```bash
pnpm vitest run app/page.test.tsx components/day-card.test.tsx
```

Expected: PASS

**Step 4: Commit**

```bash
git add app/page.tsx app/page.test.tsx components/day-card.tsx components/day-card.test.tsx
git commit -m "feat: add trip overview and segment notes sheets"
```

### Task 5: Run focused verification

**Files:**
- Modify: none unless verification finds a regression

**Step 1: Run the targeted suite**

Run:

```bash
pnpm vitest run \
  lib/trip-store.test.ts \
  lib/trip-store-hydration.test.ts \
  components/day-card.test.tsx \
  app/page.test.tsx
```

Expected: PASS with zero failures.

**Step 2: Run the broader confidence check**

Run:

```bash
pnpm vitest run
```

Expected: PASS, or report any unrelated pre-existing failures explicitly.

**Step 3: Review the final diff**

Run:

```bash
git diff -- lib/trip-store.ts lib/trip-store.test.ts lib/trip-store-hydration.test.ts components/day-card.tsx components/day-card.test.tsx app/page.tsx app/page.test.tsx
```

Confirm the diff only contains the notes and trip overview feature work.

**Step 4: Commit**

```bash
git add lib/trip-store.ts lib/trip-store.test.ts lib/trip-store-hydration.test.ts components/day-card.tsx components/day-card.test.tsx app/page.tsx app/page.test.tsx
git commit -m "feat: add segment notes and trip overview"
```
