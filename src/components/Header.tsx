import { AppBar, Toolbar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <AppBar position="fixed" component="header" aria-label="Application header">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
          aria-label="Go to home"
          title="Student Support Admin"
        >
          Student Support Admin
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
