# Fuel Drawer Approximation Note Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show a brief approximation disclaimer inside the Fuel Plan drawer.

**Architecture:** Keep the change local to `FuelPlanDrawer` by rendering a small note block above the main fuel summary cards. Add one focused component test to confirm the note is present when the drawer opens.

**Tech Stack:** Next.js, React, Vitest, Testing Library

---

### Task 1: Add regression coverage for the disclaimer

**Files:**
- Modify: `components/fuel-plan-drawer.test.tsx`

**Step 1: Write the failing test**

Add a test that opens the Fuel Plan drawer with a complete profile and expects approximation copy to be visible.

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test components/fuel-plan-drawer.test.tsx`
Expected: FAIL because the disclaimer does not exist yet.

### Task 2: Render the inline approximation note

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`

**Step 1: Write minimal implementation**

Add a compact inline note above the top metric cards explaining that the fuel and calorie numbers are approximate estimates and can vary with conditions and individual needs.

**Step 2: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test components/fuel-plan-drawer.test.tsx`
Expected: PASS.

### Task 3: Verify focused drawer coverage

**Files:**
- Modify: `components/fuel-plan-drawer.tsx`
- Modify: `components/fuel-plan-drawer.test.tsx`

**Step 1: Run focused verification**

Run: `source ~/.nvm/nvm.sh && nvm use >/dev/null && pnpm test components/fuel-plan-drawer.test.tsx components/day-card.test.tsx`
Expected: PASS.
