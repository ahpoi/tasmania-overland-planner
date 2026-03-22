"use client"

import { useTrip } from "@/lib/trip-context"
import { cn } from "@/lib/utils"
import { Calendar, Mountain, Clock, ArrowUp, ArrowDown } from "lucide-react"

export function TripSummary({ compact = true }: { compact?: boolean }) {
  const { exitMethod, setExitMethod, getTripTotals } = useTrip()
  const totals = getTripTotals()

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-sm",
        compact ? "p-3 sm:p-4" : "p-4"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1.5",
          compact ? "" : "sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Mountain className={cn("text-primary", compact ? "h-4 w-4" : "w-5 h-5")} />
            Trip Overview
          </h2>
          <p className={cn("text-muted-foreground", compact ? "text-xs sm:text-sm" : "text-sm")}>
            Cradle Mountain to Lake St Clair
          </p>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-2.5",
          compact ? "mt-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3" : "mt-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        )}
      >
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totals.days}</p>
          <p className="text-xs text-muted-foreground">Days</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <Mountain className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totals.distance.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Kilometers</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totals.timeMin}–{totals.timeMax}</p>
          <p className="text-xs text-muted-foreground">Hours</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <ArrowUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{(totals.ascent / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground">Ascent (m)</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <ArrowDown className="w-5 h-5 text-rose-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{(totals.descent / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground">Descent (m)</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
          <p className="text-xs text-primary font-medium mb-1">Exit</p>
          <p className="text-sm font-bold text-primary">
            {exitMethod === "ferry" ? "Ferry" : "Walk Out"}
          </p>
          <p className="text-xs text-muted-foreground">
            {exitMethod === "ferry" ? "~30 min boat" : "+17.5 km"}
          </p>
        </div>
      </div>
    </div>
  )
}
