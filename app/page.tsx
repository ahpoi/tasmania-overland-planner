"use client"

import {useState} from "react"
import {TripProvider, useTrip} from "@/lib/trip-context"
import {DayCard} from "@/components/day-card"
import {ElevationChart} from "@/components/elevation-chart"
import {TrackMap} from "@/components/track-map"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Compass, Footprints, Map, Ship} from "lucide-react"
import {Button} from "@/components/ui/button"

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
  const { getActiveDays, exitMethod, setExitMethod } = useTrip()
  const activeDays = getActiveDays()
  const [showDesktopElevation, setShowDesktopElevation] = useState(true)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,oklch(0.985_0.007_95)_0%,oklch(0.97_0.012_90)_34%,oklch(0.985_0.005_90)_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Tasmania Overland Track Planner
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card/90 px-4 py-2 shadow-sm">
                <Ship className={`h-4 w-4 ${exitMethod === "ferry" ? "text-primary" : "text-muted-foreground"}`} />
                <Switch
                  id="header-exit-method"
                  checked={exitMethod === "walk"}
                  onCheckedChange={(checked) => setExitMethod(checked ? "walk" : "ferry")}
                />
                <Footprints className={`h-4 w-4 ${exitMethod === "walk" ? "text-primary" : "text-muted-foreground"}`} />
                <Label htmlFor="header-exit-method" className="cursor-pointer text-sm">
                  {exitMethod === "ferry" ? "Ferry" : "Walk"}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 py-5 lg:py-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)] 2xl:grid-cols-[minmax(380px,0.78fr)_minmax(0,1.22fr)]">
          <div className="space-y-4">
            <section
              data-testid="itinerary-panel"
              className="border-y border-border/60 bg-background/55 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between px-5 py-4 lg:px-6">
                <h2 className="font-semibold text-foreground">Daily Itinerary</h2>
                <span className="text-sm text-muted-foreground">
                  Click a day for details
                </span>
              </div>
              <div
                data-testid="itinerary-list"
                className="space-y-4 border-t border-border/60 px-3 py-4 lg:px-4"
              >
                {activeDays.map((day) => (
                  <DayCard key={day.id} dayId={day.id} />
                ))}
              </div>
            </section>
          </div>

          <div className="relative hidden xl:block">
            <div
              data-testid="planner-map-stage"
              className="sticky top-24 isolate h-[calc(100vh-7.5rem)] min-h-[680px]"
            >
              <div className="relative z-0 h-full">
                <TrackMap immersive className="h-full" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000]">
                  <div className="flex justify-end px-4 pb-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowDesktopElevation((current) => !current)}
                      className="pointer-events-auto rounded-full border border-white/70 bg-background/88 px-4 py-2 text-sm font-medium shadow-[0_18px_40px_-24px_rgba(15,23,42,0.65)] backdrop-blur-md hover:bg-background"
                    >
                      {showDesktopElevation ? "Hide Elevation" : "Show Elevation"}
                    </Button>
                  </div>
                  {showDesktopElevation && (
                    <div
                      data-testid="planner-elevation-overlay"
                      className="pointer-events-none z-[1000] w-full"
                    >
                      <ElevationChart
                        compact
                        className="pointer-events-auto w-full max-w-none rounded-b-none rounded-t-[28px] border-x-0 border-b-0"
                      />
                    </div>
                  )}
                </div>
              </div>
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
