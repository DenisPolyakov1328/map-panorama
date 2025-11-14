import { useEffect, useState, useRef } from 'react'
import type Map from 'ol/Map'
import type { Feature } from 'ol'
import { getFeatureStyle } from '../layers/layerStyles.ts'

export const useFeatureClick = (map: Map | null) => {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[] | null>(
    null
  )
  const previousSelectedRef = useRef<Feature[] | null>(null)

  useEffect(() => {
    if (!map) return

    const clickHandler = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (f) => f as Feature | null
      )

      if (previousSelectedRef.current) {
        previousSelectedRef.current.forEach((f) => f.setStyle(undefined))
      }

      if (feature) {
        feature.setStyle(getFeatureStyle(feature, true))
        setSelectedFeatures([feature])
        previousSelectedRef.current = [feature]
      } else {
        setSelectedFeatures(null)
        previousSelectedRef.current = null
      }
    }

    map.on('singleclick', clickHandler)
    return () => map.un('singleclick', clickHandler)
  }, [map])

  return selectedFeatures
}
