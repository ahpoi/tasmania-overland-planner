import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { ElevationChart } from "@/components/elevation-chart"
import { defaultTripState, useTripStore } from "@/lib/trip-store"

describe("ElevationChart", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
  })

  it("renders trip-scoped labels for the selected overall route", () => {
    useTripStore.setState((state) => ({
      ...state,
      selectedSegmentIds: [1, 2, 3],
      selectedSideTrips: ["cradle-summit"],
    }))

    render(<ElevationChart mode="trip" />)

    expect(screen.getByRole("heading", { name: /Trip Elevation/i })).toBeVisible()
    expect(screen.getByText(/Selected Trip/i)).toBeVisible()
    expect(screen.getByText(/Planned Trip \+ Side Trips/i)).toBeVisible()
    expect(screen.getByText("Waterfall Valley")).toBeVisible()
    expect(screen.getByText("Windermere")).toBeVisible()
    expect(screen.getByText("Cradle Mtn")).toBeVisible()
  })

  it("stacks close trip boundary labels into separate desktop rows and hides the rail on mobile", () => {
    useTripStore.setState((state) => ({
      ...state,
      selectedSegmentIds: [1, 2, 3, 4, 5, 6],
    }))

    render(<ElevationChart mode="trip" />)

    const boundaryRail = screen.getByTestId("trip-boundary-label-rail")
    const waterfallLabel = screen.getByTestId("trip-boundary-label-segment-boundary-1")
    const windermereLabel = screen.getByTestId("trip-boundary-label-segment-boundary-2")

    expect(boundaryRail.className).toContain("hidden")
    expect(boundaryRail.className).toContain("md:block")
    expect(waterfallLabel).toHaveAttribute("data-row", "0")
    expect(windermereLabel).toHaveAttribute("data-row", "1")
  })

  it("renders segment-scoped labels for a specific segment and its side trips", () => {
    useTripStore.setState((state) => ({
      ...state,
      selectedSideTrips: ["hartnett-falls"],
    }))

    render(<ElevationChart mode="segment" segmentId={5} />)

    expect(screen.getByRole("heading", { name: /Segment Elevation/i })).toBeVisible()
    expect(screen.getByText(/Kia Ora Hut/i)).toBeVisible()
    expect(screen.getByText(/Bert Nichols Hut/i)).toBeVisible()
    expect(screen.getByText(/Planned Segment \+ Side Trips/i)).toBeVisible()
  })

  it("ignores side trips from other segments when rendering a segment chart", () => {
    useTripStore.setState((state) => ({
      ...state,
      selectedSideTrips: ["hartnett-falls"],
    }))

    render(<ElevationChart mode="segment" segmentId={1} />)

    expect(screen.getByRole("heading", { name: /Segment Elevation/i })).toBeVisible()
    expect(screen.queryByText(/Planned Segment \+ Side Trips/i)).not.toBeInTheDocument()
  })
})
