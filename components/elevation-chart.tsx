"use client"

import { useMemo } from "react"
import { useTrip } from "@/lib/trip-context"
import { days, sideTrips } from "@/lib/overland-data"
import { buildElevationChartData } from "@/lib/elevation-chart-data"
import { cn } from "@/lib/utils"
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function ElevationChart({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
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
    <div
      className={cn(
        "rounded-2xl border border-border p-4 shadow-sm",
        compact
          ? "bg-background/82 backdrop-blur-md border-white/55 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]"
          : "bg-card",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-foreground">Elevation Profile</h3>
        {day && (
          <span className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            {day.from} → {day.to}
            {selectedDaySideTrips.length > 0 && (
              <span className="text-accent ml-2">Planned Route + Side Trips</span>
            )}
          </span>
        )}
      </div>
      <div className={cn("w-full min-h-[224px]", compact ? "h-44 sm:h-48 lg:h-52" : "h-56 lg:h-[min(30vh,16rem)]")}>
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <ComposedChart
            data={chartData.profile}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.12 145)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.45 0.12 145)" stopOpacity={0.05} />
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
                const label = name === "Planned Route" ? "Planned Route" : name
                return [`${value}m`, label]
              }}
              labelFormatter={(label) => `Distance: ${Number(label).toFixed(1)}km`}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              name="Planned Route"
              stroke="oklch(0.45 0.12 145)"
              strokeWidth={2}
              fill="url(#elevationGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
