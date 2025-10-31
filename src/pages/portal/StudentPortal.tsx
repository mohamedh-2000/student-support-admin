import { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, Chip, Stack, LinearProgress, Divider } from '@mui/material';
import * as ds from '../../services/dataSource';
import type { Ticket, Category } from '../../types/models';

export default function StudentPortal() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [tks, cts] = await Promise.all([
          ds.list<Ticket>('tickets'),
          ds.list<Category>('categories'),
        ]);
        if (!alive) return;
        setTickets(tks);
        setCats(cts);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const countByCat = useMemo(() => {
    const m = new Map<string, number>();
    tickets.forEach(t => m.set(t.categoryId, (m.get(t.categoryId) ?? 0) + 1));
    return m;
  }, [tickets]);

  return (
    <Box>
      <Paper className="section-card" sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Typography variant="h6" className="section-title">Student Portal</Typography>
        {loading && <LinearProgress sx={{ my: 1 }} />}

        <Typography variant="subtitle1" sx={{ mt: 1 }}>Tickets by Category</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', my: 1 }}>
          {cats.map(c => (
            <Chip key={c.id} label={`${c.name} (${countByCat.get(c.id) ?? 0})`} />
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>Recent Tickets</Typography>
        <Stack spacing={1}>
          {tickets.slice(0, 5).map(t => (
            <Paper key={t.id} sx={{ p: 1.5 }}>
              <Typography variant="body1">{t.subject}</Typography>
              <Typography variant="caption" color="text.secondary">{t.createdAt}</Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
