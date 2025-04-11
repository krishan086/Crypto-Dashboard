import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"

export default function MarketOverview({ coins }) {
  if (!coins || coins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading market data...</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate total market cap
  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0)

  // Calculate total 24h volume
  const total24hVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0)

  // Find best and worst performing coins in 24h
  const bestPerformer = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0]
  const worstPerformer = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total Market Cap</span>
            </div>
            <span className="font-medium">${totalMarketCap.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">24h Volume</span>
            </div>
            <span className="font-medium">${total24hVolume.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Top Performers (24h)</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="flex items-center gap-1">
                <img src={bestPerformer.image || "/placeholder.svg"} alt={bestPerformer.name} className="w-4 h-4" />
                <span className="text-sm">{bestPerformer.symbol.toUpperCase()}</span>
              </div>
            </div>
            <span className="font-medium text-green-500">+{bestPerformer.price_change_percentage_24h.toFixed(2)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="flex items-center gap-1">
                <img src={worstPerformer.image || "/placeholder.svg"} alt={worstPerformer.name} className="w-4 h-4" />
                <span className="text-sm">{worstPerformer.symbol.toUpperCase()}</span>
              </div>
            </div>
            <span className="font-medium text-red-500">{worstPerformer.price_change_percentage_24h.toFixed(2)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Top Coins</h3>
          <div className="grid grid-cols-5 gap-2">
            {coins.slice(0, 5).map((coin) => (
              <div key={coin.id} className="flex flex-col items-center">
                <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8 mb-1" />
                <span className="text-xs text-center">{coin.symbol.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

