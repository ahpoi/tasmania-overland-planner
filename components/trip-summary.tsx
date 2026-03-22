"use client"

import { useTrip } from "@/lib/trip-context"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar, Mountain, Clock, ArrowUp, ArrowDown, Ship, Footprints } from "lucide-react"

export function TripSummary() {
  const { exitMethod, setExitMethod, getTripTotals } = useTrip()
  const totals = getTripTotals()

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Mountain className="w-5 h-5 text-primary" />
            Trip Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Cradle Mountain to Lake St Clair
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2">
          <Ship className={`w-4 h-4 ${exitMethod === "ferry" ? "text-primary" : "text-muted-foreground"}`} />
          <Switch
            id="exit-method"
            checked={exitMethod === "walk"}
            onCheckedChange={(checked) => setExitMethod(checked ? "walk" : "ferry")}
          />
          <Footprints className={`w-4 h-4 ${exitMethod === "walk" ? "text-primary" : "text-muted-foreground"}`} />
          <Label htmlFor="exit-method" className="text-sm cursor-pointer">
            {exitMethod === "ferry" ? "Ferry from Narcissus" : "Walk to Cynthia Bay"}
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
