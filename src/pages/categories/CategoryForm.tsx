import { useEffect, useState } from 'react'
import { Box, Paper, TextField, Button, Typography } from '@mui/material'
import { v4 as uuid } from 'uuid'
import type { Category } from '../../types/models'
import { LS_KEYS, readLS, writeLS } from '../../utils/storage'
import { useToast } from '../../components/ToastProvider'

type Errs = { name: string }
const EMPTY_ERRS: Errs = { name: '' }

export default function CategoryForm() {
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [existing, setExisting] = useState<Category[]>([])
  const [errs, setErrs] = useState<Errs>(EMPTY_ERRS)

  useEffect(() => {
    setExisting(readLS<Category[]>(LS_KEYS.categories, []))
  }, [])

  const dup = existing.some(
    c => c.name.trim().toLowerCase() === name.trim().toLowerCase()
  )

  function validate(): Errs {
    return {
      name: !name.trim()
        ? 'שדה חובה'
        : dup
        ? 'שם כבר קיים'
        : '',
    }
  }

  function onBlurField() {
    setErrs(validate())
  }

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrs = validate()
    setErrs(nextErrs)
    if (nextErrs.name) {
      showToast(nextErrs.name === 'שם כבר קיים' ? 'השם כבר קיים' : 'נא למלא שם', {
        severity: nextErrs.name === 'שם כבר קיים' ? 'warning' : 'error',
      })
      return
    }

    const next: Category = { id: uuid(), name: name.trim() }
    writeLS(LS_KEYS.categories, [next, ...existing])

    showToast('Category saved successfully', { severity: 'success' })
    setErrs(EMPTY_ERRS)
    setName('')
    setExisting(readLS<Category[]>(LS_KEYS.categories, []))
  }

  return (
    <Box>
      <Paper component="section" className="section-card" aria-labelledby="new-category-title">
        <Typography variant="h6" className="section-title" id="new-category-title">
          New Category
        </Typography>

        <form onSubmit={onSave} noValidate>
          <div className="form-grid">
            <TextField
              label="Category name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={onBlurField}
              required
              fullWidth
              error={!!errs.name}
              helperText={errs.name || ' '}
              className="full-row"
            />
            <div className="full-row">
              <Button variant="contained" type="submit">Save Category</Button>
            </div>
          </div>
        </form>
      </Paper>
    </Box>
  )
}
