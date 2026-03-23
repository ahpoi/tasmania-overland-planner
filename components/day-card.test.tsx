import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach } from "vitest"

import { DayCard } from "@/components/day-card"
import { defaultTripState, useTripStore } from "@/lib/trip-store"
import { defaultUserProfile, useUserProfileStore } from "@/lib/user-profile-store"

describe("DayCard side trip interactions", () => {
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

  it("toggles a side trip when clicking the row content outside the checkbox", async () => {
    const user = userEvent.setup()

    render(
      <DayCard dayId={1} />
    )

    const dayPanel = screen.getByTestId("day-panel-1")
    expect(dayPanel.className).toContain("rounded-[24px]")
    expect(dayPanel.className).toContain("border")
    expect(dayPanel.className).toContain("bg-white/90")
    expect(screen.queryByTestId("day-panel-1-selection-rail")).not.toBeInTheDocument()

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
      <>
        <DayCard dayId={1} />
        <DayCard dayId={2} />
      </>
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

  it("updates the fuel estimate when selected side trips change the day totals", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })

    render(
      <>
        <DayCard dayId={1} />
        <DayCard dayId={2} />
      </>
    )

    const dayOnePanel = screen.getByTestId("day-panel-1")
    expect(within(dayOnePanel).getByRole("button", { name: /Fuel Plan/i })).toBeVisible()

    await user.click(screen.getByText(/Day 2/i))

    expect(within(screen.getByTestId("day-panel-2")).getByRole("button", { name: /Fuel Plan/i })).toBeVisible()
    expect(within(dayOnePanel).queryByRole("button", { name: /Fuel Plan/i })).not.toBeInTheDocument()

    await user.click(screen.getByText(/Day 1/i))
    await user.click(within(dayOnePanel).getByRole("button", { name: /Fuel Plan/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    const initialBurn = (drawer as HTMLElement).querySelector('[data-testid="fuel-estimated-burn"]')
    expect(initialBurn).toHaveTextContent(/kcal/i)
    const initialBurnValue = Number(initialBurn?.textContent?.replace(/[^0-9]/g, ""))
    expect(initialBurnValue).toBeGreaterThan(0)

    await user.click(screen.getByText(/Official side trip from Kitchen Hut/i))

    const updatedBurn = (drawer as HTMLElement).querySelector('[data-testid="fuel-estimated-burn"]')
    expect(Number(updatedBurn?.textContent?.replace(/[^0-9]/g, ""))).toBeGreaterThan(initialBurnValue)
  })

  it("keeps selected side trips checked when interacting with the fuel breakdown accordion", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })

    render(
      <DayCard dayId={1} />
    )

    const dayPanel = screen.getByTestId("day-panel-1")
    const sideTripCheckbox = screen.getByRole("checkbox", { name: /Cradle Mountain Summit/i })

    await user.click(screen.getByText(/Official side trip from Kitchen Hut/i))
    expect(sideTripCheckbox).toBeChecked()

    await user.click(within(dayPanel).getByRole("button", { name: /Fuel Plan/i }))

    expect(
      within(dayPanel).getByRole("checkbox", { name: /Cradle Mountain Summit/i, hidden: true })
    ).toBeChecked()

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    await user.click(
      within(drawer as HTMLElement).getByRole("button", { name: /Calculation breakdown/i })
    )

    expect(
      within(dayPanel).getByRole("checkbox", { name: /Cradle Mountain Summit/i, hidden: true })
    ).toBeChecked()
  })

  it("pins the selected day's fuel plan trigger to the card's top-right corner", () => {
    render(
      <DayCard dayId={1} />
    )

    const trigger = screen.getByRole("button", { name: /Fuel Plan/i })
    const triggerContainer = trigger.parentElement

    expect(triggerContainer).toHaveClass("absolute")
    expect(triggerContainer).toHaveClass("right-5")
    expect(triggerContainer).toHaveClass("top-5")
  })
})
