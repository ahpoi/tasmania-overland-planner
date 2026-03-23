"use client"

import { FuelPlanDrawer } from "@/components/fuel-plan-drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTripStore } from "@/lib/trip-store"
import { useUserProfileStore } from "@/lib/user-profile-store"
import { days } from "@/lib/overland-data"
import { Clock, Mountain, ArrowDown, ArrowUp, MapPin, ChevronRight, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

export function DayCard({ dayId }: { dayId: number }) {
  const {
    selectedDay,
    setSelectedDay,
    selectedSideTrips,
    toggleSideTrip,
    getDayTotals,
    getDaySideTrips,
  } = useTripStore()
  const heightCm = useUserProfileStore((state) => state.heightCm)
  const weightKg = useUserProfileStore((state) => state.weightKg)
  const age = useUserProfileStore((state) => state.age)
  const startingPackWeightKg = useUserProfileStore((state) => state.startingPackWeightKg)
  const dailyPackReductionKg = useUserProfileStore((state) => state.dailyPackReductionKg)

  const day = days.find((d) => d.id === dayId)
  if (!day) return null

  const totals = getDayTotals(dayId)
  const sideTripOptions = getDaySideTrips(dayId)
  const isSelected = selectedDay === dayId
  const profileReady = [heightCm, weightKg, age, startingPackWeightKg, dailyPackReductionKg].every(
    (value) => value > 0
  )

  const difficultyColor = {
    Easy: "bg-emerald-100 text-emerald-800",
    Moderate: "bg-amber-100 text-amber-800",
    Hard: "bg-rose-100 text-rose-800",
  }

  return (
    <section
      data-testid={`day-panel-${dayId}`}
      className={cn(
        "relative cursor-pointer rounded-[24px] border border-border/70 transition-colors duration-200",
        isSelected
          ? "bg-white/90 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.6)]"
          : "bg-background/70 hover:bg-background/90"
      )}
      onClick={() => setSelectedDay(dayId)}
    >
      <div className="px-5 py-5 lg:px-6">
        {isSelected && profileReady && (
          <div className="absolute right-5 top-5 z-10 lg:right-6">
            <FuelPlanDrawer
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  aria-label="Fuel Plan"
                  onClick={(event) => event.stopPropagation()}
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Fuel Plan
                </Button>
              }
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className={cn("min-w-0 flex-1", isSelected && profileReady && "pr-32 sm:pr-40")}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">{day.name}</span>
              <Badge variant="secondary" className={cn("text-xs", difficultyColor[day.difficulty])}>
                {day.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {day.from} <ChevronRight className="w-3 h-3 inline" /> {day.to}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1.5 bg-muted/50 rounded px-2 py-1.5">
            <Mountain className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{totals.distance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 rounded px-2 py-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{totals.timeMin}–{totals.timeMax} hrs</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 rounded px-2 py-1.5">
            <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">+{totals.ascent}m</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 rounded px-2 py-1.5">
            <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-medium">-{totals.descent}m</span>
          </div>
        </div>

        {isSelected && (
          <div className="pt-4 border-t border-border/70">
            <p className="text-sm text-muted-foreground mb-3">{day.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {day.highlights.map((h) => (
                <Badge key={h} variant="outline" className="text-xs font-normal">
                  {h}
                </Badge>
              ))}
            </div>

            {sideTripOptions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">Side Trips</p>
                {sideTripOptions.map((st) => (
                  <div
                    key={st.id}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border border-border/50 bg-background/70 p-3 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      selectedSideTrips.includes(st.id)
                        ? "bg-primary/12 ring-1 ring-primary/25"
                        : "hover:bg-background"
                    )}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedSideTrips.includes(st.id)}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSideTrip(st.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleSideTrip(st.id)
                      }
                    }}
                  >
                    <Checkbox
                      id={st.id}
                      checked={selectedSideTrips.includes(st.id)}
                      onCheckedChange={() => toggleSideTrip(st.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={st.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {st.name}
                      </Label>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>+{st.distanceKm} km</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>+{st.ascentM}m</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{st.timeHoursMin}–{st.timeHoursMax} hrs</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs ml-auto",
                            st.difficulty === "Easy" && "border-emerald-300 text-emerald-700",
                            st.difficulty === "Moderate" && "border-amber-300 text-amber-700",
                            st.difficulty === "Hard" && "border-rose-300 text-rose-700",
                            st.difficulty === "Very Hard" && "border-purple-300 text-purple-700"
                          )}
                        >
                          {st.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
