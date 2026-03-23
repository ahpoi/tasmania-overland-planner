"use client"

import type { ReactNode } from "react"
import { Flame, Scale, UtensilsCrossed } from "lucide-react"

import { CalculationBreakdown } from "@/components/calculation-breakdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { calculateFuelPlan } from "@/lib/fuel-estimator"
import { days } from "@/lib/overland-data"
import { useTripStore } from "@/lib/trip-store"
import { useUserProfileStore } from "@/lib/user-profile-store"

function isProfileComplete(values: number[]) {
  return values.every((value) => value > 0)
}

function formatKg(value: number) {
  return `${value.toFixed(1)} kg`
}

function stopEventPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

export function FuelPlanDrawer({ trigger }: { trigger?: ReactNode }) {
  const { selectedDay, getDayTotals, getDayPosition } = useTripStore()
  const {
    heightCm,
    weightKg,
    age,
    startingPackWeightKg,
    dailyPackReductionKg,
  } = useUserProfileStore()

  const profile = {
    heightCm,
    weightKg,
    age,
    startingPackWeightKg,
    dailyPackReductionKg,
  }

  const profileReady = isProfileComplete(Object.values(profile))
  const selectedDayData = days.find((day) => day.id === selectedDay)
  const dayTotals = getDayTotals(selectedDay)
  const fuelPlan =
    profileReady && selectedDayData
      ? calculateFuelPlan({
          profile,
          dayPosition: getDayPosition(selectedDay),
          totals: {
            distanceKm: dayTotals.distance,
            ascentM: dayTotals.ascent,
            descentM: dayTotals.descent,
            timeHoursMin: dayTotals.timeMin,
            timeHoursMax: dayTotals.timeMax,
          },
        })
      : null

  if (!profileReady) {
    return null
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Fuel Plan"
          >
            <UtensilsCrossed className="h-4 w-4" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent
        className="mx-auto w-full max-w-4xl"
        onClick={stopEventPropagation}
        onPointerDown={stopEventPropagation}
      >
        <DrawerHeader className="border-b border-border/70">
          <DrawerTitle className="text-xl sm:text-2xl">Selected-Day Fuel Plan</DrawerTitle>
          <DrawerDescription className="text-base sm:text-lg">
            Estimate calories and pack food targets from the selected itinerary day and active side trips.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-4 py-5">
          {!profileReady || !selectedDayData || !fuelPlan ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-muted/25 p-6">
              <h3 className="text-base font-semibold text-foreground">Profile needed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete your profile to estimate calories and meal targets.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
                These fuel and calorie numbers are approximate estimates based on your profile,
                selected day, and active side trips. Weather, pace, and personal needs can change
                what you actually burn or need to carry.
              </div>

              <div className="rounded-3xl border border-border/70 bg-muted/25 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedDayData.name}</p>
                    <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                      Recommended food to pack
                    </h3>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    {fuelPlan.terrain.label}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-background/80 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <UtensilsCrossed className="h-4 w-4" />
                      Recommended food to pack
                    </div>
                    <p
                      data-testid="fuel-recommended-intake"
                      className="mt-2 text-lg font-semibold leading-tight text-foreground sm:text-2xl"
                    >
                      {fuelPlan.recommendedIntakeCalories} kcal
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <Flame className="h-4 w-4" />
                      Estimated burn
                    </div>
                    <p
                      data-testid="fuel-estimated-burn"
                      className="mt-2 text-lg font-semibold leading-tight text-foreground sm:text-2xl"
                    >
                      {fuelPlan.estimatedCaloriesBurned} kcal
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <Scale className="h-4 w-4" />
                      Effective pack weight
                    </div>
                    <p className="mt-2 text-lg font-semibold leading-tight text-foreground sm:text-2xl">
                      {formatKg(fuelPlan.effectivePackWeightKg)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <CalculationBreakdown
                    breakdown={fuelPlan.breakdown}
                    estimatedCaloriesBurned={fuelPlan.estimatedCaloriesBurned}
                    recommendedIntakeCalories={fuelPlan.recommendedIntakeCalories}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
                    {fuelPlan.macros.proteinGrams} g
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
                    {fuelPlan.macros.carbsGrams} g
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
                    {fuelPlan.macros.fatGrams} g
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {fuelPlan.meals.map((meal) => (
                  <div
                    key={meal.key}
                    className="rounded-3xl border border-border/70 bg-background/85 p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground sm:text-base">{meal.label}</h4>
                        <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground sm:text-right sm:text-sm">
                        <p>{meal.proteinGrams}g protein</p>
                        <p>{meal.carbsGrams}g carbs</p>
                        <p>{meal.fatGrams}g fat</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
