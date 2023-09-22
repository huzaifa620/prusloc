import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import InputProvider from './contexts/Context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InputProvider>
      <App />
    </InputProvider>
  </React.StrictMode>,
)
