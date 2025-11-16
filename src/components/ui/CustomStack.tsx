import { Stack } from '@mui/material'
import type { StackProps } from '@mui/material'

export const CustomStack = ({ sx, children, ...rest }: StackProps) => (
  <Stack
    sx={{ justifyContent: 'space-between', alignItems: 'center', ...sx }}
    {...rest}
  >
    {children}
  </Stack>
)
