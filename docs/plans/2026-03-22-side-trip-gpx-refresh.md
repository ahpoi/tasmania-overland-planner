# Side Trip GPX Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Barn Bluff, Mount Ossa, and Mount Oakleigh side-trip route data with the user-provided GPX tracks.

**Architecture:** Keep the existing stored-geometry architecture. Parse the GPX files once, store the resulting `[lat, lng]` arrays in `lib/side-trip-geometries.ts`, and align `junctionLat` / `junctionLng` plus destination waypoint coordinates in `lib/overland-data.ts` to the GPX start/end points. Validate the new behavior through map-data tests.

**Tech Stack:** TypeScript, Vitest, static GPX source files, existing side-trip helper functions.

---

### Task 1: Add failing regression coverage for GPX-backed side trips

**Files:**
- Modify: `lib/side-trip-map-data.test.ts`
- Test: `lib/side-trip-map-data.test.ts`

**Step 1: Write the failing test**

Add assertions for:

- `buildSideTripPath("barn-bluff")`
- `buildSideTripPath("mt-ossa")`
- `buildSideTripPath("mt-oakleigh")`

The test should verify each returned path:

- is not `null`
- has more than 10 points
- starts at the expected GPX start point
- ends at the expected GPX end point

**Step 2: Run test to verify it fails**

Run: `pnpm test -- --run lib/side-trip-map-data.test.ts`

Expected: FAIL because the stored geometry still uses the old approximations.

**Step 3: Commit**

Do not commit yet unless requested.

### Task 2: Copy the GPX source files into the repo and extract geometry

**Files:**
- Create: `data/side-trips/Barn_Bluff.gpx`
- Create: `data/side-trips/Mount_Ossa_Summit_Track.gpx`
- Create: `data/side-trips/Mount_Oakleigh_Track.gpx`

**Step 1: Copy the GPX files**

Copy the three user-provided GPX files into `data/side-trips/`.

**Step 2: Extract the coordinates**

Use a one-off script or shell command to read each GPX file’s `trkpt` sequence and produce ordered `[lat, lng]` coordinates.

**Step 3: Note the endpoints**

Capture:

- first track point for the junction
- last track point for the destination marker

### Task 3: Replace stored side-trip geometry with GPX-backed paths

**Files:**
- Modify: `lib/side-trip-geometries.ts`

**Step 1: Update the three geometry entries**

Replace the arrays for:

- `barn-bluff`
- `mt-ossa`
- `mt-oakleigh`

with the GPX-derived paths.

**Step 2: Keep the rest unchanged**

Do not touch other side-trip geometry entries.

### Task 4: Align waypoint and junction metadata to the GPX endpoints

**Files:**
- Modify: `lib/overland-data.ts`

**Step 1: Update side-trip junction coordinates**

Set `junctionLat` / `junctionLng` for:

- `barn-bluff`
- `mt-ossa`
- `mt-oakleigh`

to the first point of each GPX track.

**Step 2: Update destination waypoint coordinates**

Update the corresponding `waypoints` entries so the marker lands on the GPX end point.

### Task 5: Verify green and run the full suite

**Files:**
- Test: `lib/side-trip-map-data.test.ts`
- Test: `lib/overland-data.test.ts`

**Step 1: Run focused tests**

Run: `pnpm test -- --run lib/side-trip-map-data.test.ts lib/overland-data.test.ts`

Expected: PASS

**Step 2: Run full verification**

Run:

- `pnpm test`
- `pnpm exec tsc --noEmit`

Expected: PASS

**Step 3: Commit**

Do not commit unless requested.
