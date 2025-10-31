import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
type Props = {
  onOpenMobile?: () => void
}

export default function Header({ onOpenMobile }: Props) {
  const navigate = useNavigate()

  return (
    <AppBar position="fixed" component="header" aria-label="Application header">
      <Toolbar>
        {onOpenMobile && (
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 1, display: { sm: 'none' } }}
            onClick={onOpenMobile}
            aria-label="open navigation"
            size="large"
          >
            <MenuIcon />
          </IconButton>
        )}

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
