import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const DRAWER_WIDTH = 280

export default function NavDrawer() {
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        display: { xs: 'none', sm: 'block' },
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <Toolbar />
      <List>
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/tickets')}>
          <ListItemText primary="Tickets" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/tickets/new')}>
          <ListItemText primary="New Ticket" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/categories')}>
          <ListItemText primary="Categories" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/categories/new')}>
          <ListItemText primary="New Category" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}
