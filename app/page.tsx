"use client"

import { TripProvider, useTrip } from "@/lib/trip-context"
import { TripSummary } from "@/components/trip-summary"
import { DayCard } from "@/components/day-card"
import { ElevationChart } from "@/components/elevation-chart"
import { TrackMap } from "@/components/track-map"
import { Mountain, TreePine, Compass, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

function MobileMapDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 z-40 lg:hidden shadow-lg"
          size="lg"
        >
          <Map className="w-5 h-5 mr-2" />
          View Map
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[88vh] p-0">
        <DrawerHeader className="border-b border-border px-4 pb-4">
          <DrawerTitle>Track Map & Elevation</DrawerTitle>
          <DrawerDescription>
            Explore the current day on the map and see where selected side trips branch on the elevation profile.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4 space-y-4">
          <TrackMap />
          <ElevationChart />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function HikePlanner() {
  const { getActiveDays } = useTrip()
  const activeDays = getActiveDays()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Overland Track Planner
              </h1>
              <p className="text-sm text-muted-foreground">
                Tasmania&apos;s iconic multi-day hike
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
                <TreePine className="w-4 h-4" />
                Cradle Mountain-Lake St Clair National Park
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                Plan Your Overland Track Adventure
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Customize your 6-7 day journey through Tasmania&apos;s wilderness. 
                Toggle side trips, choose your exit method, and see real-time 
                distance and elevation calculations.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border border-border">
                <Mountain className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">65+ km</p>
                  <p className="text-xs text-muted-foreground">Total Distance</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border border-border">
                <Mountain className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">1617m</p>
                  <p className="text-xs text-muted-foreground">Mt Ossa Peak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Trip Summary */}
        <div className="mb-6">
          <TripSummary />
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)]">
          {/* Left Column - Day List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Daily Itinerary</h2>
              <span className="text-sm text-muted-foreground">
                Click a day for details
              </span>
            </div>
            <div className="space-y-3">
              {activeDays.map((day) => (
                <DayCard key={day.id} dayId={day.id} />
              ))}
            </div>
          </div>

          {/* Right Column - Map and Elevation (Sticky on Desktop) */}
          <div className="hidden lg:block">
            <div
              data-testid="planner-rail"
              className="sticky top-24 space-y-4"
            >
              <TrackMap />
              <ElevationChart />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Map Sheet Button */}
      <MobileMapDrawer />

      {/* Footer */}
      <footer className="border-t border-border mt-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Overland Track Planner
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Data based on Tasmania Parks & Wildlife Service information. 
              Always check official sources before your trip.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <TripProvider>
      <HikePlanner />
    </TripProvider>
  )
}
