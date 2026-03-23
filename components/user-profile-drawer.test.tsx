import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { UserProfileDrawer } from "@/components/user-profile-drawer"
import { defaultUserProfile, useUserProfileStore } from "@/lib/user-profile-store"

describe("UserProfileDrawer", () => {
  beforeEach(() => {
    localStorage.clear()
    useUserProfileStore.setState({
      ...defaultUserProfile,
    })
  })

  it("opens the drawer, edits values, and keeps them after rerender", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<UserProfileDrawer />)

    await user.click(screen.getByRole("button", { name: /Profile/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(drawer).toBeInTheDocument()

    const weightInput = within(drawer as HTMLElement).getByLabelText(/^Weight \(kg\)$/i)
    const packInput = within(drawer as HTMLElement).getByLabelText(/^Starting Pack Weight \(kg\)$/i)

    await user.clear(weightInput)
    await user.type(weightInput, "82")
    await user.clear(packInput)
    await user.type(packInput, "16")

    expect(useUserProfileStore.getState().weightKg).toBe(82)
    expect(useUserProfileStore.getState().startingPackWeightKg).toBe(16)

    rerender(<UserProfileDrawer />)

    const rerenderedDrawer = document.querySelector('[data-slot="drawer-content"]')
    expect(
      within(rerenderedDrawer as HTMLElement).getByLabelText(/^Weight \(kg\)$/i)
    ).toHaveValue(82)
    expect(
      within(rerenderedDrawer as HTMLElement).getByLabelText(/^Starting Pack Weight \(kg\)$/i)
    ).toHaveValue(16)
  })

  it("uses an icon-only trigger with an accessible profile label", () => {
    render(<UserProfileDrawer />)

    const trigger = screen.getByRole("button", { name: /^Profile$/i })

    expect(trigger).toBeVisible()
    expect(trigger).not.toHaveTextContent(/Profile/i)
  })

  it("shows units, helper copy, and a profile readiness summary", async () => {
    const user = userEvent.setup()

    render(<UserProfileDrawer />)

    await user.click(screen.getByRole("button", { name: /Profile/i }))

    const drawer = document.querySelector('[data-slot="drawer-content"]')
    expect(within(drawer as HTMLElement).getByLabelText(/^Height \(cm\)$/i)).toBeVisible()
    expect(within(drawer as HTMLElement).getByLabelText(/^Age \(years\)$/i)).toBeVisible()
    expect(
      within(drawer as HTMLElement).getByLabelText(/^Daily Pack Reduction \(kg\/day\)$/i)
    ).toBeVisible()
    expect(
      within(drawer as HTMLElement).getByText(/Reduce your pack automatically for each planned hiking day/i)
    ).toBeVisible()
    expect(
      within(drawer as HTMLElement).getByText(/Profile incomplete/i)
    ).toBeVisible()
  })
})
