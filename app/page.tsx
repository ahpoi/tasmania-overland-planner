"use client"

import { useEffect, useState } from "react"

import { DayCard } from "@/components/day-card"
import { ElevationChart } from "@/components/elevation-chart"
import { TrackMap } from "@/components/track-map"
import { UserProfileDrawer } from "@/components/user-profile-drawer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { days } from "@/lib/overland-data"
import { useTripStore } from "@/lib/trip-store"
import { useUserProfileStore } from "@/lib/user-profile-store"
import {
  Compass,
  Footprints,
  ListChecks,
  Map,
  Ship,
} from "lucide-react"

const NOTE_DEBOUNCE_MS = 300

function MobileMapDrawer({
  showTripElevation,
  setShowTripElevation,
}: {
  showTripElevation: boolean
  setShowTripElevation: (value: boolean | ((current: boolean) => boolean)) => void
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 z-40 shadow-lg lg:hidden" size="lg">
          <Map className="mr-2 h-5 w-5" />
          View Map
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="inset-0 h-[100dvh] w-screen max-w-none gap-0 border-0 p-0 sm:max-w-none"
      >
        <SheetHeader className="shrink-0 border-b border-border px-4 pb-4 pr-14">
          <SheetTitle>Track Map</SheetTitle>
          <SheetDescription>
            Explore the full selected trip on the map and optionally reveal the overall trip elevation.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4">
          <TrackMap />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowTripElevation((current) => !current)}
              className="rounded-full"
            >
              {showTripElevation ? "Hide Trip Elevation" : "Show Trip Elevation"}
            </Button>
          </div>
          {showTripElevation && <ElevationChart mode="trip" />}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function HikePlanner() {
  const {
    exitMethod,
    elevationSegmentId,
    getActiveDays,
    getSelectedSegments,
    getTripTotals,
    overallNote,
    segmentNotes,
    setExitMethod,
    setOverallNote,
    setSegmentNote,
    toggleElevationSegment,
  } = useTripStore()

  const activeDays = getActiveDays()
  const selectedSegments = getSelectedSegments()
  const tripTotals = getTripTotals()
  const activeElevationDay = activeDays.find((day) => day.id === elevationSegmentId) ?? null

  const [showTripElevation, setShowTripElevation] = useState(false)
  const [isTripOverviewOpen, setIsTripOverviewOpen] = useState(false)
  const [notesSegmentId, setNotesSegmentId] = useState<number | null>(null)
  const [overallDraft, setOverallDraft] = useState(overallNote)
  const [segmentDraft, setSegmentDraft] = useState("")

  const activeNotesDay = days.find((day) => day.id === notesSegmentId) ?? null

  useEffect(() => {
    void useTripStore.persist.rehydrate()
    void useUserProfileStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (!isTripOverviewOpen) {
      return
    }

    setOverallDraft(overallNote)
  }, [isTripOverviewOpen, overallNote])

  useEffect(() => {
    if (notesSegmentId === null) {
      return
    }

    setSegmentDraft(segmentNotes[notesSegmentId] ?? "")
  }, [notesSegmentId, segmentNotes])

  useEffect(() => {
    if (!isTripOverviewOpen) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setOverallNote(overallDraft)
    }, NOTE_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isTripOverviewOpen, overallDraft, setOverallNote])

  useEffect(() => {
    if (notesSegmentId === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSegmentNote(notesSegmentId, segmentDraft)
    }, NOTE_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notesSegmentId, segmentDraft, setSegmentNote])

  useEffect(() => {
    if (notesSegmentId !== null && !activeDays.some((day) => day.id === notesSegmentId)) {
      setSegmentNote(notesSegmentId, segmentDraft)
      setNotesSegmentId(null)
    }
  }, [activeDays, notesSegmentId, segmentDraft, setSegmentNote])

  function openSegmentNotes(segmentId: number) {
    if (notesSegmentId !== null) {
      setSegmentNote(notesSegmentId, segmentDraft)
    }

    setNotesSegmentId(segmentId)
  }

  function handleSegmentNotesOpenChange(open: boolean) {
    if (!open && notesSegmentId !== null) {
      setSegmentNote(notesSegmentId, segmentDraft)
      setNotesSegmentId(null)
    }
  }

  function handleTripOverviewOpenChange(open: boolean) {
    if (!open) {
      setOverallNote(overallDraft)
    }

    setIsTripOverviewOpen(open)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,oklch(0.985_0.007_95)_0%,oklch(0.97_0.012_90)_34%,oklch(0.985_0.005_90)_100%)]">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-4">
          <div className="flex min-w-0 flex-row items-start justify-between gap-3 lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
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

      <main className="mx-auto max-w-[1600px] px-3 py-5 sm:px-4 lg:py-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)] 2xl:grid-cols-[minmax(380px,0.78fr)_minmax(0,1.22fr)]">
          <div className="space-y-4">
            <section
              data-testid="itinerary-panel"
              className="border-y border-border/60 bg-background/55 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:px-6">
                <div className="flex flex-row flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-foreground">Trip Builder</h2>
                    <p className="text-sm text-muted-foreground">
                      Select the route segments and optional side trips you want, then combine them into hiking days later.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => handleTripOverviewOpenChange(true)}
                    >
                      <ListChecks className="h-4 w-4" />
                      Trip Overview
                    </Button>
                    <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card/90 px-4 py-2 shadow-sm">
                      <Ship
                        className={`h-4 w-4 ${exitMethod === "ferry" ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <Switch
                        id="itinerary-exit-method"
                        checked={exitMethod === "walk"}
                        onCheckedChange={(checked) => setExitMethod(checked ? "walk" : "ferry")}
                      />
                      <Footprints
                        className={`h-4 w-4 ${exitMethod === "walk" ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <Label htmlFor="itinerary-exit-method" className="cursor-pointer text-sm">
                        {exitMethod === "ferry" ? "Ferry" : "Walk"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-testid="itinerary-list"
                className="space-y-4 border-t border-border/60 px-2.5 py-4 sm:px-3 lg:px-4"
              >
                {activeDays.map((day) => (
                  <DayCard key={day.id} dayId={day.id} onOpenNotes={openSegmentNotes} />
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
                      onClick={() => setShowTripElevation((current) => !current)}
                      className="pointer-events-auto rounded-full border border-white/70 bg-background/88 px-4 py-2 text-sm font-medium shadow-[0_18px_40px_-24px_rgba(15,23,42,0.65)] backdrop-blur-md hover:bg-background"
                    >
                      {showTripElevation ? "Hide Trip Elevation" : "Show Trip Elevation"}
                    </Button>
                  </div>
                  {showTripElevation && (
                    <div
                      data-testid="planner-trip-elevation-overlay"
                      className="pointer-events-none z-[1000] w-full"
                    >
                      <ElevationChart
                        mode="trip"
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

      <MobileMapDrawer
        showTripElevation={showTripElevation}
        setShowTripElevation={setShowTripElevation}
      />

      <Drawer open={isTripOverviewOpen} onOpenChange={handleTripOverviewOpenChange}>
        <DrawerContent className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>Trip Overview</DrawerTitle>
            <DrawerDescription>
              Review your selected route, current totals, and notes for the whole trip.
            </DrawerDescription>
          </DrawerHeader>
          <div
            data-testid="trip-overview-body"
            className="max-h-[65vh] flex-1 space-y-5 overflow-y-auto px-4 pb-2"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border/70 bg-muted/30 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Segments</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{selectedSegments.length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Distance</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{tripTotals.distance.toFixed(1)} km</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Time</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {tripTotals.timeMin}-{tripTotals.timeMax} hrs
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/30 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Exit</p>
                <p className="mt-1 text-lg font-semibold text-foreground capitalize">{exitMethod}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Selected Segments</h3>
              {selectedSegments.length > 0 ? (
                <Accordion
                  type="multiple"
                  className="rounded-2xl border border-border/70 bg-background/70 px-4"
                >
                  {selectedSegments.map((segment, index) => {
                    const segmentLabel = `${segment.from} to ${segment.to}`
                    const segmentNote = segmentNotes[segment.id]?.trim()

                    return (
                      <AccordionItem key={segment.id} value={`segment-${segment.id}`}>
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div>
                            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Segment {index + 1}
                            </div>
                            <div className="mt-1 font-medium text-foreground">{segmentLabel}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="rounded-2xl border border-border/60 bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
                            {segmentNote || "No notes yet for this segment."}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                <p className="rounded-2xl border border-dashed border-border/70 px-3 py-4 text-sm text-muted-foreground">
                  No main track segments selected yet.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trip-overview-note" className="text-sm font-semibold text-foreground">
                Trip notes
              </Label>
              <Textarea
                id="trip-overview-note"
                value={overallDraft}
                onChange={(event) => setOverallDraft(event.target.value)}
                placeholder="Add logistics, transport reminders, weather plans, or anything else for the whole trip."
                className="min-h-32"
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Close Trip Overview
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={notesSegmentId !== null} onOpenChange={handleSegmentNotesOpenChange}>
        <DrawerContent className="mx-auto w-full max-w-3xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>Segment Notes</DrawerTitle>
            <DrawerDescription>
              {activeNotesDay
                ? `${activeNotesDay.from} to ${activeNotesDay.to}`
                : "Add planning notes for the selected segment."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-2 px-4 pb-2">
            <Label htmlFor="segment-note" className="text-sm font-semibold text-foreground">
              {activeNotesDay
                ? `Notes for ${activeNotesDay.from} to ${activeNotesDay.to}`
                : "Segment notes"}
            </Label>
            <Textarea
              id="segment-note"
              value={segmentDraft}
              onChange={(event) => setSegmentDraft(event.target.value)}
              placeholder="Add campsite ideas, water notes, weather reminders, or pacing details for this segment."
              className="min-h-36"
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Close Segment Notes
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={elevationSegmentId !== null}
        onOpenChange={(open) => {
          if (!open && elevationSegmentId !== null) {
            toggleElevationSegment(elevationSegmentId)
          }
        }}
      >
        <DrawerContent className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>Segment Elevation</DrawerTitle>
            <DrawerDescription>
              {activeElevationDay
                ? `${activeElevationDay.from} to ${activeElevationDay.to}`
                : "Inspect the elevation profile for the selected segment."}
            </DrawerDescription>
          </DrawerHeader>
          {elevationSegmentId !== null && (
            <div className="px-4 pb-2">
              <ElevationChart mode="segment" segmentId={elevationSegmentId} />
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Close Segment Elevation
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <footer className="mt-12 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Overland Track Planner</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Data based on Tasmania Parks & Wildlife Service information. Always check official sources before your trip.
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
