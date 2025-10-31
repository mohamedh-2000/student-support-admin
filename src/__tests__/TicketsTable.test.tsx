import { vi, describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import TicketsTable from '../pages/tickets/TicketsTable'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../services/dataSource', () => ({
  ds: {
    list: async (col: string) => {
      if (col === 'tickets') return [{ id: 't1', subject: 'S1', categoryId: 'c1', studentId: 's1', status: 'open', createdAt: 'now' }]
      if (col === 'categories') return [{ id: 'c1', name: 'Cat' }]
      return []
    },
    remove: async () => ({}),
  },
}))

describe('TicketsTable', () => {
  it('renders tickets list', async () => {
    render(
      <BrowserRouter>
        <TicketsTable />
      </BrowserRouter>
    )

    await waitFor(() => expect(screen.getByText(/Tickets/i)).toBeTruthy())
  })
})
