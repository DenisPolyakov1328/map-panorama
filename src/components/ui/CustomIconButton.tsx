import React from 'react'
import { IconButton } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

interface CustomIconButtonProps {
  onClick: () => void
  sx?: SxProps<Theme>
  children: React.ReactNode
}

export const CustomIconButton = ({
  onClick,
  sx,
  children
}: CustomIconButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: 2,
        '&:hover': {
          bgcolor: 'whitesmoke'
        },
        ...sx
      }}
    >
      {children}
    </IconButton>
  )
}
