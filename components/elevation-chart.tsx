"use client"

import { useMemo } from "react"
import { useTrip } from "@/lib/trip-context"
import { days, sideTrips } from "@/lib/overland-data"
import { buildElevationChartData } from "@/lib/elevation-chart-data"
import {
  ComposedChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts"

export function ElevationChart() {
  const { selectedDay, selectedSideTrips } = useTrip()
  const day = days.find((d) => d.id === selectedDay)
  const chartData = useMemo(
    () => buildElevationChartData(selectedDay, selectedSideTrips),
    [selectedDay, selectedSideTrips]
  )
  const selectedDaySideTrips = useMemo(
    () =>
      sideTrips.filter(
        (sideTrip) => sideTrip.dayId === selectedDay && selectedSideTrips.includes(sideTrip.id)
      ),
    [selectedDay, selectedSideTrips]
  )

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">Elevation Profile</h3>
        {day && (
          <span className="text-sm text-muted-foreground">
            {day.from} → {day.to}
            {selectedDaySideTrips.length > 0 && (
              <span className="text-accent ml-2">+ Side Trips</span>
            )}
          </span>
        )}
      </div>
      <div className="h-56 w-full min-h-[224px] lg:h-[min(30vh,16rem)]">
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <ComposedChart
            data={chartData.mainProfile}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.12 145)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.45 0.12 145)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="sideTripGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.15 30)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.55 0.15 30)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 90)" />
            <XAxis
              dataKey="distance"
              domain={[0, chartData.maxDistance]}
              tickFormatter={(v) => `${v.toFixed(1)}km`}
              tick={{ fontSize: 11, fill: "oklch(0.50 0.02 50)" }}
              axisLine={{ stroke: "oklch(0.88 0.02 90)" }}
              tickLine={{ stroke: "oklch(0.88 0.02 90)" }}
              type="number"
            />
            <YAxis
              domain={[chartData.minElevation, chartData.maxElevation]}
              tickFormatter={(v) => `${v}m`}
              tick={{ fontSize: 11, fill: "oklch(0.50 0.02 50)" }}
              axisLine={{ stroke: "oklch(0.88 0.02 90)" }}
              tickLine={{ stroke: "oklch(0.88 0.02 90)" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(1 0 0)",
                border: "1px solid oklch(0.88 0.02 90)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => {
                const label = name === "Main Track" ? "Main Track" : name
                return [`${value}m`, label]
              }}
              labelFormatter={(label) => `Distance: ${Number(label).toFixed(1)}km`}
            />
            {chartData.branchMarkers.map((marker) => (
              <ReferenceDot
                key={marker.sideTripId}
                x={marker.distance}
                y={marker.elevation}
                r={5}
                fill="oklch(0.55 0.15 30)"
                stroke="white"
                strokeWidth={2}
                label={{
                  value: marker.name,
                  position: "top",
                  fill: "oklch(0.55 0.15 30)",
                  fontSize: 10,
                }}
              />
            ))}
            <Area
              type="monotone"
              dataKey="elevation"
              name="Main Track"
              stroke="oklch(0.45 0.12 145)"
              strokeWidth={2}
              fill="url(#elevationGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {selectedDaySideTrips.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Orange markers show where selected side trips branch from the day route.
        </p>
      )}
      {selectedDaySideTrips.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {selectedDaySideTrips.map((sideTrip) => {
            const profile = sideTrip.elevationProfile ?? []
            const minElevation = Math.min(...profile.map((point) => point.elevation)) - 20
            const maxElevation = Math.max(...profile.map((point) => point.elevation)) + 20

            return (
              <div
                key={sideTrip.id}
                className="rounded-lg border border-border/70 bg-muted/20 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{sideTrip.name} mini profile</p>
                    <p className="text-xs text-muted-foreground">
                      {sideTrip.distanceKm} km return • +{sideTrip.ascentM}m • {sideTrip.timeHoursMin}–{sideTrip.timeHoursMax} hrs
                    </p>
                  </div>
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                    {sideTrip.difficulty}
                  </span>
                </div>
                <div className="h-24 w-full" data-testid={`side-trip-mini-profile-${sideTrip.id}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={profile}
                      margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id={`sideTripGradient-${sideTrip.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.55 0.15 30)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="oklch(0.55 0.15 30)" stopOpacity={0.06} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 90 / 0.7)" vertical={false} />
                      <XAxis
                        dataKey="distance"
                        tickFormatter={(value) => `${Number(value).toFixed(1)}km`}
                        tick={{ fontSize: 10, fill: "oklch(0.50 0.02 50)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[minElevation, maxElevation]}
                        tickFormatter={(value) => `${value}m`}
                        tick={{ fontSize: 10, fill: "oklch(0.50 0.02 50)" }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(1 0 0)",
                          border: "1px solid oklch(0.88 0.02 90)",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [`${value}m`, sideTrip.name]}
                        labelFormatter={(label) => `Distance: ${Number(label).toFixed(1)}km`}
                      />
                      <Area
                        type="monotone"
                        dataKey="elevation"
                        stroke="oklch(0.55 0.15 30)"
                        strokeWidth={2}
                        fill={`url(#sideTripGradient-${sideTrip.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
