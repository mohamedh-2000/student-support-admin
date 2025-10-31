import { Box, Paper, Typography, Chip, Stack } from '@mui/material'
import { ds } from '../services/dataSource'
import { db, isFirestore } from '../lib/firebase'

export default function DebugPage() {
  return (
    <Box>
      <Paper className="section-card" sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Typography variant="h6" className="section-title">Debug</Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Typography>Data source: <Chip label={ds.source} /></Typography>
          <Typography>isFirestore: <Chip label={String(isFirestore)} /></Typography>
          <Typography>Firestore db initialized: <Chip label={String(Boolean(db))} /></Typography>
          <Typography>Available ds functions: <Chip label={Object.keys(ds).join(', ')} /></Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
