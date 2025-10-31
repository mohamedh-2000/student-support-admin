// src/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  direction: 'rtl', // עברית
  palette: {
    primary: { main: '#1976d2' },
  },
  typography: {
    // עדיף פונטים שתומכים עברית; אם אין – Roboto בסדר
    fontFamily: '"Rubik","Heebo","Assistant","Roboto","Arial",sans-serif',
  },
});

// פונטים רספונסיביים
theme = responsiveFontSizes(theme);

export default theme;
