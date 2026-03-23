"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const PROFILE_STORAGE_KEY = "hiker-profile"

export interface UserProfileValues {
  heightCm: number
  weightKg: number
  age: number
  startingPackWeightKg: number
  dailyPackReductionKg: number
}

interface UserProfileState extends UserProfileValues {
  setProfileValue: <K extends keyof UserProfileValues>(key: K, value: UserProfileValues[K]) => void
  resetProfile: () => void
}

export const defaultUserProfile: UserProfileValues = {
  heightCm: 0,
  weightKg: 0,
  age: 0,
  startingPackWeightKg: 0,
  dailyPackReductionKg: 0,
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      ...defaultUserProfile,
      setProfileValue: (key, value) => {
        set(() => ({
          [key]: value,
        }))
      },
      resetProfile: () => {
        set(() => ({
          ...defaultUserProfile,
        }))
      },
    }),
    {
      name: PROFILE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        heightCm: state.heightCm,
        weightKg: state.weightKg,
        age: state.age,
        startingPackWeightKg: state.startingPackWeightKg,
        dailyPackReductionKg: state.dailyPackReductionKg,
      }),
    }
  )
)
