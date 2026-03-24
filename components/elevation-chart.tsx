"use client"

import { useMemo } from "react"
import { useTripStore } from "@/lib/trip-store"
import { days, sideTrips } from "@/lib/overland-data"
import {
  buildSegmentElevationChartData,
  buildTripElevationChartData,
} from "@/lib/elevation-chart-data"
import { cn } from "@/lib/utils"
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const DESKTOP_LABEL_RAIL_WIDTH = 960
const LABEL_HORIZONTAL_PADDING = 12
const LABEL_CHARACTER_WIDTH = 8
const LABEL_MIN_GAP = 10

function buildBoundaryLabelLayout(
  markers: { key: string; distance: number; label: string; shortLabel?: string }[],
  chartRange: number
) {
  const safeRange = chartRange || 1
  const rowEnds = [-Infinity, -Infinity]

  return markers.map((marker) => {
    const label = marker.shortLabel ?? marker.label
    const labelWidth =
      label.length * LABEL_CHARACTER_WIDTH + LABEL_HORIZONTAL_PADDING * 2
    const centerPx = (marker.distance / safeRange) * DESKTOP_LABEL_RAIL_WIDTH
    const minCenter = labelWidth / 2
    const maxCenter = DESKTOP_LABEL_RAIL_WIDTH - labelWidth / 2
    const boundedCenter = Math.min(Math.max(centerPx, minCenter), maxCenter)
    const labelStart = boundedCenter - labelWidth / 2
    const fitsTopRow = labelStart >= rowEnds[0] + LABEL_MIN_GAP
    const rowIndex = fitsTopRow ? 0 : 1

    rowEnds[rowIndex] = labelStart + labelWidth

    return {
      key: marker.key,
      text: label,
      rowIndex,
      leftPercent: (boundedCenter / DESKTOP_LABEL_RAIL_WIDTH) * 100,
    }
  })
}

export function ElevationChart({
  mode = "segment",
  segmentId,
  compact = false,
  className,
}: {
  mode?: "trip" | "segment"
  segmentId?: number
  compact?: boolean
  className?: string
}) {
  const { selectedDay, selectedSegmentIds, selectedSideTrips } = useTripStore()
  const resolvedSegmentId = segmentId ?? selectedDay
  const day = days.find((d) => d.id === resolvedSegmentId)
  const chartData = useMemo(
    () =>
      mode === "trip"
        ? buildTripElevationChartData(selectedSegmentIds, selectedSideTrips)
        : buildSegmentElevationChartData(resolvedSegmentId, selectedSideTrips),
    [mode, resolvedSegmentId, selectedSegmentIds, selectedSideTrips]
  )
  const selectedSegmentSideTrips = useMemo(
    () =>
      sideTrips.filter(
        (sideTrip) =>
          sideTrip.dayId === resolvedSegmentId && selectedSideTrips.includes(sideTrip.id)
      ),
    [resolvedSegmentId, selectedSideTrips]
  )
  const title = mode === "trip" ? "Trip Elevation" : "Segment Elevation"
  const routeLabel =
    mode === "trip"
      ? "Selected Trip"
      : day
        ? `${day.from} → ${day.to}`
        : `Segment ${resolvedSegmentId}`
  const sideTripLabel =
    mode === "trip"
      ? "Planned Trip + Side Trips"
      : "Planned Segment + Side Trips"
  const showsSideTripLabel =
    mode === "trip" ? selectedSideTrips.length > 0 : selectedSegmentSideTrips.length > 0
  const tripMarkers = mode === "trip" ? chartData.markers : []
  const segmentBoundaryMarkers = tripMarkers.filter(
    (marker) => marker.markerType === "segment-boundary"
  )
  const sideTripMarkers = tripMarkers.filter((marker) => marker.markerType === "side-trip")
  const chartRange = chartData.maxDistance || 1
  const boundaryLabelLayout = useMemo(
    () => buildBoundaryLabelLayout(segmentBoundaryMarkers, chartRange),
    [segmentBoundaryMarkers, chartRange]
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
        <h3 className="font-semibold text-foreground">{title}</h3>
        {(mode === "trip" || day) && (
          <span className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            {routeLabel}
            {showsSideTripLabel && (
              <span className="text-accent ml-2">{sideTripLabel}</span>
            )}
          </span>
        )}
      </div>
      <div
        className={cn(
          "relative w-full min-h-[224px]",
          compact ? "h-44 sm:h-48 lg:h-52" : "h-56 lg:h-[min(30vh,16rem)]"
        )}
      >
        {mode === "trip" && boundaryLabelLayout.length > 0 && (
          <div
            className="pointer-events-none absolute inset-x-6 top-1 z-10 hidden h-12 md:block"
            data-testid="trip-boundary-label-rail"
          >
            {boundaryLabelLayout.map((labelLayout) => (
              <span
                key={labelLayout.key}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/78"
                data-row={String(labelLayout.rowIndex)}
                data-testid={`trip-boundary-label-${labelLayout.key}`}
                style={{
                  left: `${labelLayout.leftPercent}%`,
                  top: `${labelLayout.rowIndex * 18}px`,
                }}
              >
                {labelLayout.text}
              </span>
            ))}
          </div>
        )}
        {mode === "trip" && sideTripMarkers.length > 0 && (
          <div className="pointer-events-none absolute inset-x-6 top-8 z-10 h-12 md:top-14">
            {sideTripMarkers.map((marker, index) => {
              const labelDistance =
                marker.endDistance != null
                  ? marker.distance + (marker.endDistance - marker.distance) / 2
                  : marker.distance

              return (
                <span
                  key={marker.key}
                  className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border border-orange-300/75 bg-orange-50/92 px-2 py-0.5 text-[10px] font-semibold text-orange-900 shadow-sm"
                  style={{
                    left: `${Math.min(Math.max((labelDistance / chartRange) * 100, 5), 95)}%`,
                    top: `${(index % 2) * 20}px`,
                  }}
                >
                  {marker.shortLabel ?? marker.label}
                </span>
              )
            })}
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <ComposedChart
            data={chartData.profile}
            margin={{ top: 28, right: 10, left: 0, bottom: 0 }}
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
            {mode === "trip" &&
              sideTripMarkers.map((marker) =>
                marker.endDistance != null ? (
                  <ReferenceArea
                    key={marker.key}
                    x1={marker.distance}
                    x2={marker.endDistance}
                    fill="oklch(0.78 0.15 75)"
                    fillOpacity={0.28}
                    strokeOpacity={0}
                  />
                ) : null
              )}
            {mode === "trip" &&
              segmentBoundaryMarkers.map((marker) => (
                <ReferenceLine
                  key={marker.key}
                  x={marker.distance}
                  stroke="oklch(0.72 0.02 60)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.85}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
