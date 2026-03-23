import { useEffect, useRef } from "react"
import { render, screen } from "@testing-library/react"
import { beforeEach } from "vitest"

import { ElevationChart } from "@/components/elevation-chart"
import { defaultTripState, useTripStore } from "@/lib/trip-store"

function ChartScenario() {
  const { setSelectedDay, toggleSideTrip } = useTripStore()
  const didInitialize = useRef(false)

  useEffect(() => {
    if (didInitialize.current) return
    didInitialize.current = true
    setSelectedDay(5)
    toggleSideTrip("hartnett-falls")
  }, [setSelectedDay, toggleSideTrip])

  return <ElevationChart />
}

describe("ElevationChart", () => {
  beforeEach(() => {
    localStorage.clear()
    useTripStore.setState({
      ...defaultTripState,
    })
  })

  it("renders a single stitched elevation chart for selected side trips", async () => {
    render(<ChartScenario />)

    expect(await screen.findByText(/planned route/i)).toBeVisible()
    expect(screen.queryByText(/mini profile/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Orange markers show/i)).not.toBeInTheDocument()
  })
})
