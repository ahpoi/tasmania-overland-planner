import { describe, expect, it } from "vitest"

import { defaultUserProfile } from "@/lib/user-profile-store"
import {
  calculateFuelPlan,
  classifyTerrainTier,
  getEffectivePackWeightKg,
} from "@/lib/fuel-estimator"

const completeProfile = {
  ...defaultUserProfile,
  heightCm: 178,
  weightKg: 82,
  age: 34,
  startingPackWeightKg: 16,
  dailyPackReductionKg: 0.45,
}

describe("fuel estimator", () => {
  it("reduces pack weight by the completed prior day count", () => {
    expect(
      getEffectivePackWeightKg({
        startingPackWeightKg: 16,
        dailyPackReductionKg: 0.45,
        completedDaysBeforeSelected: 2,
      })
    ).toBeCloseTo(15.1, 5)
  })

  it("never lets effective pack weight drop below zero", () => {
    expect(
      getEffectivePackWeightKg({
        startingPackWeightKg: 1,
        dailyPackReductionKg: 0.45,
        completedDaysBeforeSelected: 5,
      })
    ).toBe(0)
  })

  it("classifies easier and more demanding days into different terrain tiers", () => {
    expect(
      classifyTerrainTier({
        distanceKm: 7.8,
        ascentM: 200,
        descentM: 350,
        hikingHours: 3.5,
      }).label
    ).toBe("Easy")

    expect(
      classifyTerrainTier({
        distanceKm: 17,
        ascentM: 950,
        descentM: 900,
        hikingHours: 9,
      }).label
    ).toBe("Very Demanding")
  })

  it("returns a larger intake estimate when side-trip effort is added", () => {
    const basePlan = calculateFuelPlan({
      profile: completeProfile,
      dayPosition: 1,
      totals: {
        distanceKm: 8.6,
        ascentM: 450,
        descentM: 400,
        timeHoursMin: 3,
        timeHoursMax: 4,
      },
    })

    const sideTripPlan = calculateFuelPlan({
      profile: completeProfile,
      dayPosition: 1,
      totals: {
        distanceKm: 13.8,
        ascentM: 937,
        descentM: 887,
        timeHoursMin: 7,
        timeHoursMax: 9,
      },
    })

    expect(sideTripPlan.estimatedCaloriesBurned).toBeGreaterThan(basePlan.estimatedCaloriesBurned)
    expect(sideTripPlan.recommendedIntakeCalories).toBeGreaterThan(basePlan.recommendedIntakeCalories)
    expect(sideTripPlan.breakdown.components.finalMet).toBeGreaterThan(
      basePlan.breakdown.components.finalMet
    )
  })

  it("keeps the meal split aligned with the daily calorie and macro totals", () => {
    const plan = calculateFuelPlan({
      profile: completeProfile,
      dayPosition: 3,
      totals: {
        distanceKm: 17,
        ascentM: 400,
        descentM: 500,
        timeHoursMin: 6,
        timeHoursMax: 7,
      },
    })

    const mealCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0)
    const mealProtein = plan.meals.reduce((sum, meal) => sum + meal.proteinGrams, 0)
    const mealCarbs = plan.meals.reduce((sum, meal) => sum + meal.carbsGrams, 0)
    const mealFat = plan.meals.reduce((sum, meal) => sum + meal.fatGrams, 0)

    expect(mealCalories).toBe(plan.recommendedIntakeCalories)
    expect(mealProtein).toBe(plan.macros.proteinGrams)
    expect(mealCarbs).toBe(plan.macros.carbsGrams)
    expect(mealFat).toBe(plan.macros.fatGrams)
  })

  it("uses the MET equation for estimated calories burned", () => {
    const plan = calculateFuelPlan({
      profile: completeProfile,
      dayPosition: 2,
      totals: {
        distanceKm: 11.4,
        ascentM: 620,
        descentM: 410,
        timeHoursMin: 5,
        timeHoursMax: 6,
      },
    })

    const expectedCalories = Math.round(
      plan.breakdown.components.finalMet *
        plan.breakdown.inputs.bodyWeightKg *
        plan.breakdown.inputs.hikingHours
    )

    expect(plan.estimatedCaloriesBurned).toBe(expectedCalories)
  })

  it("returns a named intake factor and MET component breakdown", () => {
    const plan = calculateFuelPlan({
      profile: completeProfile,
      dayPosition: 3,
      totals: {
        distanceKm: 17,
        ascentM: 400,
        descentM: 500,
        timeHoursMin: 6,
        timeHoursMax: 7,
      },
    })

    expect(plan.breakdown.components.baseMet).toBeGreaterThan(0)
    expect(plan.breakdown.components.packAdjustment).toBeGreaterThanOrEqual(0)
    expect(plan.breakdown.components.ascentAdjustment).toBeGreaterThanOrEqual(0)
    expect(plan.breakdown.components.descentAdjustment).toBeGreaterThanOrEqual(0)
    expect(plan.breakdown.components.durationAdjustment).toBeGreaterThanOrEqual(0)
    expect(plan.breakdown.components.finalMet).toBeGreaterThan(
      plan.breakdown.components.baseMet
    )
    expect(plan.breakdown.intake.factor).toBe(0.9)
    expect(plan.breakdown.intake.policyLabel).toMatch(/conservative/i)
  })
})
