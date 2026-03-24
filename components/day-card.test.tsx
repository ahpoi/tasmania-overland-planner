import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { DayCard } from "@/components/day-card"
import { defaultTripState, useTripStore } from "@/lib/trip-store"
import { defaultUserProfile, useUserProfileStore } from "@/lib/user-profile-store"

describe("DayCard trip segment interactions", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
    useUserProfileStore.setState({
      ...defaultUserProfile,
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })
  })

  it("toggles the main segment selection from its checkbox", async () => {
    const user = userEvent.setup()

    render(<DayCard dayId={1} />)

    const segmentToggle = screen.getByRole("checkbox", {
      name: /Ronny Creek to Waterfall Valley Huts/i,
    })

    expect(segmentToggle).toBeChecked()

    await user.click(segmentToggle)

    expect(segmentToggle).not.toBeChecked()
  })

  it("focuses the selected segment when toggling it on from the checkbox", async () => {
    const user = userEvent.setup()

    useTripStore.getState().toggleSegment(3)

    render(<DayCard dayId={3} />)

    const segmentToggle = screen.getByRole("checkbox", {
      name: /Windermere Hut to New Pelion Hut/i,
    })

    expect(useTripStore.getState().focusedSegmentId).toBe(1)

    await user.click(segmentToggle)

    expect(segmentToggle).toBeChecked()
    expect(useTripStore.getState().focusedSegmentId).toBe(3)
  })

  it("toggles a side trip when clicking the row content outside the checkbox", async () => {
    const user = userEvent.setup()

    render(<DayCard dayId={1} />)

    const dayPanel = screen.getByTestId("day-panel-1")
    const checkbox = screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })

    expect(dayPanel.className).toContain("rounded-[24px]")
    expect(dayPanel.className).toContain("border")
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText(/Official side trip from Kitchen Hut/i))

    expect(checkbox).toBeChecked()
  })

  it("keeps the fuel plan trigger available for a profile-ready segment", () => {
    render(<DayCard dayId={1} />)

    const dayPanel = screen.getByTestId("day-panel-1")

    expect(within(dayPanel).getByRole("button", { name: /Fuel Plan/i })).toBeVisible()
  })

  it("focuses the segment when clicking the row body", async () => {
    const user = userEvent.setup()

    render(
      <>
        <DayCard dayId={1} />
        <DayCard dayId={4} />
      </>
    )

    expect(useTripStore.getState().focusedSegmentId).toBe(1)

    await user.click(screen.getByText(/New Pelion Hut to Kia Ora Hut/i))

    expect(useTripStore.getState().focusedSegmentId).toBe(4)
    expect(screen.getByTestId("day-panel-4").className).toContain("ring-2")
  })

  it("stacks the selected segment header controls on mobile so the fuel trigger does not widen the card", () => {
    render(<DayCard dayId={1} />)

    const dayPanel = screen.getByTestId("day-panel-1")
    const headerRow = dayPanel.querySelector(".px-5 > div")
    const sideTripRow = screen.getByRole("button", { name: /Cradle Mountain Summit/i })
    const sideTripDifficulty = within(sideTripRow).getAllByText(/Hard/i).at(-1)

    expect(headerRow).not.toBeNull()
    expect(headerRow?.className).toContain("flex-col")
    expect(headerRow?.className).toContain("sm:flex-row")
    expect(sideTripDifficulty).toBeTruthy()
    expect(sideTripDifficulty?.className).toContain("w-full")
    expect(sideTripDifficulty?.className).toContain("sm:w-auto")
  })
})
