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
  it("shows selected side trips as separate mini profiles below the main chart", async () => {
    render(
      <TripProvider>
        <ChartScenario />
      </TripProvider>
    )

    expect(await screen.findByText(/Hartnett Falls mini profile/i)).toBeVisible()
    expect(screen.getByText(/Orange markers show where selected side trips branch/i)).toBeVisible()
    expect(screen.queryByText(/dashed line/i)).not.toBeInTheDocument()
  })
})
