import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { FuelPlanDrawer } from "@/components/fuel-plan-drawer"
import { defaultTripState, useTripStore } from "@/lib/trip-store"
import { defaultUserProfile, useUserProfileStore } from "@/lib/user-profile-store"

function renderFuelDrawerOnly() {
  return render(<FuelPlanDrawer />)
}

function TripSegmentSwitch() {
  const { setSelectedDay } = useTripStore()

  return (
    <button type="button" onClick={() => setSelectedDay(3)}>
      Select Segment 3
    </button>
  )
}

function renderFuelDrawerWithSegmentSwitch() {
  return render(
    <>
      <FuelPlanDrawer />
      <TripSegmentSwitch />
    </>
  )
}

describe("FuelPlanDrawer", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
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

  it("renders the selected-segment estimate and shows the calculation breakdown accordion", async () => {
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
    expect(within(drawer as HTMLElement).getByText(/Segment 1/i)).toBeVisible()
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

    await userEvent
      .setup()
      .click(within(drawer as HTMLElement).getByRole("button", { name: /Trip inputs/i }))

    expect(within(drawer as HTMLElement).getByText(/Completed prior segments/i)).toBeVisible()
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
    expect(within(drawer as HTMLElement).getByText(/selected segment, and active side trips/i)).toBeVisible()
  })

  it("updates the effective pack weight when the selected segment changes", async () => {
    const user = userEvent.setup()

    useUserProfileStore.setState({
      ...defaultUserProfile,
      heightCm: 178,
      weightKg: 82,
      age: 34,
      startingPackWeightKg: 16,
      dailyPackReductionKg: 0.45,
    })

    renderFuelDrawerWithSegmentSwitch()

    await user.click(screen.getByRole("button", { name: /Select Segment 3/i }))
    await user.click(screen.getByRole("button", { name: /Fuel Plan/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(within(drawer as HTMLElement).getByText(/Segment 3/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getByText(/15\.1 kg/i)).toBeVisible()
  })
})
