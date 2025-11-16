import { Stack, Typography } from '@mui/material'
import { CloseButton } from '../ui/CloseButton.tsx'

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
    <CloseButton onClick={onClose} />
  </Stack>
)
