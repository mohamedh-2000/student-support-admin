import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import type { Category, Ticket } from '../../types/models'
import { LS_KEYS, readLS, writeLS } from '../../utils/storage'
import { useToast } from '../../components/ToastProvider'

export default function CategoriesTable() {
  const { showToast } = useToast()

  const [rows, setRows] = useState<Category[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])

  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState<string>('')
  const [editError, setEditError] = useState<string>('')

  useEffect(() => {
    setRows(readLS<Category[]>(LS_KEYS.categories, []))
    setTickets(readLS<Ticket[]>(LS_KEYS.tickets, []))
  }, [])

  const usedCounts = useMemo(() => {
    const m = new Map<string, number>()
    tickets.forEach(t => {
      const key = t.categoryId ?? ''
      if (!key) return
      m.set(key, (m.get(key) ?? 0) + 1)
    })
    return m
  }, [tickets])

  const isInUse = useCallback(
    (id: string) => (usedCounts.get(id) ?? 0) > 0,
    [usedCounts]
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (isInUse(id)) {
        showToast('לא ניתן למחוק – הקטגוריה בשימוש', { severity: 'warning' })
        return
      }
      if (!confirm('למחוק את הקטגוריה לצמיתות?')) return
      const next = rows.filter(c => c.id !== id)
      writeLS(LS_KEYS.categories, next)
      setRows(next)
      showToast('Category deleted', { severity: 'success' })
    },
    [rows, isInUse, showToast]
  )

  const openEdit = useCallback((c: Category) => {
    setEditId(c.id)
    setEditName(c.name)
    setEditError('')
  }, [])

  const closeEdit = useCallback(() => {
    setEditId(null)
    setEditName('')
    setEditError('')
  }, [])

  const saveEdit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!editId) return

      const trimmed = editName.trim()
      if (!trimmed) {
        setEditError('שם הוא שדה חובה')
        return
      }

      const duplicated = rows
        .filter(c => c.id !== editId)
        .some(c => c.name.trim().toLowerCase() === trimmed.toLowerCase())

      if (duplicated) {
        setEditError('שם הקטגוריה כבר קיים')
        showToast('שם הקטגוריה כבר קיים', { severity: 'warning' })
        return
      }

      const next = rows.map(c =>
        c.id === editId ? { ...c, name: trimmed } : c
      )
      writeLS(LS_KEYS.categories, next)
      setRows(next)
      closeEdit()
      showToast('Category renamed', { severity: 'success' })
    },
    [editId, editName, rows, closeEdit, showToast]
  )

  return (
    <Box>
      <Paper component="section" className="section-card" aria-labelledby="categories-title">
        <Typography id="categories-title" variant="h6" className="section-title">
          Categories
        </Typography>

        <TableContainer>
          <Table size="small" aria-label="Categories table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right"># Tickets</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((c) => {
                const count = usedCounts.get(c.id) ?? 0
                const disableDelete = count > 0
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.name}</TableCell>
                    <TableCell align="right">{count}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Rename category">
                        <IconButton
                          size="small"
                          onClick={() => openEdit(c)}
                          aria-label="Rename"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          disableDelete
                            ? 'לא ניתן למחוק – הקטגוריה בשימוש'
                            : 'Delete category'
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={disableDelete}
                            onClick={() => handleDelete(c.id)}
                            aria-label="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!editId} onClose={closeEdit} maxWidth="xs" fullWidth>
        <DialogTitle>Rename Category</DialogTitle>
        <form onSubmit={saveEdit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              autoFocus
              label="New name*"
              fullWidth
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value)
                setEditError('')
              }}
              error={!!editError}
              helperText={editError || ' '}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEdit}>Cancel</Button>
            <Button variant="contained" type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
