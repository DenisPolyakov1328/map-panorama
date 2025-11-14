import { useEffect, useRef } from 'react'
import { toLonLat } from 'ol/proj'
import { Feature } from 'ol'
import { Point, LineString, Polygon } from 'ol/geom'
import type Map from 'ol/Map'
import type Overlay from 'ol/Overlay'
import type { FeatureLike } from 'ol/Feature'
import { getFeatureStyle } from '../layers/layerStyles.ts'
import { hideTooltip, updateTooltip } from '../components/Tooltip/Tooltip.ts'

export const useFeatureHover = (map: Map | null, overlay: Overlay | null) => {
  const previousFeatureRef = useRef<Feature | null>(null)

  useEffect(() => {
    if (!map || !overlay) return

    const handler = (evt: any) => {
      const pixel = map.getEventPixel(evt.originalEvent)
      const feature = map.forEachFeatureAtPixel(
        pixel,
        (f) => f as Feature | null
      )

      // Сброс подсветки предыдущего объекта
      if (
        previousFeatureRef.current &&
        previousFeatureRef.current !== feature
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

      // Подсветка
      if (previousFeatureRef.current !== feature) {
        feature.setStyle(getFeatureStyle(feature as FeatureLike, true))
        previousFeatureRef.current = feature
      }

      // Координаты
      const clusterFeatures = feature.get('features') as Feature[] | undefined
      let coord: number[] | undefined

      if (clusterFeatures?.length) {
        coord = getCoordFromGeometry(clusterFeatures[0], evt.coordinate)
      } else {
        coord = getCoordFromGeometry(feature, evt.coordinate)
      }

      if (coord) {
        const [lon, lat] = toLonLat(coord)
        updateTooltip(overlay, evt.coordinate, lon, lat)
      }

      targetEl.style.cursor = 'pointer'
    }

    map.on('pointermove', handler)

    return () => {
      map.un('pointermove', handler)
    }
  }, [map, overlay])
}

// Вычисление координат для Point / LineString / Polygon
const getCoordFromGeometry = (feature: Feature, pointerCoord: number[]) => {
  const geom = feature.getGeometry()

  if (geom instanceof Point) {
    return geom.getCoordinates()
  }

  if (geom instanceof LineString) {
    const coords = geom.getCoordinates()
    let minDist = Infinity
    let nearest = coords[0]

    for (const c of coords) {
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

  if (geom instanceof Polygon) {
    return geom.getInteriorPoint().getCoordinates()
  }

  return undefined
}
