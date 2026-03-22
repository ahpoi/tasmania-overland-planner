import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Page from "@/app/page"

vi.mock("@/components/track-map", () => ({
  TrackMap: () => <div data-testid="track-map">Track Map</div>,
}))

vi.mock("@/components/elevation-chart", () => ({
  ElevationChart: () => <div data-testid="elevation-chart">Elevation Chart</div>,
}))

describe("planner layout", () => {
  it("uses a sticky desktop rail and opens the mobile tools in a drawer", async () => {
    const user = userEvent.setup()

    render(<Page />)

    expect(screen.getByTestId("planner-rail")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /View Map/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(drawer).toBeInTheDocument()
    expect(within(drawer as HTMLElement).getByTestId("track-map")).toBeVisible()
    expect(within(drawer as HTMLElement).getByTestId("elevation-chart")).toBeVisible()
  })
})
