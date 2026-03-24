"use client"

import { FuelPlanDrawer } from "@/components/fuel-plan-drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTripStore } from "@/lib/trip-store"
import { useUserProfileStore } from "@/lib/user-profile-store"
import { days } from "@/lib/overland-data"
import { Clock, Mountain, ArrowDown, ArrowUp, MapPin, ChevronRight, Route, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

export function DayCard({ dayId }: { dayId: number }) {
  const {
    focusedSegmentId,
    selectedDay,
    setSelectedDay,
    setFocusedSegment,
    isSegmentSelected,
    toggleSegment,
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
  const isSelected = isSegmentSelected(dayId)
  const isFocused = focusedSegmentId === dayId
  const profileReady = [heightCm, weightKg, age, startingPackWeightKg, dailyPackReductionKg].every(
    (value) => value > 0
  )
  const segmentCheckboxId = `segment-toggle-${dayId}`
  const segmentLabel = `${day.from} to ${day.to}`

  const difficultyColor = {
    Easy: "bg-emerald-100 text-emerald-800",
    Moderate: "bg-amber-100 text-amber-800",
    Hard: "bg-rose-100 text-rose-800",
  }

  return (
    <section
      data-testid={`day-panel-${dayId}`}
      className={cn(
        "relative rounded-[24px] border border-border/70 transition-colors duration-200",
        isSelected
          ? "bg-white/90 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.6)]"
          : "bg-background/70",
        isFocused && "ring-2 ring-primary/20"
      )}
      onClick={() => {
        setSelectedDay(dayId)
        setFocusedSegment(dayId)
      }}
    >
      <div className="px-5 py-5 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Checkbox
              id={segmentCheckboxId}
              checked={isSelected}
              aria-label={segmentLabel}
              onCheckedChange={() => toggleSegment(dayId)}
              onClick={(event) => event.stopPropagation()}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Segment {dayId}
                </Badge>
                <Badge variant="secondary" className={cn("text-xs", difficultyColor[day.difficulty])}>
                  {day.difficulty}
                </Badge>
              </div>

              <div className="text-base font-semibold text-foreground">
                {segmentLabel}
              </div>

              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Route className="h-3.5 w-3.5" />
                <span className="truncate">
                  {day.from} <ChevronRight className="inline h-3 w-3" /> {day.to}
                </span>
              </div>
            </div>
          </div>

          {profileReady && isSelected && (
            <div className="self-start sm:shrink-0">
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
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="flex items-center gap-1.5 rounded px-2 py-1.5 bg-muted/50">
            <Mountain className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{totals.distance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center gap-1.5 rounded px-2 py-1.5 bg-muted/50">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{totals.timeMin}-{totals.timeMax} hrs</span>
          </div>
          <div className="flex items-center gap-1.5 rounded px-2 py-1.5 bg-muted/50">
            <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium">+{totals.ascent}m</span>
          </div>
          <div className="flex items-center gap-1.5 rounded px-2 py-1.5 bg-muted/50">
            <ArrowDown className="h-3.5 w-3.5 text-rose-600" />
            <span className="font-medium">-{totals.descent}m</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{day.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {day.highlights.map((highlight) => (
            <Badge key={highlight} variant="outline" className="text-xs font-normal">
              {highlight}
            </Badge>
          ))}
        </div>

        {sideTripOptions.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-border/70 pt-4">
            <p className="text-xs font-medium text-foreground">Optional side trips</p>
            {sideTripOptions.map((sideTrip) => (
              <div
                key={sideTrip.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border border-border/50 bg-background/70 p-3 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  selectedSideTrips.includes(sideTrip.id)
                    ? "bg-primary/12 ring-1 ring-primary/25"
                    : "hover:bg-background"
                )}
                role="button"
                tabIndex={0}
                aria-pressed={selectedSideTrips.includes(sideTrip.id)}
                onClick={(event) => {
                  event.stopPropagation()
                  toggleSideTrip(sideTrip.id)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    event.stopPropagation()
                    toggleSideTrip(sideTrip.id)
                  }
                }}
              >
                <Checkbox
                  id={sideTrip.id}
                  checked={selectedSideTrips.includes(sideTrip.id)}
                  onCheckedChange={() => toggleSideTrip(sideTrip.id)}
                  onClick={(event) => event.stopPropagation()}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <Label htmlFor={sideTrip.id} className="cursor-pointer text-sm font-medium">
                    {sideTrip.name}
                  </Label>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>+{sideTrip.distanceKm} km</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>+{sideTrip.ascentM}m</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{sideTrip.timeHoursMin}-{sideTrip.timeHoursMax} hrs</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "w-full justify-center text-xs sm:ml-auto sm:w-auto",
                        sideTrip.difficulty === "Easy" && "border-emerald-300 text-emerald-700",
                        sideTrip.difficulty === "Moderate" && "border-amber-300 text-amber-700",
                        sideTrip.difficulty === "Hard" && "border-rose-300 text-rose-700",
                        sideTrip.difficulty === "Very Hard" && "border-purple-300 text-purple-700"
                      )}
                    >
                      {sideTrip.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{sideTrip.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!sideTripOptions.length && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            No optional side trips mapped for this segment.
          </div>
        )}
      </div>
    </section>
  )
}
