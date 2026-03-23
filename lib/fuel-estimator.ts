import type { UserProfileValues } from "@/lib/user-profile-store"

export type TerrainTierLabel = "Easy" | "Moderate" | "Demanding" | "Very Demanding"

export interface FuelTotalsInput {
  distanceKm: number
  ascentM: number
  descentM: number
  timeHoursMin: number
  timeHoursMax: number
}

export interface TerrainTierResult {
  label: TerrainTierLabel
  score: number
  multiplier: number
}

export interface FuelMealPlan {
  key: "breakfast" | "lunch" | "dinner" | "snacks"
  label: string
  calories: number
  proteinGrams: number
  carbsGrams: number
  fatGrams: number
}

export interface FuelPlanResult {
  averageHikingHours: number
  effectivePackWeightKg: number
  terrain: TerrainTierResult
  estimatedCaloriesBurned: number
  recommendedIntakeCalories: number
  macros: {
    proteinGrams: number
    carbsGrams: number
    fatGrams: number
  }
  meals: FuelMealPlan[]
  breakdown: {
    completedDaysBeforeSelected: number
    inputs: {
      bodyWeightKg: number
      heightCm: number
      age: number
      startingPackWeightKg: number
      dailyPackReductionKg: number
      effectivePackWeightKg: number
      distanceKm: number
      ascentM: number
      descentM: number
      hikingHours: number
      ascentRateMPerHour: number
      descentRateMPerHour: number
    }
    components: {
      baseMet: number
      packAdjustment: number
      ascentAdjustment: number
      descentAdjustment: number
      durationAdjustment: number
      finalMet: number
    }
    intake: {
      factor: number
      policyLabel: string
    }
  }
}

const TERRAIN_MULTIPLIERS: Record<TerrainTierLabel, number> = {
  Easy: 0.96,
  Moderate: 1,
  Demanding: 1.08,
  "Very Demanding": 1.16,
}

const BASE_HIKING_MET = 6
const INTAKE_FACTOR = 0.9
const INTAKE_POLICY_LABEL = "Conservative pack target"

export function getEffectivePackWeightKg({
  startingPackWeightKg,
  dailyPackReductionKg,
  completedDaysBeforeSelected,
}: {
  startingPackWeightKg: number
  dailyPackReductionKg: number
  completedDaysBeforeSelected: number
}) {
  return Math.max(
    startingPackWeightKg - dailyPackReductionKg * completedDaysBeforeSelected,
    0
  )
}

export function classifyTerrainTier({
  distanceKm,
  ascentM,
  descentM,
  hikingHours,
}: {
  distanceKm: number
  ascentM: number
  descentM: number
  hikingHours: number
}): TerrainTierResult {
  const score =
    distanceKm * 1.15 +
    ascentM / 180 +
    descentM / 450 +
    hikingHours * 1.8

  if (score >= 30) {
    return {
      label: "Very Demanding",
      score,
      multiplier: TERRAIN_MULTIPLIERS["Very Demanding"],
    }
  }

  if (score >= 22) {
    return {
      label: "Demanding",
      score,
      multiplier: TERRAIN_MULTIPLIERS.Demanding,
    }
  }

  if (score >= 17.5) {
    return {
      label: "Moderate",
      score,
      multiplier: TERRAIN_MULTIPLIERS.Moderate,
    }
  }

  return {
    label: "Easy",
    score,
    multiplier: TERRAIN_MULTIPLIERS.Easy,
  }
}

function allocateWholeValues(total: number, ratios: number[]) {
  const allocated = ratios.map((ratio) => Math.round(total * ratio))
  const remainder = total - allocated.reduce((sum, value) => sum + value, 0)
  allocated[allocated.length - 1] += remainder
  return allocated
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10
}

export function calculateFuelPlan({
  profile,
  dayPosition,
  totals,
}: {
  profile: UserProfileValues
  dayPosition: number
  totals: FuelTotalsInput
}): FuelPlanResult {
  const averageHikingHours = (totals.timeHoursMin + totals.timeHoursMax) / 2
  const completedDaysBeforeSelected = Math.max(dayPosition - 1, 0)
  const effectivePackWeightKg = getEffectivePackWeightKg({
    startingPackWeightKg: profile.startingPackWeightKg,
    dailyPackReductionKg: profile.dailyPackReductionKg,
    completedDaysBeforeSelected,
  })

  const terrain = classifyTerrainTier({
    distanceKm: totals.distanceKm,
    ascentM: totals.ascentM,
    descentM: totals.descentM,
    hikingHours: averageHikingHours,
  })

  const ascentRateMPerHour = totals.ascentM / averageHikingHours
  const descentRateMPerHour = totals.descentM / averageHikingHours

  const baseMet = BASE_HIKING_MET
  const packAdjustment = effectivePackWeightKg * 0.06
  const ascentAdjustment = (ascentRateMPerHour / 300) * 0.7
  const descentAdjustment = (descentRateMPerHour / 400) * 0.25
  const durationAdjustment = Math.max(averageHikingHours - 4, 0) * 0.18
  const finalMet = roundToTenth(
    baseMet +
      packAdjustment +
      ascentAdjustment +
      descentAdjustment +
      durationAdjustment
  )

  const estimatedCaloriesBurned = Math.round(
    finalMet * profile.weightKg * averageHikingHours
  )

  const recommendedIntakeCalories = Math.round(estimatedCaloriesBurned * INTAKE_FACTOR)
  const proteinCalories = Math.round(recommendedIntakeCalories * 0.18)
  const fatCalories = Math.round(recommendedIntakeCalories * 0.27)
  const carbsCalories = recommendedIntakeCalories - proteinCalories - fatCalories

  const macros = {
    proteinGrams: Math.round(proteinCalories / 4),
    carbsGrams: Math.round(carbsCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
  }

  const calorieSplit = allocateWholeValues(recommendedIntakeCalories, [0.22, 0.28, 0.27, 0.23])
  const proteinSplit = allocateWholeValues(macros.proteinGrams, [0.24, 0.27, 0.29, 0.2])
  const carbsSplit = allocateWholeValues(macros.carbsGrams, [0.2, 0.3, 0.22, 0.28])
  const fatSplit = allocateWholeValues(macros.fatGrams, [0.2, 0.22, 0.34, 0.24])

  const meals: FuelMealPlan[] = [
    {
      key: "breakfast",
      label: "Breakfast",
      calories: calorieSplit[0],
      proteinGrams: proteinSplit[0],
      carbsGrams: carbsSplit[0],
      fatGrams: fatSplit[0],
    },
    {
      key: "lunch",
      label: "Lunch",
      calories: calorieSplit[1],
      proteinGrams: proteinSplit[1],
      carbsGrams: carbsSplit[1],
      fatGrams: fatSplit[1],
    },
    {
      key: "dinner",
      label: "Dinner",
      calories: calorieSplit[2],
      proteinGrams: proteinSplit[2],
      carbsGrams: carbsSplit[2],
      fatGrams: fatSplit[2],
    },
    {
      key: "snacks",
      label: "Snacks",
      calories: calorieSplit[3],
      proteinGrams: proteinSplit[3],
      carbsGrams: carbsSplit[3],
      fatGrams: fatSplit[3],
    },
  ]

  return {
    averageHikingHours,
    effectivePackWeightKg,
    terrain,
    estimatedCaloriesBurned,
    recommendedIntakeCalories,
    macros,
    meals,
    breakdown: {
      completedDaysBeforeSelected,
      inputs: {
        bodyWeightKg: profile.weightKg,
        heightCm: profile.heightCm,
        age: profile.age,
        startingPackWeightKg: profile.startingPackWeightKg,
        dailyPackReductionKg: profile.dailyPackReductionKg,
        effectivePackWeightKg,
        distanceKm: totals.distanceKm,
        ascentM: totals.ascentM,
        descentM: totals.descentM,
        hikingHours: averageHikingHours,
        ascentRateMPerHour,
        descentRateMPerHour,
      },
      components: {
        baseMet,
        packAdjustment,
        ascentAdjustment,
        descentAdjustment,
        durationAdjustment,
        finalMet,
      },
      intake: {
        factor: INTAKE_FACTOR,
        policyLabel: INTAKE_POLICY_LABEL,
      },
    },
  }
}
