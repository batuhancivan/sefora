import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <CatalogProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </CatalogProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
