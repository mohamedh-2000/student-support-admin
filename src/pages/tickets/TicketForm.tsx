import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  LinearProgress,
  Stack,
} from '@mui/material'
import { useToast } from '../../components/ToastProvider'
import type { Category, Ticket, Student, TicketStatus } from '../../types/models'
import * as ds from '../../services/dataSource'

export default function TicketForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [subject, setSubject] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [studentId, setStudentId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<TicketStatus>('open');
  const [errors, setErrors] = useState<{ subject?: string; categoryId?: string; studentId?: string }>({})

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [cats, studs] = await Promise.all([
          ds.list<Category>('categories'),
          ds.list<Student>('students'),
        ])
        if (!alive) return
        setCategories(cats)
        setStudents(studs.length ? studs : [{ id: 'me', name: 'Me', email: 'me@example.com' }])

        if (isEdit && id) {
          const tk = await ds.get<Ticket>('tickets', id)
          if (!alive) return
          if (tk) {
            setSubject(tk.subject)
            setCategoryId(tk.categoryId)
            setStudentId(tk.studentId)
            setStatus(tk.status as TicketStatus)
          }
        }
      } catch (e) {
        showToast('Failed to load form data', { severity: 'error' })
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [id, isEdit, showToast])

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault()
    // validate
    const nextErrs: typeof errors = {}
    if (!subject.trim()) nextErrs.subject = 'Subject is required'
    if (!categoryId) nextErrs.categoryId = 'Category is required'
    if (!studentId) nextErrs.studentId = 'Student is required'
    setErrors(nextErrs)
    if (Object.keys(nextErrs).length > 0) return

    setSaving(true)
    try {
      const payload: Partial<Ticket> = {
        subject,
        categoryId: categoryId ?? '',
        studentId: studentId ?? '',
        status,
        createdAt: new Date().toISOString(),
      }

      if (isEdit && id) {
        await ds.patch('tickets', id, payload)
        showToast('Ticket updated', { severity: 'success' })
      } else {
        await ds.create('tickets', payload)
        showToast('Ticket created', { severity: 'success' })
      }
      navigate('/tickets')
    } catch (e) {
      showToast('Save failed', { severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LinearProgress sx={{ my: 1 }} />

  return (
    <Box>
      <Paper component="section" className="section-card" sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Typography variant="h6" className="section-title">
          {isEdit ? 'Edit Ticket' : 'New Ticket'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              required
              error={!!errors.subject}
              helperText={errors.subject || ' '}
            />

            <TextField
              select
              label="Category"
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(e.target.value)}
              fullWidth
              required
              error={!!errors.categoryId}
              helperText={errors.categoryId || ' '}
            >
              <MenuItem value="">—</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Student"
              value={studentId ?? ''}
              onChange={(e) => setStudentId(e.target.value)}
              fullWidth
              required
              error={!!errors.studentId}
              helperText={errors.studentId || ' '}
            >
              <MenuItem value="">—</MenuItem>
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
              fullWidth
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/tickets')} disabled={saving}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

