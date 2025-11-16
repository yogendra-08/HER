/**
 * Main Entry Point for VastraVerse Frontend
 * React application with routing and global styles
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'
import './styles/globals.css'

// Add theme class to document element on initial load
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

document.documentElement.classList.add(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2C1810',
            color: '#F7F4EF',
            borderRadius: '12px',
            padding: '16px 20px',
            fontFamily: 'Inter, Lato, sans-serif',
            letterSpacing: '0.02em',
            boxShadow: '0 10px 15px -3px rgba(196, 158, 84, 0.2), 0 4px 6px -2px rgba(196, 158, 84, 0.1)',
          },
          success: {
            style: {
              background: '#4A2E29',
              border: '1px solid #C49E54',
            },
          },
          error: {
            style: {
              background: '#8B3A3A',
              border: '1px solid #C49E54',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
