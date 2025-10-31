// src/theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  direction: 'ltr', // אם תרצה עברית מלאה — שנה ל-'rtl'
  palette: {
    primary: { main: '#1976d2' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// מוסיף תמיכה רספונסיבית לפונטים
theme = responsiveFontSizes(theme);

export default theme;
