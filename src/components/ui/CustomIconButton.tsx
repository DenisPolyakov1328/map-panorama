import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

interface CustomIconButtonProps {
  onClick: () => void
  tooltip?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  sx?: SxProps<Theme>
  children: React.ReactNode
}

export const CustomIconButton = ({
  onClick,
  tooltip,
  placement = 'top',
  sx,
  children
}: CustomIconButtonProps) => {
  const button = (
    <IconButton
      onClick={onClick}
      sx={{
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: 2,
        '&:hover': { bgcolor: 'whitesmoke' },
        ...sx
      }}
    >
      {children}
    </IconButton>
  )

  return tooltip ? (
    <Tooltip title={tooltip} placement={placement}>
      {button}
    </Tooltip>
  ) : (
    button
  )
}
