import { Paper, Typography } from '@mui/material'
import type { Feature } from 'ol'

interface FeatureCardProps {
  feature: Feature
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const { geometry, ...rest } = feature.getProperties()
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 1,
        borderRadius: 2
      }}
    >
      {Object.entries(rest).map(([key, value]) => (
        <Typography key={key} sx={{ mb: 0.5 }}>
          <strong>{key}: </strong> {String(value)}
        </Typography>
      ))}
    </Paper>
  )
}
