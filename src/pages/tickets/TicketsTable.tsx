// src/pages/tickets/TicketsTable.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Paper, IconButton, Typography, Stack, Tooltip, LinearProgress } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import type { Ticket, Category } from '../../types/models';
import * as ds from '../../services/dataSource';
import { useToast } from '../../components/ToastProvider';

// תומך גם במחרוזת וגם ב-Firestore Timestamp
function fmtDate(v: any) {
  if (!v) return '—';
  if (typeof v === 'string') return new Date(v).toLocaleString();
  if (v?.toDate) return v.toDate().toLocaleString(); // Timestamp
  return '—';
}

export default function TicketsTable() {
  const [rows, setRows] = useState<Ticket[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [tickets, categories] = await Promise.all([
          ds.list<Ticket>('tickets'),
          ds.list<Category>('categories'),
        ]);
        if (!alive) return;
        setRows(tickets);
        setCats(categories);
      } catch (e) {
        showToast('Failed to load tickets', { severity: 'error' });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [showToast]);

  const catNameById = useMemo(() => {
    const map = new Map<string, string>();
    cats.forEach(c => map.set(c.id, c.name));
    return (id?: string) => (id ? map.get(id) ?? '—' : '—');
  }, [cats]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('למחוק את הפנייה לצמיתות?')) return;
    try {
      await ds.remove('tickets', id);
      setRows(prev => prev.filter(r => r.id !== id));
      showToast('נמחק בהצלחה', { severity: 'success' });
    } catch {
      showToast('מחיקה נכשלה', { severity: 'error' });
    }
  }, [showToast]);

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
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      minWidth: 160,
      renderCell: (p: GridRenderCellParams<Ticket>) => <span>{fmtDate(p.row.createdAt as any)}</span>,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
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
  ];

  return (
    <Box>
      <Paper component="section" className="section-card" aria-labelledby="tickets-title" sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Typography id="tickets-title" variant="h6" className="section-title">
          Tickets
        </Typography>

        {loading && <LinearProgress sx={{ my: 1 }} />}

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
              '& .MuiDataGrid-footerContainer': {
                '& .MuiTablePagination-root': { whiteSpace: 'nowrap', '& .MuiTablePagination-spacer': { display: 'none' } },
                '& .MuiTablePagination-displayedRows': { whiteSpace: 'nowrap' },
                '& .MuiTablePagination-selectLabel': { whiteSpace: 'nowrap' },
              },
              '& .MuiTablePagination-root': { whiteSpace: 'nowrap' },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
