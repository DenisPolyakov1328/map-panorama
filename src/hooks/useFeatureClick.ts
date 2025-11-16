import React from 'react'
import { useEffect } from 'react'
import type Map from 'ol/Map'
import type { Feature } from 'ol'
import { getFeatureStyle } from '../layers/layerStyles.ts'

export const useFeatureClick = (
  map: Map | null,
  setSelectedFeature: (features: Feature[] | null) => void,
  previousRef: React.RefObject<Feature[] | null>
) => {
  useEffect(() => {
    if (!map) return
    const handler = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f as Feature)
      if (previousRef.current) {
        previousRef.current.forEach((f) => f.setStyle(undefined))
        previousRef.current = null
      }
      if (feature) {
        const newSelection = [feature]
        newSelection.forEach((f) => f.setStyle(getFeatureStyle(f, true)))
        previousRef.current = newSelection
        setSelectedFeature(newSelection)
      } else {
        setSelectedFeature(null)
      }
    }
    map.on('singleclick', handler)
    return () => map.un('singleclick', handler)
  }, [map, setSelectedFeature])
}
