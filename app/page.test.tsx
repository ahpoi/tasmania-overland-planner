import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import Page from "@/app/page"
import { defaultTripState, useTripStore } from "@/lib/trip-store"

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

describe("planner layout", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
  })

  it("renders the planner as a trip builder with quick actions", () => {
    render(<Page />)

    expect(screen.getByRole("heading", { name: /Trip Builder/i })).toBeVisible()
    expect(screen.queryByRole("heading", { name: /Daily Itinerary/i })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Select full trip/i })).toBeVisible()
    expect(screen.getByRole("button", { name: /Clear all/i })).toBeVisible()
    expect(screen.getByRole("checkbox", { name: /Ronny Creek to Waterfall Valley Huts/i })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })).not.toBeChecked()
  })

  it("lets people clear the trip and then reselect the full route with side trips", async () => {
    const user = userEvent.setup()

    render(<Page />)

    const firstSegment = screen.getByRole("checkbox", { name: /Ronny Creek to Waterfall Valley Huts/i })
    const sideTrip = screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })

    await user.click(screen.getByRole("button", { name: /Clear all/i }))

    expect(firstSegment).not.toBeChecked()
    expect(sideTrip).not.toBeChecked()

    await user.click(screen.getByRole("button", { name: /Select full trip/i }))

    expect(firstSegment).toBeChecked()
    expect(sideTrip).toBeChecked()
  })

  it("keeps the immersive desktop map stage and mobile map sheet tools", async () => {
    const user = userEvent.setup()

    render(<Page />)

    const pageShell = screen.getByRole("banner").parentElement
    expect(pageShell).not.toBeNull()
    expect(pageShell?.className).toContain("overflow-x-hidden")

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

    await user.click(screen.getByRole("button", { name: /View Map/i }))

    const sheet = document.querySelector('[data-slot="sheet-content"]')
    expect(sheet).toBeInTheDocument()
    expect(sheet?.className).toContain("inset-0")
    expect(sheet?.className).toContain("h-[100dvh]")
    expect(sheet?.className).toContain("w-screen")
    expect(within(sheet as HTMLElement).getByTestId("track-map")).toBeVisible()
    expect(within(sheet as HTMLElement).getByTestId("elevation-chart")).toHaveAttribute(
      "data-compact",
      "false"
    )
  })
})
