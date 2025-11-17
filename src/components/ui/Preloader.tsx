import { Box, CircularProgress } from '@mui/material'

interface PreloaderProps {
  size?: number
  color?: string
}

export const Preloader = ({ size = 40, color = 'white' }: PreloaderProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <CircularProgress size={size} sx={{ color }} />
    </Box>
  )
}
