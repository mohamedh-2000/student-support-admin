import { Box, Paper, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box p={1}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Student Support Admin
        </Typography>
        <Typography>
          כאן תוכל/י לנהל פניות, קטגוריות והודעות. השתמש/י בתפריט משמאל כדי לנווט בין המסכים.
        </Typography>
        <Typography sx={{ mt: 1 }} color="text.secondary">
          הערה: אם ה-LocalStorage היה ריק, נטענו נתוני דמו לכל הישויות.
        </Typography>
      </Paper>
    </Box>
  );
}
