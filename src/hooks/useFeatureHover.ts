import { useEffect, useRef } from 'react'
import { toLonLat } from 'ol/proj'
import { Feature } from 'ol'
import { Point, LineString, Polygon } from 'ol/geom'
import type Map from 'ol/Map'
import type Overlay from 'ol/Overlay'
import type { FeatureLike } from 'ol/Feature'
import { getFeatureStyle } from '../layers/layerStyles.ts'
import { hideTooltip, updateTooltip } from '../components/Tooltip/Tooltip.ts'

export const useFeatureHover = (
  map: Map | null,
  overlay: Overlay | null,
  selectedFeatures: Feature[] | null
) => {
  const previousFeatureRef = useRef<Feature | null>(null)
  const selectedFeaturesRef = useRef<Feature[] | null>(null)

  useEffect(() => {
    selectedFeaturesRef.current = selectedFeatures
  }, [selectedFeatures])

  useEffect(() => {
    if (!map || !overlay) return

    const handler = (evt: any) => {
      const pixel = map.getEventPixel(evt.originalEvent)
      const feature = map.forEachFeatureAtPixel(
        pixel,
        (f) => f as Feature | null
      )

      if (
        previousFeatureRef.current &&
        previousFeatureRef.current !== feature &&
        !isFeatureSelected(
          previousFeatureRef.current,
          selectedFeaturesRef.current
        )
      ) {
        previousFeatureRef.current.setStyle(undefined)
        previousFeatureRef.current = null
      }

      const targetEl = map.getTargetElement()
      if (!targetEl) return

      if (!feature) {
        hideTooltip(overlay)
        targetEl.style.cursor = ''
        return
      }

      const clusterFeatures = feature.get('features') as Feature[] | undefined
      const coord = clusterFeatures?.length
        ? getCoordFromGeometry(clusterFeatures[0], evt.coordinate)
        : getCoordFromGeometry(feature, evt.coordinate)

      if (coord) {
        const [lon, lat] = toLonLat(coord)
        updateTooltip(overlay, evt.coordinate, lon, lat)
      }

      targetEl.style.cursor = 'pointer'

      if (isFeatureSelected(feature, selectedFeaturesRef.current)) return

      if (previousFeatureRef.current !== feature) {
        feature.setStyle(getFeatureStyle(feature as FeatureLike, true))
        previousFeatureRef.current = feature
      }
    }

    map.on('pointermove', handler)
    return () => map.un('pointermove', handler)
  }, [map, overlay])
}

const isFeatureSelected = (
  feature: Feature,
  selectedFeatures: Feature[] | null
): boolean => {
  return selectedFeatures?.includes(feature) ?? false
}

const getCoordFromGeometry = (feature: Feature, pointerCoord: number[]) => {
  const geom = feature.getGeometry()
  if (!geom) return

  if (geom instanceof Point) return geom.getCoordinates()

  if (geom instanceof LineString) {
    let nearest = geom.getCoordinates()[0]
    let minDist = Infinity

    for (const c of geom.getCoordinates()) {
      const dx = c[0] - pointerCoord[0]
      const dy = c[1] - pointerCoord[1]
      const d = dx * dx + dy * dy
      if (d < minDist) {
        minDist = d
        nearest = c
      }
    }
    return nearest
  }

  if (geom instanceof Polygon) return geom.getInteriorPoint().getCoordinates()
}
