import { IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface SidebarHeaderProps {
  onClose: () => void
}

export const SidebarHeader = ({ onClose }: SidebarHeaderProps) => (
  <Stack
    direction="row"
    spacing={2}
    sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
  >
    <Typography variant="h5">Feature Info</Typography>
    <IconButton
      onClick={onClose}
      sx={{
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: 2,
        '&:hover': {
          bgcolor: '#f0f0f0'
        }
      }}
    >
      <CloseIcon />
    </IconButton>
  </Stack>
)
