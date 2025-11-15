import { Paper, Typography } from '@mui/material'
import type { Feature } from 'ol'

interface FeatureCardProps {
  feature: Feature
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const properties = { ...feature.getProperties() }
  delete properties.geometry

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 1, borderRadius: 2 }}>
      {Object.entries(properties).map(([key, value]) => (
        <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
          <strong>{key}: </strong> {String(value)}
        </Typography>
      ))}
    </Paper>
  )
}
