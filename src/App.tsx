// src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import { ToastProvider } from './components/ToastProvider'   // <- ייבוא שמי

import Header from './components/Header'
import NavDrawer from './components/NavDrawer'

import Home from './pages/Home'
import TicketsTable from './pages/tickets/TicketsTable'
import TicketForm from './pages/tickets/TicketForm'
import TicketDetails from './pages/tickets/TicketDetails'
import CategoriesTable from './pages/categories/CategoriesTable'
import CategoryForm from './pages/categories/CategoryForm'

import { runSeedIfEmpty } from './data/seed'

const DRAWER_WIDTH = 280

export default function App() {
  useEffect(() => {
    runSeedIfEmpty()
  }, [])

  return (
    <ToastProvider>
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <Header />
          <NavDrawer />
          <Box component="main" role="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `${DRAWER_WIDTH}px` } }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tickets" element={<TicketsTable />} />
              <Route path="/tickets/new" element={<TicketForm />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
              <Route path="/categories" element={<CategoriesTable />} />
              <Route path="/categories/new" element={<CategoryForm />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ToastProvider>
  )
}
