import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { FuelPlanDrawer } from "@/components/fuel-plan-drawer"
import { TripProvider, useTrip } from "@/lib/trip-context"
import { defaultUserProfile, useUserProfileStore } from "@/lib/user-profile-store"

function renderFuelDrawerOnly() {
  return render(
    <TripProvider>
      <FuelPlanDrawer />
    </TripProvider>
  )
}

function TripDaySwitch() {
  const { setSelectedDay } = useTrip()

  return (
    <button type="button" onClick={() => setSelectedDay(3)}>
      Select Day 3
    </button>
  )
}

function renderFuelDrawerWithDaySwitch() {
  return render(
    <TripProvider>
      <FuelPlanDrawer />
      <TripDaySwitch />
    </TripProvider>
  )
}

describe("FuelPlanDrawer", () => {
  beforeEach(() => {
    localStorage.clear()
    useUserProfileStore.setState({
      ...defaultUserProfile,
    })
  })

  it("hides the trigger when the user profile is incomplete", () => {
    renderFuelDrawerOnly()

    expect(screen.queryByRole("button", { name: /^Fuel Plan$/i })).not.toBeInTheDocument()
  })

  it("renders an icon-only trigger once the profile is complete", async () => {
    useUserProfileStore.setState({
      ...defaultUserProfile,
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })

    renderFuelDrawerOnly()

    const trigger = screen.getByRole("button", { name: /^Fuel Plan$/i })

    expect(trigger).toBeVisible()
    expect(trigger).not.toHaveTextContent(/Fuel Plan/i)
  })

  it("renders the selected-day estimate and shows the calculation breakdown accordion", async () => {
    useUserProfileStore.setState({
      ...defaultUserProfile,
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })

    renderFuelDrawerOnly()

    await userEvent.setup().click(screen.getByRole("button", { name: /Fuel Plan/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(within(drawer as HTMLElement).getByText(/Day 1/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getAllByText(/Recommended food to pack/i).length).toBeGreaterThan(0)
    expect(within(drawer as HTMLElement).getByText(/Breakfast/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getByText(/Effective pack weight/i)).toBeVisible()
    expect(
      within(drawer as HTMLElement).getByRole("button", { name: /Calculation breakdown/i })
    ).toBeVisible()
    expect(
      within(drawer as HTMLElement).queryByText(/Pre-terrain subtotal/i)
    ).not.toBeInTheDocument()

    await userEvent
      .setup()
      .click(within(drawer as HTMLElement).getByRole("button", { name: /Calculation breakdown/i }))

    expect(within(drawer as HTMLElement).getByText(/Base hiking MET/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getAllByText(/terrain multiplier/i).length).toBeGreaterThan(0)
    expect(within(drawer as HTMLElement).getAllByText(/Final MET/i).length).toBeGreaterThan(0)
    expect(
      within(drawer as HTMLElement).getByText(
        /Estimated burn = resting kcal\/hr x final MET x hiking hours/i
      )
    ).toBeVisible()
    expect(
      within(drawer as HTMLElement).getByText(/Conservative pack target = estimated burn x 0.9/i)
    ).toBeVisible()
    expect(
      within(drawer as HTMLElement).getAllByText(/Recommended food to pack/i).length
    ).toBeGreaterThan(0)
  })

  it("shows an approximation note for the fuel estimates", async () => {
    useUserProfileStore.setState({
      ...defaultUserProfile,
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })

    renderFuelDrawerOnly()

    await userEvent.setup().click(screen.getByRole("button", { name: /Fuel Plan/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(
      within(drawer as HTMLElement).getByText(/these fuel and calorie numbers are approximate estimates/i)
    ).toBeVisible()
  })

  it("updates the effective pack weight when the selected day changes", async () => {
    const user = userEvent.setup()

    useUserProfileStore.setState({
      ...defaultUserProfile,
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })

    renderFuelDrawerWithDaySwitch()

    await user.click(screen.getByRole("button", { name: /Select Day 3/i }))
    await user.click(screen.getByRole("button", { name: /Fuel Plan/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(within(drawer as HTMLElement).getByText(/15\.1 kg/i)).toBeVisible()
  })
})
