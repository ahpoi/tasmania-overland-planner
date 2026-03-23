# Itinerary Map Focus Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automatically frame the map around the selected day's itinerary, including any selected side trips for that day.

**Architecture:** Keep the behavior inside `components/track-map.tsx` by extracting a small pure helper that computes the visible path segments for the current itinerary selection. Test that helper directly, then use it to drive a Leaflet `fitBounds` effect.

**Tech Stack:** React 19, Next.js, TypeScript, Leaflet, Vitest

---

### Task 1: Lock in itinerary focus rules with a failing test

**Files:**
- Modify: `lib/main-track-map-data.test.ts`
- Modify: `components/track-map.tsx`

**Step 1: Write the failing test**

Add a pure exported helper test that verifies the selected day's track is returned by default and that selected side-trip paths are appended when present.

**Step 2: Run test to verify it fails**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: FAIL because the helper does not exist yet.

### Task 2: Implement the minimal path-selection helper

**Files:**
- Modify: `components/track-map.tsx`

**Step 3: Write minimal implementation**

Add a helper that combines `selectedDayPath` with any built side-trip paths and returns the visible itinerary segments for map fitting.

**Step 4: Run test to verify it passes**

Run: `pnpm test lib/main-track-map-data.test.ts`
Expected: PASS

### Task 3: Fit the map to the selected itinerary

**Files:**
- Modify: `components/track-map.tsx`

**Step 5: Update Leaflet bounds behavior**

Use the helper output in an effect that constructs a feature group or lat/lng bounds and calls `fitBounds` after day or side-trip changes.

### Task 4: Verify touched behavior

**Files:**
- Test: `lib/main-track-map-data.test.ts`
- Test: `components/day-card.test.tsx`
- Test: `app/page.test.tsx`

**Step 6: Run broader verification**

Run: `pnpm test lib/main-track-map-data.test.ts components/day-card.test.tsx app/page.test.tsx`
Expected: PASS
