/// <reference types="vitest" />
import { vi, describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TicketForm from '../pages/tickets/TicketForm'
import { MemoryRouter } from 'react-router-dom'

// Mock ds to avoid real Firestore calls
vi.mock('../services/dataSource', () => ({
  ds: {
    source: 'local',
    list: async (col: string) => (col === 'categories' ? [{ id: 'c1', name: 'Cat' }] : [{ id: 's1', name: 'Alice', email: 'a@x' }]),
    get: async () => null,
    create: async () => ({ id: 'new' }),
    patch: async () => ({}),
    remove: async () => ({}),
  },
}))

describe('TicketForm', () => {
  it('renders and allows creating a ticket', async () => {
    render(
      <MemoryRouter>
        <TicketForm />
      </MemoryRouter>
    )

  await waitFor(() => expect(screen.getByLabelText(/Subject/i)).toBeTruthy())
    await userEvent.type(screen.getByLabelText(/Subject/i), 'Test subject')
    await userEvent.click(screen.getByRole('button', { name: /Save/i }))

  await waitFor(() => expect(screen.queryByText(/Saving/)).toBeNull())
  })
})
