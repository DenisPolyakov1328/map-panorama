import { Box, Slide } from '@mui/material'
import type { Feature } from 'ol'
import { SidebarHeader } from './SidebarHeader'
import { FeatureCard } from './FeatureCard'

interface SidebarProps {
  features: Feature[] | null
  onClose: () => void
}

const flattenFeatures = (features: Feature[]): Feature[] =>
  features.flatMap((feature) => {
    const clusterFeatures = feature.get('features') as Feature[] | undefined
    return clusterFeatures?.length ? clusterFeatures : [feature]
  })

export const Sidebar = ({ features, onClose }: SidebarProps) => {
  const hasFeatures = !!features && features.length > 0
  const displayFeatures = features ? flattenFeatures(features) : []

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
        {displayFeatures.map((feature) => (
          <FeatureCard
            key={feature.getId() ?? Math.random()}
            feature={feature}
          />
        ))}
      </Box>
    </Slide>
  )
}
