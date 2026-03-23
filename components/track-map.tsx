"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { useTripStore } from "@/lib/trip-store"
import { waypoints, days, sideTrips } from "@/lib/overland-data"
import { getDayTrackPath, getFullTrackPath } from "@/lib/main-track-map-data"
import { buildSideTripPath } from "@/lib/side-trip-map-data"
import type { LatLngTuple } from "@/lib/side-trip-geometries"
import { cn } from "@/lib/utils"

export function getFocusedItineraryPaths(
  selectedDayPath: LatLngTuple[] | null,
  selectedSideTripIds: string[]
) {
  const focusedPaths: LatLngTuple[][] = []

  if (selectedDayPath) {
    focusedPaths.push(selectedDayPath)
  }

  selectedSideTripIds.forEach((sideTripId) => {
    const sideTripPath = buildSideTripPath(sideTripId)
    if (sideTripPath) {
      focusedPaths.push(sideTripPath)
    }
  })

  return focusedPaths
}

export function TrackMap({ className, immersive = false }: { className?: string; immersive?: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const polylineRef = useRef<L.Polyline | null>(null)
  const dayHighlightRef = useRef<L.Polyline | null>(null)
  const sideTripLinesRef = useRef<L.Polyline[]>([])
  const [isClient, setIsClient] = useState(false)
  const [leafletModule, setLeafletModule] = useState<typeof import("leaflet") | null>(null)

  const { selectedDay, exitMethod, selectedSideTrips } = useTripStore()

  // Load Leaflet dynamically on client side only
  useEffect(() => {
    setIsClient(true)
    import("leaflet").then((L) => {
      setLeafletModule(L)
    })
    // Also import CSS
    import("leaflet/dist/leaflet.css")
  }, [])

  // Get waypoints for current day
  const currentDayWaypoints = useMemo(() => {
    const day = days.find((d) => d.id === selectedDay)
    if (!day) return []
    return waypoints.filter(
      (w) => w.name.includes(day.from) || w.name.includes(day.to) || w.name === day.from || w.name === day.to
    )
  }, [selectedDay])

  // Get selected side trip waypoint IDs
  const selectedSideTripWaypointIds = useMemo(() => {
    return sideTrips
      .filter((st) => selectedSideTrips.includes(st.id))
      .map((st) => st.waypointId)
      .filter(Boolean) as string[]
  }, [selectedSideTrips])

  const fullTrackPath = useMemo(() => getFullTrackPath(exitMethod), [exitMethod])
  const selectedDayPath = useMemo(() => {
    if (selectedDay > (exitMethod === "ferry" ? 6 : 7)) {
      return null
    }

    return getDayTrackPath(selectedDay)
  }, [exitMethod, selectedDay])
  const focusedItineraryPaths = useMemo(
    () => getFocusedItineraryPaths(selectedDayPath, selectedSideTrips),
    [selectedDayPath, selectedSideTrips]
  )

  // Custom icon creator
  const createCustomIcon = useMemo(() => {
    if (!leafletModule) return null
    
    return (type: string, isActive: boolean = false, isSelectedSideTrip: boolean = false) => {
      const colors: Record<string, string> = {
        hut: "#2d6a4f",
        peak: "#9d4edd",
        waterfall: "#0077b6",
        start: "#e63946",
        end: "#e63946",
        junction: "#f4a261",
        sidetrip: "#f97316",
      }
      
      const color = isSelectedSideTrip ? "#f97316" : (colors[type] || "#666")
      const size = isActive || isSelectedSideTrip ? 14 : 10
      
      return leafletModule.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ${isActive || isSelectedSideTrip ? "transform: scale(1.3);" : ""}
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })
    }
  }, [leafletModule])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !leafletModule) return

    const map = leafletModule.map(mapRef.current, {
      center: [-41.85, 146.02],
      zoom: 10,
      scrollWheelZoom: true,
    })

    leafletModule.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add main track polyline
    polylineRef.current = leafletModule.polyline(fullTrackPath, {
      color: "#666",
      weight: 3,
      opacity: 0.5,
    }).addTo(map)

    map.fitBounds(polylineRef.current.getBounds(), { padding: [20, 20] })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [leafletModule])

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModule || !polylineRef.current) return

    polylineRef.current.setLatLngs(fullTrackPath)
  }, [leafletModule, fullTrackPath])

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModule || !polylineRef.current) return

    if (focusedItineraryPaths.length === 0) {
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [20, 20] })
      return
    }

    const bounds = leafletModule.latLngBounds(focusedItineraryPaths[0])

    focusedItineraryPaths.slice(1).forEach((path) => {
      path.forEach((point) => {
        bounds.extend(point)
      })
    })

    mapInstanceRef.current.fitBounds(bounds, { padding: [28, 28] })
  }, [focusedItineraryPaths, leafletModule, fullTrackPath])

  // Update markers when waypoints or selected day/side trips change
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModule || !createCustomIcon) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add waypoint markers
    const visibleWaypoints = exitMethod === "ferry" 
      ? waypoints.filter(w => w.id !== "cynthia-bay")
      : waypoints

    visibleWaypoints.forEach((wp) => {
      const isOnCurrentDay = currentDayWaypoints.some((cdw) => cdw.id === wp.id)
      const isSelectedSideTrip = selectedSideTripWaypointIds.includes(wp.id)
      
      const marker = leafletModule.marker([wp.lat, wp.lng], {
        icon: createCustomIcon(wp.type, isOnCurrentDay, isSelectedSideTrip),
      })
        .bindPopup(
          `<div style="text-align: center;">
            <strong>${wp.name}</strong>
            ${wp.description ? `<br/><small>${wp.description}</small>` : ""}
            ${isSelectedSideTrip ? '<br/><small style="color: #f97316; font-weight: 600;">Selected Side Trip</small>' : ""}
          </div>`
        )
        .addTo(mapInstanceRef.current!)

      markersRef.current.push(marker)
    })
  }, [currentDayWaypoints, exitMethod, selectedSideTripWaypointIds, leafletModule, createCustomIcon])

  // Update day highlight and side trip lines
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModule) return

    // Remove existing highlight
    if (dayHighlightRef.current) {
      dayHighlightRef.current.remove()
    }

    // Remove existing side trip lines
    sideTripLinesRef.current.forEach((line) => line.remove())
    sideTripLinesRef.current = []

    // Add new highlight for selected day
    if (selectedDayPath) {
      dayHighlightRef.current = leafletModule.polyline(selectedDayPath, {
        color: "#2d6a4f",
        weight: 5,
        opacity: 1,
      }).addTo(mapInstanceRef.current)
    }

    // Add side trip paths for selected side trips
    selectedSideTrips.forEach((sideTripId) => {
      const path = buildSideTripPath(sideTripId)
      if (path && mapInstanceRef.current) {
        const sideTrip = sideTrips.find((st) => st.id === sideTripId)
        const line = leafletModule.polyline(path, {
          color: "#f97316",
          weight: 4,
          opacity: 0.9,
          dashArray: "8, 8",
        })
          .bindPopup(
            `<div style="text-align: center;">
              <strong>${sideTrip?.name || sideTripId}</strong>
              <br/><small>${sideTrip?.distanceKm} km return</small>
            </div>`
          )
          .addTo(mapInstanceRef.current)
        
        sideTripLinesRef.current.push(line)
      }
    })
  }, [selectedDayPath, selectedSideTrips, leafletModule])

  if (!isClient) {
    return (
      <div
        className={cn(
          "overflow-hidden bg-card shadow-sm",
          immersive ? "h-full border border-border/60 border-b-0 rounded-none" : "rounded-lg border border-border",
          className
        )}
      >
        <div className={cn("border-b border-border bg-background/78", immersive ? "px-4 py-2" : "p-3")}>
          <h3 className="font-semibold text-foreground">Track Map</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Loading map...</p>
        </div>
        <div
          className={cn(
            "w-full bg-muted/20 animate-pulse",
            immersive ? "h-[420px] lg:h-[calc(100%-5.25rem)]" : "h-80 lg:h-[min(50vh,30rem)]"
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden bg-card shadow-sm",
        immersive ? "h-full border border-border/60 border-b-0 rounded-none" : "rounded-lg border border-border",
        className
      )}
    >
      <div className={cn("border-b border-border bg-background/78", immersive ? "px-4 py-2" : "p-3")}>
        <p className="text-xs text-muted-foreground mt-0.5">
          Day {selectedDay} highlighted
          {selectedSideTrips.length > 0 && (
            <span className="text-accent"> | {selectedSideTrips.length} side trip{selectedSideTrips.length > 1 ? "s" : ""} shown</span>
          )}
        </p>
      </div>
      <div
        ref={mapRef}
        className={cn(
          "w-full",
          immersive ? "h-[420px] lg:h-[calc(100%-5.25rem)]" : "h-80 lg:h-[min(50vh,30rem)]"
        )}
      />
      <div className={cn("border-t border-border bg-background/82", immersive ? "px-4 py-2" : "p-3")}>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#e63946] border border-white shadow-sm" />
            <span className="text-muted-foreground">Start/End</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2d6a4f] border border-white shadow-sm" />
            <span className="text-muted-foreground">Hut</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#9d4edd] border border-white shadow-sm" />
            <span className="text-muted-foreground">Peak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0077b6] border border-white shadow-sm" />
            <span className="text-muted-foreground">Waterfall</span>
          </div>
          {selectedSideTrips.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f97316] border border-white shadow-sm" />
              <span className="text-muted-foreground">Side Trip</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
