import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { PublicSiteProvider } from './content/PublicSiteProvider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <PublicSiteProvider><App /></PublicSiteProvider>
  </StrictMode>
  </BrowserRouter>,
)
