import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TopSongs from './pages/topSongs.jsx'

const Root = window.location.pathname === '/topSongs' ? TopSongs : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
