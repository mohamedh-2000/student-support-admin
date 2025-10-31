// src/pages/tickets/TicketDetails.tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  TextField,
  Button,
  Stack,
  LinearProgress,
} from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import type { Ticket, Category, Message } from '../../types/models';
import * as ds from '../../services/dataSource';
import { useToast } from '../../components/ToastProvider';

// עזרים לתאריכים/מיון
function toMillis(v: any): number {
  if (!v) return 0;
  if (typeof v === 'string') return new Date(v).getTime();
  if (v?.toDate) return v.toDate().getTime();
  return 0;
}
function fmtDate(v: any) {
  if (!v) return '—';
  if (typeof v === 'string') return new Date(v).toLocaleString();
  if (v?.toDate) return v.toDate().toLocaleString();
  return '—';
}

export default function TicketDetails() {
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [thread, setThread] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [err, setErr] = useState('');

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const t = await ds.get<Ticket>('tickets', id);
      setTicket(t ?? null);

      if (t?.categoryId) {
        // Load all categories once – או get לפי id אם תרצה
        const cats = await ds.list<Category>('categories');
        setCategory(cats.find(c => c.id === t.categoryId) ?? null);
      } else {
        setCategory(null);
      }

      const allMsgs = await ds.list<Message>('messages');
      const msgs = allMsgs
        .filter(m => m.ticketId === id)
        .sort((a, b) => toMillis(a.createdAt as any) - toMillis(b.createdAt as any));
      setThread(msgs);
    } catch (e) {
      showToast('Failed to load ticket', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const catName = useMemo(() => category?.name ?? '—', [category]);

  async function addReply(e: React.FormEvent) {
    e.preventDefault();
    if (!ticket || !id) return;

    const trimmed = reply.trim();
    if (!trimmed) {
      setErr('שדה חובה');
      return;
    }

    try {
      // שומר ל-Firestore (ds.create מוסיף serverTimestamp())
      const newMsg: Omit<Message, 'id'> = {
        ticketId: id,
        author: 'staff',
        body: trimmed,
        // createdAt יגיע מ-serverTimestamp; אין צורך לשים כאן מחרוזת, אבל זה לא מזיק אם תרצה לשים Optimistic UI
      } as any;

      await ds.create<Message>('messages', newMsg);

      setReply('');
      setErr('');
      showToast('Reply added', { severity: 'success' });

      // טען מחדש כדי לקבל את ה-Timestamp מהשרת
      await loadData();
    } catch {
      showToast('Failed to add reply', { severity: 'error' });
    }
  }

  if (loading) {
    return <LinearProgress />;
  }

  if (!ticket) {
    return (
      <Paper component="section" className="section-card" sx={{ p: 2 }}>
        <Typography variant="h6" className="section-title">Ticket not found</Typography>
        <Button sx={{ mt: 1 }} onClick={() => navigate('/tickets')} variant="outlined">
          Back to list
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper component="section" className="section-card" aria-labelledby="ticket-title" sx={{ p: 2 }}>
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
          <Chip label={fmtDate(ticket.createdAt as any)} variant="outlined" />
          <Chip label={<Link to="/tickets">Back to list</Link>} variant="outlined" />
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
                  {fmtDate(m.createdAt as any)}
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
              setReply(e.target.value);
              if (err) setErr('');
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
  );
}
