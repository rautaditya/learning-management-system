import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import '../src/index.css';

import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <AuthProvider> {/* ✅ This must wrap your app */}

    <BrowserRouter>
      <App />

    </BrowserRouter>
        </AuthProvider>
  </React.StrictMode>,
)
