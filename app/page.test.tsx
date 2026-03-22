import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Page from "@/app/page"

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
  it("keeps the itinerary header while flattening the desktop surfaces and preserving the mobile map tools", async () => {
    const user = userEvent.setup()

    render(<Page />)

    expect(screen.getByRole("heading", { name: /Tasmania Overland Track Planner/i })).toBeVisible()
    expect(screen.getByRole("switch", { name: /Ferry/i })).toBeVisible()
    expect(screen.getByText(/Daily Itinerary/i)).toBeVisible()
    expect(screen.getByText(/Click a day for details/i)).toBeVisible()

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
})
