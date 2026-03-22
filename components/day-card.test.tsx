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

    const checkbox = screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText(/Official side trip from Kitchen Hut/i))

    expect(checkbox).toBeChecked()
    expect(
      screen.getByText(/Start with a big climb through alpine moorland/i)
    ).toBeVisible()
  })
})
