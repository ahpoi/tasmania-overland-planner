import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Page from "@/app/page"

vi.mock("@/components/track-map", () => ({
  TrackMap: (props: { className?: string }) => (
    <div data-testid="track-map" data-class-name={props.className ?? ""}>
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
  it("puts route exit controls and overview access in the header, keeps the map overlay toggle, and opens mobile tools in a drawer", async () => {
    const user = userEvent.setup()

    render(<Page />)

    expect(screen.getByText(/Ferry from Narcissus/i)).toBeInTheDocument()
    expect(screen.queryByText(/Trip Overview/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /Overview/i }))

    const sheet = document.querySelector('[data-slot="sheet-content"]')
    expect(sheet).toBeInTheDocument()
    expect((sheet as HTMLElement).querySelector('[data-slot="sheet-title"]')).toHaveTextContent(
      /Trip Overview/i
    )
    expect(within(sheet as HTMLElement).getByText(/Ferry/i)).toBeVisible()
    await user.click(within(sheet as HTMLElement).getByRole("button", { name: /Close/i }))

    const mapStage = screen.getByTestId("planner-map-stage")
    expect(mapStage).toBeInTheDocument()
    expect(mapStage.className).toContain("isolate")
    expect(within(mapStage).getByTestId("track-map")).toBeVisible()

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
