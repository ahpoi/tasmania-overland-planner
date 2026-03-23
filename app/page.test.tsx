import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Page from "@/app/page"
import { TripProvider, useTrip } from "@/lib/trip-context"

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
  ElevationChart: (props: { compact?: boolean; className?: string }) => (
    <div
      data-testid="elevation-chart"
      data-compact={props.compact ? "true" : "false"}
      data-class-name={props.className ?? ""}
    >
      Elevation Chart
    </div>
  ),
}))

function TripContextProbe() {
  const {
    getActiveDays,
    selectedDay,
    setSelectedDay,
    getDayPosition,
    setExitMethod,
  } = useTrip()

  return (
    <div>
      <span data-testid="active-day-count">{getActiveDays().length}</span>
      <span data-testid="selected-day">{selectedDay}</span>
      <span data-testid="selected-day-position">{getDayPosition(selectedDay)}</span>
      <button type="button" onClick={() => setSelectedDay(6)}>
        Select Day 6
      </button>
      <button type="button" onClick={() => setSelectedDay(7)}>
        Select Day 7
      </button>
      <button type="button" onClick={() => setExitMethod("walk")}>
        Walk Mode
      </button>
    </div>
  )
}

describe("planner layout", () => {
  it("keeps the itinerary exit-method switch group content-width on mobile", () => {
    render(<Page />)

    const itineraryHeader = screen
      .getByRole("heading", { name: /Daily Itinerary/i })
      .parentElement as HTMLElement
    const switchControl = within(itineraryHeader).getByRole("switch", { name: /Ferry/i })
    const switchGroup = switchControl.parentElement

    expect(switchGroup).not.toBeNull()
    expect(switchGroup?.className).not.toContain("w-full")
    expect(switchGroup?.className).not.toContain("flex-1")
  })

  it("lays out the itinerary header controls in a wrapping row instead of a stacked column", () => {
    render(<Page />)

    const itineraryHeader = screen
      .getByRole("heading", { name: /Daily Itinerary/i })
      .parentElement as HTMLElement
    const switchControl = within(itineraryHeader).getByRole("switch", { name: /Ferry/i })
    const switchGroup = switchControl.parentElement
    const headerActions = switchGroup?.parentElement

    expect(headerActions).not.toBeNull()
    expect(headerActions?.className).toContain("flex-row")
    expect(headerActions?.className).toContain("flex-wrap")
    expect(headerActions?.className).not.toContain("flex-col")
  })

  it("keeps the itinerary header while flattening the desktop surfaces and preserving the mobile map tools", async () => {
    const user = userEvent.setup()

    render(<Page />)

    expect(screen.getByRole("heading", { name: /Tasmania Overland Track Planner/i })).toBeVisible()
    expect(screen.getByRole("button", { name: /^Profile$/i })).toBeVisible()
    expect(screen.queryByRole("button", { name: /^Fuel Plan$/i })).not.toBeInTheDocument()
    const itineraryHeader = screen
      .getByRole("heading", { name: /Daily Itinerary/i })
      .parentElement as HTMLElement
    expect(itineraryHeader).toBeVisible()
    expect(within(itineraryHeader).getByRole("switch", { name: /Ferry/i })).toBeVisible()
    expect(screen.queryByText(/Click a day for details/i)).not.toBeInTheDocument()

    const itineraryPanel = screen.getByTestId("itinerary-panel")
    expect(itineraryPanel.className).not.toContain("rounded-[28px]")
    expect(itineraryPanel.className).not.toContain("shadow-[")
    expect(itineraryPanel.className).toContain("border-y")

    const itineraryList = screen.getByTestId("itinerary-list")
    expect(itineraryList.className).toContain("space-y-4")
    expect(itineraryList.className).not.toContain("divide-y")

    const dayPanel = screen.getByTestId("day-panel-1")
    expect(dayPanel.className).toContain("rounded-[24px]")
    expect(dayPanel.className).toContain("border")
    expect(dayPanel.className).toContain("bg-white/90")
    expect(within(dayPanel).queryByRole("button", { name: /^Fuel Plan$/i })).not.toBeInTheDocument()

    const mapStage = screen.getByTestId("planner-map-stage")
    expect(mapStage).toBeInTheDocument()
    expect(mapStage.className).toContain("isolate")

    const immersiveMap = within(mapStage).getByTestId("track-map-immersive")
    expect(immersiveMap).toBeVisible()
    expect(immersiveMap).toHaveAttribute(
      "data-class-name",
      expect.stringContaining("h-full")
    )

    const overlay = screen.getByTestId("planner-elevation-overlay")
    expect(overlay).toBeInTheDocument()
    expect(overlay.className).toContain("z-[1000]")
    const overlayChart = within(overlay).getByTestId("elevation-chart")
    expect(overlayChart).toBeVisible()
    expect(overlayChart).toHaveAttribute("data-compact", "true")
    expect(overlayChart).toHaveAttribute(
      "data-class-name",
      expect.stringContaining("w-full")
    )
    expect(overlayChart).toHaveAttribute(
      "data-class-name",
      expect.stringContaining("border-x-0")
    )

    const toggle = within(mapStage).getByRole("button", { name: /Hide Elevation/i })
    await user.click(toggle)

    expect(screen.queryByTestId("planner-elevation-overlay")).not.toBeInTheDocument()
    expect(within(mapStage).getByRole("button", { name: /Show Elevation/i })).toBeVisible()

    await user.click(within(mapStage).getByRole("button", { name: /Show Elevation/i }))

    expect(screen.getByTestId("planner-elevation-overlay")).toBeInTheDocument()
    expect(within(mapStage).getByRole("button", { name: /Hide Elevation/i })).toBeVisible()

    await user.click(screen.getByRole("button", { name: /View Map/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(drawer).toBeInTheDocument()
    expect(within(drawer as HTMLElement).getByTestId("track-map")).toBeVisible()
    expect(within(drawer as HTMLElement).getByTestId("elevation-chart")).toHaveAttribute(
      "data-compact",
      "false"
    )
  })

  it("tracks the selected day position against the active itinerary", async () => {
    const user = userEvent.setup()

    render(
      <TripProvider>
        <TripContextProbe />
      </TripProvider>
    )

    expect(screen.getByTestId("active-day-count")).toHaveTextContent("6")
    expect(screen.getByTestId("selected-day")).toHaveTextContent("1")
    expect(screen.getByTestId("selected-day-position")).toHaveTextContent("1")

    await user.click(screen.getByRole("button", { name: /Select Day 6/i }))

    expect(screen.getByTestId("selected-day")).toHaveTextContent("6")
    expect(screen.getByTestId("selected-day-position")).toHaveTextContent("6")

    await user.click(screen.getByRole("button", { name: /Walk Mode/i }))

    expect(screen.getByTestId("active-day-count")).toHaveTextContent("7")

    await user.click(screen.getByRole("button", { name: /Select Day 7/i }))

    expect(screen.getByTestId("selected-day")).toHaveTextContent("7")
    expect(screen.getByTestId("selected-day-position")).toHaveTextContent("7")
  })
})
