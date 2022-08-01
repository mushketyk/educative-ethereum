import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auction from './components/Auction'
import Header from './components/Header'
import Home from './components/Home'
import Layout from './components/Layout'
import NotFound from './components/NotFound'
import RequireWallet from './components/RequireWallet'

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
              <Route path='/auctions/:address' element={
                <RequireWallet>
                  <Auction />
                </RequireWallet>
              } />
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
