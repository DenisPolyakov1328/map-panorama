import { Box, Slide } from '@mui/material'
import type { Feature } from 'ol'
import { SidebarHeader } from './SidebarHeader.tsx'
import { FeatureCard } from './FeatureCard.tsx'

interface SidebarProps {
  features: Feature[] | null
  onClose: () => void
}

export const Sidebar = ({ features, onClose }: SidebarProps) => {
  const hasFeatures = !!features && features.length > 0

  const getDisplayFeatures = (list: Feature[]): Feature[] =>
    list.flatMap((feature) => {
      const clusterFeatures = feature.get('features') as Feature[] | undefined
      return clusterFeatures && clusterFeatures.length > 0
        ? clusterFeatures
        : [feature]
    })

  const displayFeatures = features ? getDisplayFeatures(features) : []

  return (
    <Slide direction="left" in={hasFeatures} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          bgcolor: 'whitesmoke',
          borderLeft: '1px solid #ccc',
          p: 2,
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: 3
        }}
      >
        <SidebarHeader onClose={onClose} />
        {displayFeatures.map((feature, idx) => (
          <FeatureCard key={idx} feature={feature} />
        ))}
      </Box>
    </Slide>
  )
}
