import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import Page from "@/app/page"
import { TRIP_STORAGE_KEY, defaultTripState, useTripStore } from "@/lib/trip-store"

vi.mock("@/components/track-map", () => ({
  TrackMap: (props: { className?: string; immersive?: boolean }) => (
    <div
      data-testid={props.immersive ? "track-map-immersive" : "track-map"}
      data-class-name={props.className ?? ""}
    >
      Track Map
    </div>
  ),
}))

vi.mock("@/components/elevation-chart", () => ({
  ElevationChart: (props: {
    compact?: boolean
    className?: string
    mode?: "trip" | "segment"
    segmentId?: number
  }) => (
    <div
      data-testid={props.mode === "segment" ? "segment-elevation-chart" : "trip-elevation-chart"}
      data-compact={props.compact ? "true" : "false"}
      data-class-name={props.className ?? ""}
      data-mode={props.mode ?? "segment"}
      data-segment-id={props.segmentId ?? ""}
    >
      Elevation Chart
    </div>
  ),
}))

describe("planner layout", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
  })

  it("renders the planner as a trip builder without bulk action buttons", () => {
    render(<Page />)

    expect(screen.getByRole("heading", { name: /Trip Builder/i })).toBeVisible()
    expect(screen.queryByRole("heading", { name: /Daily Itinerary/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Select full trip/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Clear all/i })).not.toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /Ronny Creek to Waterfall Valley Huts/i })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })).not.toBeChecked()
  })

  it("restores persisted trip selections after the planner mounts", async () => {
    localStorage.setItem(
      TRIP_STORAGE_KEY,
      JSON.stringify({
        state: {
          exitMethod: "walk",
          selectedSegmentIds: [1, 2, 3, 4, 5, 6, 7],
          focusedSegmentId: 4,
          selectedSideTrips: ["mt-ossa"],
        },
        version: 0,
      })
    )

    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole("checkbox", { name: /Mt Ossa Summit/i })).toBeChecked()
    })
  })

  it("keeps the immersive desktop map stage and mobile map sheet tools", async () => {
    const user = userEvent.setup()

    render(<Page />)

    const itineraryPanel = screen.getByTestId("itinerary-panel")

    expect(within(itineraryPanel).getByRole("switch", { name: /Ferry/i })).toBeVisible()

    const mapStage = screen.getByTestId("planner-map-stage")
    expect(mapStage).toBeInTheDocument()
    expect(mapStage.className).toContain("isolate")

    const immersiveMap = within(mapStage).getByTestId("track-map-immersive")
    expect(immersiveMap).toBeVisible()
    expect(immersiveMap).toHaveAttribute(
      "data-class-name",
      expect.stringContaining("h-full")
    )
    expect(within(mapStage).queryByTestId("trip-elevation-chart")).not.toBeInTheDocument()
    expect(within(mapStage).getByRole("button", { name: /Show Trip Elevation/i })).toBeVisible()

    await user.click(within(mapStage).getByRole("button", { name: /Show Trip Elevation/i }))

    expect(within(mapStage).getByTestId("trip-elevation-chart")).toHaveAttribute("data-mode", "trip")
    expect(within(mapStage).getByTestId("trip-elevation-chart")).toHaveAttribute("data-compact", "true")
    expect(within(mapStage).getByTestId("trip-elevation-chart")).toHaveAttribute(
      "data-class-name",
      expect.stringContaining("rounded-b-none")
    )
    expect(within(mapStage).getByTestId("trip-elevation-chart")).toHaveAttribute(
      "data-class-name",
      expect.stringContaining("border-x-0")
    )
    expect(within(mapStage).getByRole("button", { name: /Hide Trip Elevation/i })).toBeVisible()

    await user.click(screen.getByRole("button", { name: /View Map/i }))

    const sheet = document.querySelector('[data-slot="sheet-content"]')
    expect(sheet).toBeInTheDocument()
    expect(sheet?.className).toContain("inset-0")
    expect(sheet?.className).toContain("h-[100dvh]")
    expect(sheet?.className).toContain("w-screen")
    expect(within(sheet as HTMLElement).getByTestId("track-map")).toBeVisible()
    expect(
      within(sheet as HTMLElement).getByRole("button", { name: /Hide Trip Elevation/i })
    ).toBeVisible()
    expect(
      within(sheet as HTMLElement).getByTestId("trip-elevation-chart")
    ).toHaveAttribute("data-mode", "trip")
  })

  it("opens a trip overview sheet with selected segments, totals, and trip notes", async () => {
    const user = userEvent.setup()

    useTripStore.getState().toggleSegment(2)
    useTripStore.getState().toggleSegment(4)
    useTripStore.getState().toggleSegment(5)
    useTripStore.getState().toggleSegment(6)
    useTripStore.getState().toggleSideTrip("cradle-summit")
    useTripStore.getState().setOverallNote("Book shuttle for the return leg")
    useTripStore.getState().setSegmentNote(1, "Camp high only if weather holds")

    render(<Page />)

    await user.click(screen.getByRole("button", { name: /Trip Overview/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    const tripOverviewBody = within(drawer as HTMLElement).getByTestId("trip-overview-body")

    expect(within(drawer as HTMLElement).getByRole("heading", { name: /Trip Overview/i })).toBeVisible()
    expect(within(drawer as HTMLElement).getByText(/Ronny Creek to Waterfall Valley Huts/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getByText(/Windermere Hut to New Pelion Hut/i)).toBeVisible()
    expect(
      within(drawer as HTMLElement).queryByText(/Waterfall Valley Huts to Windermere Hut/i)
    ).not.toBeInTheDocument()
    expect(within(drawer as HTMLElement).getByText(/29\.7 km/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getByText(/12-16 hrs/i)).toBeVisible()
    expect(tripOverviewBody.className).toContain("overflow-y-auto")
    expect(tripOverviewBody.className).toContain("max-h")
    expect(
      within(drawer as HTMLElement).getByLabelText(/Trip notes/i)
    ).toHaveValue("Book shuttle for the return leg")

    await user.click(
      within(drawer as HTMLElement).getByRole("button", {
        name: /Ronny Creek to Waterfall Valley Huts/i,
      })
    )

    expect(
      within(drawer as HTMLElement).getByText(/Camp high only if weather holds/i)
    ).toBeVisible()

    await user.click(
      within(drawer as HTMLElement).getByRole("button", {
        name: /Windermere Hut to New Pelion Hut/i,
      })
    )

    expect(within(drawer as HTMLElement).getByText(/No notes yet for this segment\./i)).toBeVisible()
  })

  it("opens segment notes from a day card", async () => {
    const user = userEvent.setup()

    render(<Page />)

    await user.click(
      screen.getByRole("button", {
        name: /Open notes for Ronny Creek to Waterfall Valley Huts/i,
      })
    )

    const drawer = document.querySelector('[data-slot="drawer-content"]')

    expect(within(drawer as HTMLElement).getByRole("heading", { name: /Segment Notes/i })).toBeVisible()
    expect(
      within(drawer as HTMLElement).getByLabelText(/Notes for Ronny Creek to Waterfall Valley Huts/i)
    ).toBeVisible()
  })

  it("debounces segment note persistence and flushes the latest draft on close", async () => {
    const user = userEvent.setup()

    render(<Page />)

    await user.click(
      screen.getByRole("button", {
        name: /Open notes for Ronny Creek to Waterfall Valley Huts/i,
      })
    )

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    const textarea = within(drawer as HTMLElement).getByLabelText(
      /Notes for Ronny Creek to Waterfall Valley Huts/i
    )

    await user.type(textarea, "Check first water source")

    expect(useTripStore.getState().segmentNotes[1]).toBeUndefined()

    await waitFor(
      () => {
        expect(useTripStore.getState().segmentNotes[1]).toBe("Check first water source")
      },
      { timeout: 1000 }
    )

    await user.clear(textarea)
    await user.type(textarea, "Check hut pad before dark")
    await user.click(
      within(drawer as HTMLElement).getByRole("button", { name: /Close Segment Notes/i })
    )

    expect(useTripStore.getState().segmentNotes[1]).toBe("Check hut pad before dark")
  })

  it("renders segment elevation in a shared bottom sheet when requested", async () => {
    const user = userEvent.setup()

    render(<Page />)

    expect(screen.queryByTestId("segment-elevation-chart")).not.toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: /Show Segment Elevation/i })[3])

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    const segmentChart = within(drawer as HTMLElement).getByTestId("segment-elevation-chart")

    expect(segmentChart).toHaveAttribute("data-mode", "segment")
    expect(segmentChart).toHaveAttribute("data-segment-id", "4")
    expect(useTripStore.getState().elevationSegmentId).toBe(4)

    await user.click(
      within(drawer as HTMLElement).getByRole("button", { name: /Close Segment Elevation/i })
    )

    expect(useTripStore.getState().elevationSegmentId).toBeNull()
    expect(screen.queryByTestId("segment-elevation-chart")).not.toBeInTheDocument()
  })

  it("uses tighter mobile gutters around the itinerary list", () => {
    render(<Page />)

    const itineraryList = screen.getByTestId("itinerary-list")

    expect(itineraryList.className).toContain("px-2.5")
    expect(itineraryList.className).toContain("sm:px-3")
    expect(itineraryList.className).toContain("lg:px-4")
  })
})
