import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import OlMap from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Feature } from 'ol'
import { Point, LineString, Polygon } from 'ol/geom'
import { getFeatureStyle } from './layerStyles.ts'
import {
  createTooltip,
  hideTooltip,
  updateTooltip
} from '../Tooltip/Tooltip.ts'
import { createVectorLayer } from './createLayer.ts'
import { layersConfig } from './layerConfig.ts'

import type { FeatureLike } from 'ol/Feature'

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<OlMap | null>(null)
  const previousFeatureRef = useRef<Feature | null>(null)
  const overlayRef = useRef<Overlay | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const layers = layersConfig.map((config) => createVectorLayer(config))

    const map = new OlMap({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), ...layers],
      view: new View({
        center: fromLonLat([38.973633, 45.029636]),
        zoom: 16
      })
    })
    mapInstanceRef.current = map

    const overlay = createTooltip(map)
    overlayRef.current = overlay

    const pointerMoveHandler = (evt: any) => {
      const pixel = map.getEventPixel(evt.originalEvent)
      const feature = map.forEachFeatureAtPixel(
        pixel,
        (f) => f as Feature | null
      )

      if (
        previousFeatureRef.current &&
        previousFeatureRef.current !== feature
      ) {
        previousFeatureRef.current.setStyle(undefined)
        previousFeatureRef.current = null
      }

      const targetEl = map.getTargetElement()
      if (!targetEl) return

      if (feature) {
        if (previousFeatureRef.current !== feature) {
          feature.setStyle(getFeatureStyle(feature as FeatureLike, true))
          previousFeatureRef.current = feature
        }

        const clusterFeatures = feature.get('features') as Feature[] | undefined
        let coord: number[] | undefined

        if (Array.isArray(clusterFeatures) && clusterFeatures.length > 0) {
          const geom = clusterFeatures[0].getGeometry()
          if (geom instanceof Point) coord = geom.getCoordinates()
        } else {
          const geom = feature.getGeometry()
          if (geom instanceof Point) {
            coord = geom.getCoordinates()
          } else if (geom instanceof LineString) {
            const coords = geom.getCoordinates()
            let minDist = Infinity
            let nearest: number[] = coords[0]

            for (const c of coords) {
              const dx = c[0] - evt.coordinate[0]
              const dy = c[1] - evt.coordinate[1]
              const d = dx * dx + dy * dy
              if (d < minDist) {
                minDist = d
                nearest = c
              }
            }
            coord = nearest
          } else if (geom instanceof Polygon) {
            coord = geom.getInteriorPoint().getCoordinates()
          }
        }

        if (coord) {
          const [lon, lat] = toLonLat(coord)
          updateTooltip(overlay, evt.coordinate, lon, lat)
          targetEl.style.cursor = 'pointer'
        }
      } else {
        hideTooltip(overlay)
        targetEl.style.cursor = ''
      }
    }

    map.on('pointermove', pointerMoveHandler)

    return () => {
      map.un('pointermove', pointerMoveHandler)
      map.removeOverlay(overlay)
      map.setTarget(undefined)
      mapInstanceRef.current = null
      overlayRef.current = null
      previousFeatureRef.current = null
    }
  }, [])

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '100vh'
      }}
    />
  )
}
