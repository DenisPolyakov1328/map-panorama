import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import OlMap from 'ol/Map'
import View from 'ol/View'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Cluster from 'ol/source/Cluster'
import OSM from 'ol/source/OSM'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import Overlay from 'ol/Overlay'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Feature } from 'ol'
import { Point, LineString, Polygon } from 'ol/geom'
import type { FeatureLike } from 'ol/Feature'

import semaphores from '../../data/semaphores.json'
import lines from '../../data/line.json'
import roadCros from '../../data/road_cros.json'

const getFeatureStyle = (
  feature: FeatureLike,
  isHighlighted: boolean = false
) => {
  const features = (feature as any).get('features')
  const size = Array.isArray(features) ? features.length : 1
  const radius = 6 + Math.min(size, 10)

  const geometry = feature.getGeometry()

  if (geometry instanceof Point) {
    return new Style({
      image: new CircleStyle({
        radius: radius,
        fill: new Fill({
          color: isHighlighted ? 'rgba(255,200,0,0.9)' : 'red'
        }),
        stroke: new Stroke({ color: 'white', width: 2 })
      }),
      text:
        size > 1
          ? new Text({
              text: size.toString(),
              fill: new Fill({ color: 'white' }),
              font: '12px sans-serif',
              offsetY: 1
            })
          : undefined
    })
  }

  if (geometry instanceof LineString) {
    return new Style({
      stroke: new Stroke({
        color: isHighlighted ? 'rgba(255,200,0,0.9)' : 'blue',
        width: isHighlighted ? 3 : 2
      })
    })
  }

  if (geometry instanceof Polygon) {
    return new Style({
      stroke: new Stroke({
        color: isHighlighted ? 'rgba(255,200,0,0.9)' : 'green',
        width: isHighlighted ? 3 : 1
      }),
      fill: new Fill({
        color: isHighlighted ? 'rgba(255,200,0,0.15)' : 'rgba(0,255,0,0.2)'
      })
    })
  }
}

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<OlMap | null>(null)
  const previousFeatureRef = useRef<Feature | null>(null)
  const overlayRef = useRef<Overlay | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const semaphoreSource = new VectorSource({
      features: new GeoJSON().readFeatures(semaphores, {
        featureProjection: 'EPSG:3857'
      })
    })

    const clusterSource = new Cluster({
      distance: 20,
      source: semaphoreSource
    })

    const semaphoreLayer = new VectorLayer({
      source: clusterSource,
      style: (feature) => getFeatureStyle(feature, false)
    })

    const lineLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(lines, {
          featureProjection: 'EPSG:3857'
        })
      }),
      style: (feature) => getFeatureStyle(feature, false)
    })

    const polygonLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(roadCros, {
          featureProjection: 'EPSG:3857'
        })
      }),
      style: (feature) => getFeatureStyle(feature, false)
    })

    const map = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        lineLayer,
        polygonLayer,
        semaphoreLayer
      ],
      view: new View({
        center: fromLonLat([38.973633, 45.029636]),
        zoom: 16
      })
    })
    mapInstanceRef.current = map

    const tip = document.createElement('div')
    tip.className = 'ol-tooltip'
    tip.style.position = 'relative'
    tip.style.padding = '6px 8px'
    tip.style.background = 'rgba(255,255,255,0.9)'
    tip.style.border = '1px solid rgba(0,0,0,0.15)'
    tip.style.borderRadius = '4px'
    tip.style.whiteSpace = 'nowrap'
    tip.style.fontSize = '12px'
    tip.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)'
    tip.style.pointerEvents = 'none'
    tip.style.display = 'none'

    const overlay = new Overlay({
      element: tip,
      offset: [12, 0],
      positioning: 'bottom-left'
    })
    map.addOverlay(overlay)
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
          tip.innerHTML = `Lon: ${lon.toFixed(6)}<br/>Lat: ${lat.toFixed(6)}`
          overlay.setPosition(evt.coordinate)
          tip.style.display = 'block'
          targetEl.style.cursor = 'pointer'
        }
      } else {
        tip.style.display = 'none'
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
