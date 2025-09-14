// src/pages/tickets/TicketsTable.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Paper, IconButton, Typography, Stack, Tooltip } from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'

import type { Ticket, Category } from '../../types/models'
import { LS_KEYS, readLS, writeLS } from '../../utils/storage'

export default function TicketsTable() {
  const [rows, setRows] = useState<Ticket[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setRows(readLS<Ticket[]>(LS_KEYS.tickets, []))
    setCats(readLS<Category[]>(LS_KEYS.categories, []))
  }, [])

  const catNameById = useMemo(() => {
    const map = new Map<string, string>()
    cats.forEach(c => map.set(c.id, c.name))
    return (id?: string) => (id ? map.get(id) ?? '—' : '—')
  }, [cats])

  const handleDelete = useCallback((id: string) => {
    if (!confirm('למחוק את הפנייה לצמיתות?')) return
    const next = rows.filter(r => r.id !== id)
    writeLS(LS_KEYS.tickets, next)
    setRows(next)
  }, [rows])

  // עמודות קומפקטיות + עמודת Actions אחת (גם View וגם Delete)
  const columns: GridColDef<Ticket>[] = [
    { field: 'subject', headerName: 'Subject', flex: 1.4, minWidth: 150 },
    {
      field: 'categoryId',
      headerName: 'Category',
      flex: 1.1,
      minWidth: 130,
      sortable: false,
      renderCell: (p: GridRenderCellParams<Ticket>) => (
        <span>{catNameById(p.row.categoryId)}</span>
      ),
    },
    { field: 'status', headerName: 'Status', width: 100, minWidth: 90 },
    { field: 'createdAt', headerName: 'Created', flex: 1, minWidth: 160 },

    // <<== פעולות
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,                 // רוחב נוח לשני אייקונים
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (p: GridRenderCellParams<Ticket>) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => navigate(`/tickets/${p.row.id}`)}
              aria-label="View ticket details"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(p.row.id)}
              aria-label="Delete ticket"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <Paper
        component="section"
        className="section-card"
        aria-labelledby="tickets-title"
        sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}
      >
        <Typography id="tickets-title" variant="h6" className="section-title">
          Tickets
        </Typography>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
            density="compact"
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': { py: 0.75 },
              '& .MuiDataGrid-cell': { py: 0.75 },
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}
