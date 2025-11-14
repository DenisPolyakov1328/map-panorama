import { useEffect, useState } from 'react'
import type OlMap from 'ol/Map'
import type { Feature } from 'ol'

export const useFeatureClick = (map: OlMap | null) => {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[] | null>(
    null
  )

  useEffect(() => {
    if (!map) return

    const clickHandler = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f as Feature)

      if (feature) {
        const clusterFeatures = feature.get('features') as Feature[] | undefined
        if (Array.isArray(clusterFeatures) && clusterFeatures.length > 0) {
          setSelectedFeatures(clusterFeatures)
        } else {
          setSelectedFeatures([feature])
        }
      } else {
        setSelectedFeatures(null)
      }
    }

    map.on('singleclick', clickHandler)
    return () => map.un('singleclick', clickHandler)
  }, [map])

  return selectedFeatures
}
