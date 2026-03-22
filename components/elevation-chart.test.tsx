import { useEffect, useRef } from "react"
import { render, screen } from "@testing-library/react"

import { ElevationChart } from "@/components/elevation-chart"
import { TripProvider, useTrip } from "@/lib/trip-context"

function ChartScenario() {
  const { setSelectedDay, toggleSideTrip } = useTrip()
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
  it("renders a single stitched elevation chart for selected side trips", async () => {
    render(
      <TripProvider>
        <ChartScenario />
      </TripProvider>
    )

    expect(await screen.findByText(/planned route/i)).toBeVisible()
    expect(screen.queryByText(/mini profile/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Orange markers show/i)).not.toBeInTheDocument()
  })
})
