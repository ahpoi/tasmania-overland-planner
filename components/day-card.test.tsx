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

  it("renders icon-only segment controls while keeping accessible labels", () => {
    render(<DayCard dayId={1} />)

    const dayPanel = screen.getByTestId("day-panel-1")
    within(dayPanel).getByRole("button", {
      name: /Show Segment Elevation/i,
    })
    within(dayPanel).getByRole("button", { name: /Fuel Plan/i })

    expect(within(dayPanel).queryByText(/^Show Segment Elevation$/i)).not.toBeInTheDocument()
    expect(within(dayPanel).queryByText(/^Fuel Plan$/i)).not.toBeInTheDocument()
  })

  it("renders a notes button for the segment with an accessible label", () => {
    render(<DayCard dayId={1} />)

    const dayPanel = screen.getByTestId("day-panel-1")

    within(dayPanel).getByRole("button", {
      name: /Open notes for Ronny Creek to Waterfall Valley Huts/i,
    })
  })

  it("marks the notes button when the segment already has a saved note", () => {
    useTripStore.getState().setSegmentNote(1, "Good first-night stop")

    render(<DayCard dayId={1} />)

    const notesButton = within(screen.getByTestId("day-panel-1")).getByRole("button", {
      name: /Open notes for Ronny Creek to Waterfall Valley Huts/i,
    })

    expect(notesButton).toHaveAttribute("data-has-note", "true")
  })

  it("toggles the shared segment elevation panel from the card button", async () => {
    const user = userEvent.setup()

    render(<DayCard dayId={1} />)

    const elevationButton = screen.getByRole("button", { name: /Show Segment Elevation/i })

    expect(useTripStore.getState().elevationSegmentId).toBeNull()

    await user.click(elevationButton)

    expect(useTripStore.getState().elevationSegmentId).toBe(1)
    expect(screen.getByRole("button", { name: /Hide Segment Elevation/i })).toBeVisible()

    await user.click(screen.getByRole("button", { name: /Hide Segment Elevation/i }))

    expect(useTripStore.getState().elevationSegmentId).toBeNull()
  })

  it("does not change the focused segment when toggling segment elevation", async () => {
    const user = userEvent.setup()

    render(
      <>
        <DayCard dayId={1} />
        <DayCard dayId={4} />
      </>
    )

    expect(useTripStore.getState().focusedSegmentId).toBe(1)

    await user.click(
      within(screen.getByTestId("day-panel-4")).getByRole("button", {
        name: /Show Segment Elevation/i,
      })
    )

    expect(useTripStore.getState().elevationSegmentId).toBe(4)
    expect(useTripStore.getState().focusedSegmentId).toBe(1)
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
    const content = dayPanel.querySelector(".px-4.py-4")
    const headerRow = content?.querySelector(":scope > div")
    const sideTripRow = screen.getByRole("button", { name: /Cradle Mountain Summit/i })
    const sideTripDifficulty = within(sideTripRow).getAllByText(/Hard/i).at(-1)

    expect(content).not.toBeNull()
    expect(content?.className).toContain("px-4")
    expect(content?.className).toContain("py-4")
    expect(content?.className).toContain("sm:px-5")
    expect(content?.className).toContain("sm:py-5")
    expect(content?.className).toContain("lg:px-6")
    expect(headerRow).not.toBeNull()
    expect(headerRow?.className).toContain("flex-col")
    expect(headerRow?.className).toContain("sm:flex-row")
    expect(sideTripDifficulty).toBeTruthy()
    expect(sideTripDifficulty?.className).toContain("w-full")
    expect(sideTripDifficulty?.className).toContain("sm:w-auto")
  })
})
