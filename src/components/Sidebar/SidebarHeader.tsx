import { Typography } from '@mui/material'
import { CustomIconButton } from '../ui/CustomIconButton.tsx'
import CloseIcon from '@mui/icons-material/Close'
import { CustomStack } from '../ui/CustomStack.tsx'

interface SidebarHeaderProps {
  onClose: () => void
}

export const SidebarHeader = ({ onClose }: SidebarHeaderProps) => (
  <CustomStack
    direction="row"
    sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
  >
    <Typography variant="h5">Feature Info</Typography>
    <CustomIconButton children={<CloseIcon />} onClick={onClose} />
  </CustomStack>
)
