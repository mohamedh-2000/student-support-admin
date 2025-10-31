import { Drawer, List, ListItemButton, ListItemText, Toolbar, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const DRAWER_WIDTH = 280
type Props = {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export default function NavDrawer({ mobileOpen, onCloseMobile }: Props) {
  const navigate = useNavigate()

  const content = (
    <>
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
        <ListItemButton onClick={() => navigate('/bootstrap')}>
          <ListItemText primary="Learning: Bootstrap" />
        </ListItemButton>
      </List>
    </>
  )

  return (
    <Box component="nav" aria-label="Main navigation">
      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={!!mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {content}
      </Drawer>

      {/* Permanent drawer for larger screens */}
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
        {content}
      </Drawer>
    </Box>
  )
}
