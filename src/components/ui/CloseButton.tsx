import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { SxProps, Theme } from '@mui/material'

type Props = {
  onClick: () => void
  sx?: SxProps<Theme>
  position?: 'static' | 'absolute' | 'fixed'
}

export const CloseButton = ({ onClick, sx, position }: Props) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position,
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: 2,
        '&:hover': {
          bgcolor: 'whitesmoke'
        },
        ...sx
      }}
    >
      <CloseIcon />
    </IconButton>
  )
}
