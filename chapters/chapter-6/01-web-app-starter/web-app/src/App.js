import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'

import Header from './components/Header'
import Home from './components/Home'
import Auction from './components/Auction'
import NotFound from './components/NotFound'
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

const cache = createCache({
  key: 'css',
  prepend: true,
})

const theme = createTheme({
  palette: {
    background: {
      default: '#FAFAFA'
    }
  }
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cache}>
        <div className='App'>
          <CssBaseline />
          <Header />
          <Layout>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/auctions/:address' element={<Auction />} />
              <Route
                path='*'
                element={<NotFound />}
              />
            </Routes>
          </Layout>
        </div>
      </CacheProvider>
    </ThemeProvider>
  )
}
