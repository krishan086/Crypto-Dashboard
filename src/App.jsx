import { ThemeProvider } from "./components/theme-provider"
import CryptoDashboard from "./components/crypto-dashboard"
import "./App.css"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Crypto Dashboard <span className="text-sm font-normal text-muted-foreground">by Krishan Kant</span>
          </h1>
          <CryptoDashboard />
        </div>
      </main>
    </ThemeProvider>
  )
}

export default App

