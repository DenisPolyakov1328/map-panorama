import { useEffect, useState } from 'react'
import type Map from 'ol/Map'

export const useFeatureDoubleClick = (map: Map | null) => {
  const [dblClickFeature, setDblClickFeature] = useState<{
    coord: number[]
    feature: any
  } | null>(null)

  useEffect(() => {
    if (!map) return

    const handler = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f)
      if (!feature) return // только если есть feature

      setDblClickFeature({ coord: evt.coordinate, feature })
    }

    map.on('dblclick', handler)
    return () => map.un('dblclick', handler)
  }, [map])

  return [dblClickFeature, setDblClickFeature] as const
}
