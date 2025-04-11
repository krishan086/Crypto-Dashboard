"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Skeleton } from "./ui/skeleton"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

const timeframes = [
  { value: "1", label: "24h" },
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
  { value: "365", label: "1y" },
]

export default function CryptoChart({ coinId, coinName }) {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("7")

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeframe}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch chart data")
        }

        const data = await response.json()

        // Format data for the chart
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
        }))

        setChartData(formattedData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (coinId) {
      fetchChartData()
    }
  }, [coinId, timeframe])

  if (error) {
    return <div className="text-center py-6 text-red-500">Error loading chart data: {error}</div>
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  // Find min and max prices for Y-axis
  const prices = chartData.map((item) => item.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  // Calculate a nice padding for the Y-axis
  const yAxisPadding = (maxPrice - minPrice) * 0.1

  return (
    <div className="space-y-4">
      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          {timeframes.map((tf) => (
            <TabsTrigger key={tf.value} value={tf.value}>
              {tf.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="price"
              tickLine={false}
              axisLine={false}
              domain={[minPrice - yAxisPadding, maxPrice + yAxisPadding]}
              tickFormatter={(value) =>
                `$${value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}`
              }
            />
            <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2} dot={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [
                `$${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                "Price",
              ]}
              labelFormatter={(label) => label}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

