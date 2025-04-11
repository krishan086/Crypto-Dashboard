"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { MoonIcon, SunIcon, SearchIcon, StarIcon } from "lucide-react"
import { useTheme } from "./theme-provider"
import CryptoTable from "./crypto-table"
import CryptoChart from "./crypto-chart"
import MarketOverview from "./market-overview"
import { Badge } from "./ui/badge"
import LoadingDashboard from "./loading-dashboard"

export default function CryptoDashboard() {
  const [coins, setCoins] = useState([])
  const [filteredCoins, setFilteredCoins] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [favorites, setFavorites] = useState([])
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d",
        )

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()
        setCoins(data)
        setFilteredCoins(data)
        setSelectedCoin(data[0])
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCoins()

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("cryptoFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Set up polling for real-time updates (every 60 seconds)
    const interval = setInterval(fetchCoins, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCoins(filtered)
    } else {
      setFilteredCoins(coins)
    }
  }, [searchTerm, coins])

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem("cryptoFavorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (coinId) => {
    if (favorites.includes(coinId)) {
      setFavorites(favorites.filter((id) => id !== coinId))
    } else {
      setFavorites([...favorites, coinId])
    }
  }

  const getFavoriteCoins = () => {
    return filteredCoins.filter((coin) => favorites.includes(coin.id))
  }

  if (loading) {
    return <LoadingDashboard />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {coins.length > 0 ? `${coins[0]?.last_updated?.split("T")[0]}` : "Loading..."}
          </Badge>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedCoin && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={selectedCoin.image || "/placeholder.svg"} alt={selectedCoin.name} className="w-8 h-8" />
                    <CardTitle>
                      {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(selectedCoin.id)}>
                    <StarIcon
                      className={`h-5 w-5 ${favorites.includes(selectedCoin.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                </div>
                <CardDescription>
                  Current Price: ${selectedCoin.current_price.toLocaleString()}
                  <span
                    className={`ml-2 ${selectedCoin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {selectedCoin.price_change_percentage_24h >= 0 ? "↑" : "↓"}
                    {Math.abs(selectedCoin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CryptoChart coinId={selectedCoin.id} coinName={selectedCoin.name} />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <MarketOverview coins={coins.slice(0, 5)} />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Coins</TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites
            {favorites.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {favorites.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CryptoTable
            coins={filteredCoins}
            loading={loading}
            onSelect={setSelectedCoin}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>
        <TabsContent value="favorites">
          <CryptoTable
            coins={getFavoriteCoins()}
            loading={loading}
            onSelect={setSelectedCoin}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            emptyMessage="No favorite coins yet. Star coins to add them to your favorites."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

