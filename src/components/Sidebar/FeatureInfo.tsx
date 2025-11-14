import { Box, Typography } from '@mui/material'
import type { Feature } from 'ol'

interface Props {
  features: Feature[] | null
}

export const FeatureInfo = ({ features }: Props) => {
  if (!features || features.length === 0) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '300px',
        height: '100%',
        bgcolor: 'white',
        borderLeft: '1px solid #ccc',
        p: 2,
        overflowY: 'auto',
        zIndex: 1000
      }}
    >
      <Typography variant="h6">Feature Info</Typography>
      {features.map((feature, idx) => {
        const { geometry, ...rest } = feature.getProperties()
        return (
          <Box key={idx} sx={{ mb: 2, borderBottom: '1px dashed #ccc', pb: 1 }}>
            {Object.entries(rest).map(([key, value]) => (
              <Typography key={key}>
                <strong>{key}:</strong> {String(value)}
              </Typography>
            ))}
          </Box>
        )
      })}
    </Box>
  )
}
