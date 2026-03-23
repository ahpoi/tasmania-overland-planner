"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FuelPlanResult } from "@/lib/fuel-estimator"

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1)
}

export function CalculationBreakdown({
  breakdown,
  estimatedCaloriesBurned,
  recommendedIntakeCalories,
}: {
  breakdown: FuelPlanResult["breakdown"]
  estimatedCaloriesBurned: number
  recommendedIntakeCalories: number
}) {
  const { inputs, components, completedDaysBeforeSelected, intake } = breakdown

  return (
    <Accordion
      type="multiple"
      className="rounded-3xl border border-border/70 bg-background/70 px-4"
    >
      <AccordionItem value="summary">
        <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline">
          Calculation breakdown
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
            <p className="text-sm text-foreground">
              Calories burned = Final MET x body weight x hiking hours
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {intake.policyLabel} = estimated burn x {intake.factor}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Base hiking MET</span>
              <span>{formatNumber(components.baseMet)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">+ pack adjustment</span>
              <span>{formatNumber(components.packAdjustment)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">+ ascent adjustment</span>
              <span>{formatNumber(components.ascentAdjustment)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">+ descent adjustment</span>
              <span>{formatNumber(components.descentAdjustment)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">+ duration adjustment</span>
              <span>{formatNumber(components.durationAdjustment)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 font-medium">
              <span>Final MET</span>
              <span>{formatNumber(components.finalMet)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 font-medium">
              <span>Estimated burn</span>
              <span>{estimatedCaloriesBurned} kcal</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{intake.policyLabel}</span>
              <span>{intake.factor}x</span>
            </div>
            <div className="flex items-center justify-between gap-3 font-semibold">
              <span>Recommended food to pack</span>
              <span>{recommendedIntakeCalories} kcal</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="components">
        <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline">
          Calorie components
        </AccordionTrigger>
        <AccordionContent>
          <dl className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Base hiking MET</dt>
              <dd>{formatNumber(components.baseMet)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Pack adjustment</dt>
              <dd>+{formatNumber(components.packAdjustment)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Ascent adjustment</dt>
              <dd>+{formatNumber(components.ascentAdjustment)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Descent adjustment</dt>
              <dd>+{formatNumber(components.descentAdjustment)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Duration adjustment</dt>
              <dd>+{formatNumber(components.durationAdjustment)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Final MET</dt>
              <dd>{formatNumber(components.finalMet)}</dd>
            </div>
          </dl>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="inputs">
        <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline">
          Trip inputs
        </AccordionTrigger>
        <AccordionContent>
          <dl className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Body weight</dt>
              <dd>{formatNumber(inputs.bodyWeightKg)} kg</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Starting pack weight</dt>
              <dd>{formatNumber(inputs.startingPackWeightKg)} kg</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Daily pack reduction</dt>
              <dd>{formatNumber(inputs.dailyPackReductionKg)} kg</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Completed prior days</dt>
              <dd>{completedDaysBeforeSelected}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Effective pack weight</dt>
              <dd>{formatNumber(inputs.effectivePackWeightKg)} kg</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Distance</dt>
              <dd>{formatNumber(inputs.distanceKm)} km</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Ascent</dt>
              <dd>{formatNumber(inputs.ascentM)} m</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Ascent rate</dt>
              <dd>{formatNumber(inputs.ascentRateMPerHour)} m/hr</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Descent</dt>
              <dd>{formatNumber(inputs.descentM)} m</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Descent rate</dt>
              <dd>{formatNumber(inputs.descentRateMPerHour)} m/hr</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Average hiking time</dt>
              <dd>{formatNumber(inputs.hikingHours)} hr</dd>
            </div>
          </dl>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
