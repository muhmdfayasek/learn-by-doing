import React from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './components/App'
import Header from './components/header'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
    <App />
  </React.StrictMode>,
)
