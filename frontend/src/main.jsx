import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Register Service Worker
// Cache-busting comment: 1781818274044
registerSW({ 
  immediate: true,
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  onNeedRefresh() {
    console.log('New content available, please refresh');
  },
  onRegistered(r) {
    console.log('SW Registered:', r);
  },
  onRegisterError(error) {
    console.error('SW Registration error:', error);
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
