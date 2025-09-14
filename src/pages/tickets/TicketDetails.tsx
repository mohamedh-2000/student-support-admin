import { useMemo, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  TextField,
  Button,
  Stack,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import type { Ticket, Category, Message } from '../../types/models'
import { LS_KEYS, readLS, writeLS } from '../../utils/storage'
import { useToast } from '../../components/ToastProvider'

export default function TicketDetails() {
  const { showToast } = useToast()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const tickets    = readLS<Ticket[]>(LS_KEYS.tickets, [])
  const messages   = readLS<Message[]>(LS_KEYS.messages, [])
  const categories = readLS<Category[]>(LS_KEYS.categories, [])

  const ticket = useMemo(() => tickets.find(t => t.id === id), [tickets, id])
  const catName = useMemo(
    () => categories.find(c => c.id === ticket?.categoryId)?.name ?? '—',
    [categories, ticket]
  )
  const thread = useMemo(
    () => messages.filter(m => m.ticketId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [messages, id]
  )

  const [reply, setReply] = useState('')
  const [err, setErr] = useState('')

  function addReply(e: React.FormEvent) {
    e.preventDefault()
    if (!ticket) return

    const trimmed = reply.trim()
    if (!trimmed) {
      setErr('שדה חובה')
      return
    }

    const newMsg: Message = {
      id: uuid(),
      ticketId: ticket.id,
      author: 'staff',
      body: trimmed,
      createdAt: new Date().toISOString(),
    }

    const nextMsgs = [...readLS<Message[]>(LS_KEYS.messages, []), newMsg]
    writeLS(LS_KEYS.messages, nextMsgs)

    setReply('')
    setErr('')
    showToast('Reply added', { severity: 'success' })
  }

  if (!ticket) {
    return (
      <Paper component="section" className="section-card">
        <Typography variant="h6" className="section-title">Ticket not found</Typography>
        <Button sx={{ mt: 1 }} onClick={() => navigate('/tickets')} variant="outlined">
          Back to list
        </Button>
      </Paper>
    )
  }

  return (
    <Box>
      <Paper component="section" className="section-card" aria-labelledby="ticket-title">
        <Typography id="ticket-title" variant="h6" className="section-title">
          {ticket.subject}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`Category: ${catName}`} />
          <Chip
            label={`Status: ${ticket.status}`}
            color={ticket.status === 'open' ? 'primary' : ticket.status === 'closed' ? 'default' : 'warning'}
            variant="outlined"
          />
          <Chip label={new Date(ticket.createdAt).toLocaleString()} variant="outlined" />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {thread.length === 0 && (
            <Typography className="text-muted">No messages yet.</Typography>
          )}

          {thread.map(m => (
            <Paper key={m.id} sx={{ p: 1.5, bgcolor: m.author === 'student' ? '#fff' : '#f4f6f8' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Chip
                  size="small"
                  label={m.author === 'student' ? 'Student' : 'Staff'}
                  color={m.author === 'student' ? 'default' : 'primary'}
                  variant="outlined"
                />
                <Typography variant="caption" className="text-muted">
                  {new Date(m.createdAt).toLocaleString()}
                </Typography>
              </Stack>
              <Typography>{m.body}</Typography>
            </Paper>
          ))}
        </Stack>

        <form onSubmit={addReply} className="form-grid" noValidate>
          <TextField
            className="full-row"
            label="Add reply*"
            multiline
            minRows={3}
            value={reply}
            onChange={(e) => {
              setReply(e.target.value)
              if (err) setErr('')
            }}
            required
            error={!!err}
            helperText={err || ' '}
            fullWidth
          />
          <div className="full-row">
            <Button type="submit" variant="contained" disabled={!reply.trim()}>
              Send Reply
            </Button>
            <Button sx={{ ml: 1 }} variant="text" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </form>
      </Paper>
    </Box>
  )
}
