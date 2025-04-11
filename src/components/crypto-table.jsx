"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { StarIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export default function CryptoTable({
  coins,
  loading,
  onSelect,
  favorites,
  onToggleFavorite,
  emptyMessage = "No coins found. Try adjusting your search.",
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "market_cap_rank",
    direction: "asc",
  })

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getSortedCoins = () => {
    if (!sortConfig.key) return coins

    return [...coins].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) {
      return null
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 ml-1" />
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (coins.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort("market_cap_rank")}>
              <div className="flex items-center"># {getSortIcon("market_cap_rank")}</div>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => requestSort("current_price")}>
              <div className="flex items-center justify-end">Price {getSortIcon("current_price")}</div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => requestSort("price_change_percentage_24h")}>
              <div className="flex items-center justify-end">24h % {getSortIcon("price_change_percentage_24h")}</div>
            </TableHead>
            <TableHead
              className="text-right cursor-pointer hidden md:table-cell"
              onClick={() => requestSort("market_cap")}
            >
              <div className="flex items-center justify-end">Market Cap {getSortIcon("market_cap")}</div>
            </TableHead>
            <TableHead
              className="text-right hidden md:table-cell cursor-pointer"
              onClick={() => requestSort("total_volume")}
            >
              <div className="flex items-center justify-end">Volume (24h) {getSortIcon("total_volume")}</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSortedCoins().map((coin) => (
            <TableRow key={coin.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelect(coin)}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(coin.id)
                  }}
                >
                  <StarIcon
                    className={`h-4 w-4 ${favorites.includes(coin.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
                </Button>
              </TableCell>
              <TableCell>{coin.market_cap_rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
                  <div className="flex flex-col">
                    <span className="font-medium">{coin.name}</span>
                    <span className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">${coin.current_price.toLocaleString()}</TableCell>
              <TableCell
                className={`text-right ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">${coin.market_cap.toLocaleString()}</TableCell>
              <TableCell className="text-right hidden md:table-cell">${coin.total_volume.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

