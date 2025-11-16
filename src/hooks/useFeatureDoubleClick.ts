import React from 'react'
import { useEffect, useState } from 'react'
import type Map from 'ol/Map'
import type { Feature } from 'ol'
import { getFeatureStyle } from '../layers/layerStyles.ts'

export const useFeatureDoubleClick = (
  map: Map | null,
  setSelectedFeature: (features: Feature[] | null) => void,
  previousRef: React.RefObject<Feature[] | null>
) => {
  const [dblClickFeature, setDblClickFeature] = useState<Feature | null>(null)

  useEffect(() => {
    if (!map) return
    const handler = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) =>
        'getGeometry' in f ? (f as Feature) : null
      )
      if (!feature) return

      if (previousRef.current) {
        previousRef.current.forEach((f) => f.setStyle(undefined))
        previousRef.current = null
      }

      const newSelection = [feature]
      newSelection.forEach((f) => f.setStyle(getFeatureStyle(f, true)))
      previousRef.current = newSelection
      setSelectedFeature(newSelection)
      setDblClickFeature(feature)
    }
    map.on('dblclick', handler)
    return () => map.un('dblclick', handler)
  }, [map, setSelectedFeature])

  return [dblClickFeature, setDblClickFeature] as const
}
