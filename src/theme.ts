import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'ltr', // אם תרצי RTL, תשני ל-'rtl'
  palette: {
    primary: { main: '#1976d2' },
  },
});

export default theme;
