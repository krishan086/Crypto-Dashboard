"use client"

import React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext(null)

function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback(
    (newValue) => {
      setSelectedValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, value, children, ...props }) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
        className,
      )}
      onClick={() => context?.onValueChange(value)}
      data-state={isActive ? "active" : "inactive"}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ className, value, children, ...props }) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  if (!isActive) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      data-state={isActive ? "active" : "inactive"}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

