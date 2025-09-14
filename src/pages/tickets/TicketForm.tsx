import { useMemo, useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
} from '@mui/material'
import { v4 as uuid } from 'uuid'

import type { Category, Ticket, Message, Student } from '../../types/models'
import { LS_KEYS, readLS, writeLS } from '../../utils/storage'
import { useToast } from '../../components/ToastProvider'

type Errs = {
  subject: string
  categoryId: string
  otherText: string
  body: string
}

const EMPTY_ERRS: Errs = { subject: '', categoryId: '', otherText: '', body: '' }

export default function TicketForm() {
  const { showToast } = useToast()

  const categories = readLS<Category[]>(LS_KEYS.categories, [])
  const fallbackStudents: Student[] = [{ id: 'me', name: 'Me', email: 'me@example.com' }]
  const students = readLS<Student[]>(LS_KEYS.students, fallbackStudents)
  const me = students[0]

  const [subject, setSubject] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [otherText, setOtherText] = useState('')
  const [body, setBody] = useState('')
  const [errs, setErrs] = useState<Errs>(EMPTY_ERRS)

  const otherId = useMemo(
    () =>
      categories.find(
        (c) => c.name.trim().toLowerCase() === 'אחר' || c.name.trim().toLowerCase() === 'other'
      )?.id,
    [categories]
  )
  const isOther = categoryId === otherId
  const noCategories = categories.length === 0

  function buildErrors(): Errs {
    return {
      subject: subject.trim() ? '' : 'שדה חובה',
      categoryId: categoryId ? '' : 'שדה חובה',
      otherText: isOther ? (otherText.trim() ? '' : 'שדה חובה') : '',
      body: body.trim() ? '' : 'שדה חובה',
    }
  }
  function hasAnyError(e: Errs) {
    return !!(e.subject || e.categoryId || e.otherText || e.body)
  }

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrs = buildErrors()
    setErrs(nextErrs)
    if (hasAnyError(nextErrs)) {
      showToast('נא למלא את כל שדות החובה', { severity: 'error' })
      return
    }

    const id = uuid()
    const ticket: Ticket = {
      id,
      subject: subject.trim(),
      categoryId,
      studentId: me.id,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    const firstMsg: Message = {
      id: uuid(),
      ticketId: id,
      author: 'student',
      body: (isOther ? `[Other: ${otherText.trim()}] ` : '') + body.trim(),
      createdAt: ticket.createdAt,
    }

    writeLS(LS_KEYS.tickets,  [ticket,  ...readLS<Ticket[]>(LS_KEYS.tickets,  [])])
    writeLS(LS_KEYS.messages, [firstMsg, ...readLS<Message[]>(LS_KEYS.messages, [])])

    showToast('Ticket saved successfully', { severity: 'success' })

    setErrs(EMPTY_ERRS)
    setSubject('')
    setBody('')
    setOtherText('')
    setCategoryId(categories[0]?.id ?? '')
  }

  function validateField(name: keyof Errs) {
    setErrs(prev => {
      const next = { ...prev }
      switch (name) {
        case 'subject':
          next.subject = subject.trim() ? '' : 'שדה חובה'; break
        case 'categoryId':
          next.categoryId = categoryId ? '' : 'שדה חובה'; break
        case 'otherText':
          next.otherText = isOther ? (otherText.trim() ? '' : 'שדה חובה') : ''; break
        case 'body':
          next.body = body.trim() ? '' : 'שדה חובה'; break
      }
      return next
    })
  }

  return (
    <Box>
      <Paper component="section" className="section-card">
        <Typography variant="h6" className="section-title" id="new-ticket-title">
          New Ticket
        </Typography>

        <form onSubmit={onSave} aria-labelledby="new-ticket-title" noValidate>
          <div className="form-grid">
            <TextField
              label="Subject*"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={() => validateField('subject')}
              required
              error={!!errs.subject}
              helperText={errs.subject || ' '}
              fullWidth
            />

            <TextField
              select
              label="Category*"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              onBlur={() => validateField('categoryId')}
              required
              error={!!errs.categoryId}
              helperText={errs.categoryId || (noCategories ? 'אין קטגוריות — צור/י קודם Category' : ' ')}
              fullWidth
              disabled={noCategories}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>

            {isOther && (
              <TextField
                label="Other topic*"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                onBlur={() => validateField('otherText')}
                required
                error={!!errs.otherText}
                helperText={errs.otherText || ' '}
                fullWidth
              />
            )}

            <TextField
              label="Message*"
              multiline
              minRows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onBlur={() => validateField('body')}
              required
              error={!!errs.body}
              helperText={errs.body || ' '}
              fullWidth
              className="full-row"
            />

            <div className="full-row">
              <Button type="submit" variant="contained" disabled={noCategories}>
                Save Ticket
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </Box>
  )
}
