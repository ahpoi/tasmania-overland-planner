# Trip Elevation Label Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prevent trip boundary labels from overlapping on desktop while hiding those labels on mobile.

**Architecture:** Keep trip boundary labels as a presentational overlay in `ElevationChart`, but compute a collision-aware desktop layout before rendering them. The data layer continues to supply shortened labels and marker positions, while the component decides row placement and responsive visibility.

**Tech Stack:** Next.js App Router, React, Vitest, Testing Library, Tailwind CSS, Recharts

---

### Task 1: Document the new label-layout behavior in tests

**Files:**
- Modify: `components/elevation-chart.test.tsx`

**Step 1: Write the failing test**

Add tests that prove:
- trip boundary labels stay visible in desktop trip mode
- closely spaced boundary labels get different row placements
- the trip boundary label rail is hidden on mobile

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/elevation-chart.test.tsx`

Expected: FAIL because the current component renders one fixed boundary-label row with no mobile-hide behavior.

**Step 3: Write minimal implementation**

Update the component to:
- compute a presentational boundary-label layout array
- render desktop boundary labels in two collision-safe rows
- hide the boundary-label rail on mobile with responsive classes or conditional markup

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/elevation-chart.test.tsx`

Expected: PASS

### Task 2: Verify the affected trip-elevation surface

**Files:**
- Modify: none unless verification exposes an issue

**Step 1: Run focused tests**

Run:

```bash
pnpm vitest run \
  components/elevation-chart.test.tsx \
  app/page.test.tsx \
  components/track-map.test.ts
```

Expected: PASS

**Step 2: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS
