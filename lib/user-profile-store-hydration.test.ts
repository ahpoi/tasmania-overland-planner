import { beforeEach, describe, expect, it, vi } from "vitest"

import { PROFILE_STORAGE_KEY } from "@/lib/user-profile-store"

describe("user profile store hydration", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it("does not apply persisted profile values until rehydrate is called", async () => {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        state: {
          heightCm: 178,
          weightKg: 82,
          age: 34,
          startingPackWeightKg: 16,
          dailyPackReductionKg: 0.45,
        },
        version: 0,
      })
    )

    const { defaultUserProfile, useUserProfileStore } = await import("@/lib/user-profile-store")

    expect(useUserProfileStore.persist.hasHydrated()).toBe(false)
    expect(useUserProfileStore.getState()).toMatchObject(defaultUserProfile)

    await useUserProfileStore.persist.rehydrate()

    expect(useUserProfileStore.persist.hasHydrated()).toBe(true)
    expect(useUserProfileStore.getState()).toMatchObject({
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })
  })
})
