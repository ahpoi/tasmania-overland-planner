import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DayCard } from "@/components/day-card"
import { TripProvider } from "@/lib/trip-context"

describe("DayCard side trip interactions", () => {
  it("toggles a side trip when clicking the row content outside the checkbox", async () => {
    const user = userEvent.setup()

    render(
      <TripProvider>
        <DayCard dayId={1} />
      </TripProvider>
    )

    const dayPanel = screen.getByTestId("day-panel-1")
    expect(dayPanel.className).toContain("rounded-[24px]")
    expect(dayPanel.className).toContain("border")
    expect(dayPanel.className).toContain("bg-white/90")
    const selectedRail = screen.getByTestId("day-panel-1-selection-rail")
    expect(selectedRail.className).toContain("top-3")
    expect(selectedRail.className).toContain("bottom-3")
    expect(selectedRail.className).toContain("rounded-full")

    const checkbox = screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText(/Official side trip from Kitchen Hut/i))

    expect(checkbox).toBeChecked()
    expect(
      screen.getByText(/Start with a big climb through alpine moorland/i)
    ).toBeVisible()
  })

  it("clears selected side trips when switching to a different day", async () => {
    const user = userEvent.setup()

    render(
      <TripProvider>
        <DayCard dayId={1} />
        <DayCard dayId={2} />
      </TripProvider>
    )

    const checkbox = screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText(/Official side trip from Kitchen Hut/i))
    expect(checkbox).toBeChecked()

    await user.click(screen.getByText(/Day 2/i))

    expect(
      screen.queryByRole("checkbox", { name: /Cradle Mountain Summit/i })
    ).not.toBeInTheDocument()

    await user.click(screen.getByText(/Day 1/i))

    expect(screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })).not.toBeChecked()
  })
})
