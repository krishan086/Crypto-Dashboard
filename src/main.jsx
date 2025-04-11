import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './input.css' // <-- This is essential!
import "../dist/output.css";  // ✅ Correct (relative path)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
