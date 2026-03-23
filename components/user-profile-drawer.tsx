"use client"

import { UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useUserProfileStore, type UserProfileValues } from "@/lib/user-profile-store"

const PROFILE_FIELDS: Array<{
  key: keyof UserProfileValues
  label: string
  min: number
  step: number
}> = [
  { key: "heightCm", label: "Height (cm)", min: 0, step: 1 },
  { key: "weightKg", label: "Weight (kg)", min: 0, step: 0.1 },
  { key: "age", label: "Age (years)", min: 0, step: 1 },
  { key: "startingPackWeightKg", label: "Starting Pack Weight (kg)", min: 0, step: 0.1 },
  { key: "dailyPackReductionKg", label: "Daily Pack Reduction (kg/day)", min: 0, step: 0.05 },
]

function getReadinessLabel(profile: UserProfileValues) {
  const isComplete = Object.values(profile).every((value) => value > 0)
  return isComplete ? "Profile ready" : "Profile incomplete"
}

export function UserProfileDrawer() {
  const {
    heightCm,
    weightKg,
    age,
    startingPackWeightKg,
    dailyPackReductionKg,
    setProfileValue,
  } = useUserProfileStore()

  const profile = {
    heightCm,
    weightKg,
    age,
    startingPackWeightKg,
    dailyPackReductionKg,
  }

  return (
      <Drawer>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Profile"
        >
          <UserRound className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-md">
        <DrawerHeader className="border-b border-border/70">
          <DrawerTitle>Hiker Profile</DrawerTitle>
          <DrawerDescription>
            Save your core stats once, then reuse them across selected-day fuel estimates.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-4 py-5">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">{getReadinessLabel(profile)}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PROFILE_FIELDS.map((field) => {
              const value = profile[field.key]
              const inputId = `profile-${field.key}`

              return (
                <div key={field.key} className={cn("space-y-2", field.key === "dailyPackReductionKg" && "sm:col-span-2")}>
                  <Label htmlFor={inputId}>{field.label}</Label>
                  <Input
                    id={inputId}
                    type="number"
                    min={field.min}
                    step={field.step}
                    inputMode="decimal"
                    value={value === 0 ? "" : value}
                    onChange={(event) => {
                      const nextValue = event.target.value === "" ? 0 : Number(event.target.value)
                      setProfileValue(field.key, Number.isNaN(nextValue) ? 0 : nextValue)
                    }}
                  />
                  {field.key === "dailyPackReductionKg" && (
                    <p className="text-sm text-muted-foreground">
                      Reduce your pack automatically for each planned hiking day.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
