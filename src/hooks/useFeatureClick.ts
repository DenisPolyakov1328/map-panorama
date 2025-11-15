import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react'
import type Map from 'ol/Map'
import type { Feature } from 'ol'
import { getFeatureStyle } from '../layers/layerStyles.ts'

export const useFeatureClick = (
  map: Map | null
): [Feature[] | null, Dispatch<SetStateAction<Feature[] | null>>] => {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[] | null>(
    null
  )
  const previousSelectedRef = useRef<Feature[] | null>(null)

  useEffect(() => {
    if (!map) return

    const clickHandler = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f as Feature)

      if (previousSelectedRef.current) {
        previousSelectedRef.current.forEach((f) => f.setStyle(undefined))
        previousSelectedRef.current = null
      }

      if (feature) {
        const clusterFeatures = feature.get('features') as Feature[] | undefined
        const newSelection =
          clusterFeatures && clusterFeatures.length > 0 ? [feature] : [feature]

        newSelection.forEach((f) => f.setStyle(getFeatureStyle(f, true)))

        previousSelectedRef.current = newSelection
        setSelectedFeatures(newSelection) // состояние для FeatureInfo
      } else {
        setSelectedFeatures(null)
      }
    }

    map.on('singleclick', clickHandler)
    return () => map.un('singleclick', clickHandler)
  }, [map])

  // Сбрасываем стиль при внешнем обнулении
  useEffect(() => {
    if (selectedFeatures === null && previousSelectedRef.current) {
      previousSelectedRef.current.forEach((f) => f.setStyle(undefined))
      previousSelectedRef.current = null
    }
  }, [selectedFeatures])

  return [selectedFeatures, setSelectedFeatures]
}
