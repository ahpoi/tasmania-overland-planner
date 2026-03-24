"use client"

import {useState} from "react"
import { useTripStore } from "@/lib/trip-store"
import {DayCard} from "@/components/day-card"
import {ElevationChart} from "@/components/elevation-chart"
import {TrackMap} from "@/components/track-map"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Compass, Footprints, Map, Ship} from "lucide-react"
import {Button} from "@/components/ui/button"
import { UserProfileDrawer } from "@/components/user-profile-drawer"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function MobileMapDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 z-40 lg:hidden shadow-lg"
          size="lg"
        >
          <Map className="w-5 h-5 mr-2" />
          View Map
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="inset-0 h-[100dvh] w-screen max-w-none gap-0 border-0 p-0 sm:max-w-none"
      >
        <SheetHeader className="shrink-0 border-b border-border px-4 pb-4 pr-14">
          <SheetTitle>Track Map & Elevation</SheetTitle>
          <SheetDescription>
            Explore the full selected trip on the map and see how chosen side trips extend the route.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 space-y-4">
          <TrackMap />
          <ElevationChart />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function HikePlanner() {
  const { getActiveDays, exitMethod, setExitMethod, selectEntireTrip, clearSelections } = useTripStore()
  const activeDays = getActiveDays()
  const [showDesktopElevation, setShowDesktopElevation] = useState(true)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,oklch(0.985_0.007_95)_0%,oklch(0.97_0.012_90)_34%,oklch(0.985_0.005_90)_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-4">
          <div className="flex min-w-0 flex-row items-start justify-between gap-3 lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 text-md font-bold text-foreground">
                  Tasmania Overland Track Planner
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 flex-row items-center gap-3 sm:justify-end">
              <div className="flex shrink-0 items-center gap-2">
                <UserProfileDrawer />
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
              <div className="flex flex-col gap-4 px-5 py-4 lg:px-6">
                <div className="flex flex-row flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-foreground">Trip Builder</h2>
                    <p className="text-sm text-muted-foreground">
                      Select the route segments and optional side trips you want, then combine them into hiking days later.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card/90 px-4 py-2 shadow-sm">
                    <Ship className={`h-4 w-4 ${exitMethod === "ferry" ? "text-primary" : "text-muted-foreground"}`} />
                    <Switch
                      id="itinerary-exit-method"
                      checked={exitMethod === "walk"}
                      onCheckedChange={(checked) => setExitMethod(checked ? "walk" : "ferry")}
                    />
                    <Footprints className={`h-4 w-4 ${exitMethod === "walk" ? "text-primary" : "text-muted-foreground"}`} />
                    <Label htmlFor="itinerary-exit-method" className="cursor-pointer text-sm">
                      {exitMethod === "ferry" ? "Ferry" : "Walk"}
                    </Label>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="default" size="sm" onClick={selectEntireTrip}>
                    Select Full Trip
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearSelections}>
                    Clear All
                  </Button>
                </div>
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
  return <HikePlanner />
}
