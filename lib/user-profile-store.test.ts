import { beforeEach, describe, expect, it } from "vitest"

import {
  PROFILE_STORAGE_KEY,
  defaultUserProfile,
  useUserProfileStore,
} from "@/lib/user-profile-store"

describe("user profile store", () => {
  beforeEach(() => {
    localStorage.clear()
    useUserProfileStore.setState({
      ...defaultUserProfile,
    })
  })

  it("starts with empty default profile values", () => {
    expect(useUserProfileStore.getState()).toMatchObject(defaultUserProfile)
  })

  it("updates a single profile field", () => {
    useUserProfileStore.getState().setProfileValue("weightKg", 82)

    expect(useUserProfileStore.getState().weightKg).toBe(82)
    expect(useUserProfileStore.getState().heightCm).toBe(defaultUserProfile.heightCm)
  })

  it("resets the profile back to defaults", () => {
    useUserProfileStore.getState().setProfileValue("startingPackWeightKg", 14.5)

    useUserProfileStore.getState().resetProfile()

    expect(useUserProfileStore.getState()).toMatchObject(defaultUserProfile)
  })

  it("persists updated values under the expected local storage key", async () => {
    useUserProfileStore.getState().setProfileValue("dailyPackReductionKg", 0.45)

    await useUserProfileStore.persist.rehydrate()

    expect(localStorage.getItem(PROFILE_STORAGE_KEY)).toContain("\"dailyPackReductionKg\":0.45")
  })
})
