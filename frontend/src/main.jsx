import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { Toaster } from "react-hot-toast";

<React.StrictMode>
    <>
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
            }}
        />

        <App />
    </>
</React.StrictMode>

