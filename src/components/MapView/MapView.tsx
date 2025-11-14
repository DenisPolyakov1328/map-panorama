import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useFeatureHover } from '../../hooks/useFeatureHover.ts'
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import { fromLonLat } from 'ol/proj'
import { createTooltip } from '../Tooltip/Tooltip.ts'
import { createVectorLayer } from '../../layers/createLayer.ts'
import { layersConfig } from '../../layers/layerConfig.ts'
import { useFeatureClick } from '../../hooks/useFeatureClick.ts'
import { FeatureInfo } from '../Sidebar/FeatureInfo.tsx'

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [overlay, setOverlay] = useState<Overlay | null>(null)

  const selectedFeature = useFeatureClick(map)
  useFeatureHover(map, overlay, selectedFeature)

  useEffect(() => {
    if (!mapRef.current) return

    const vectorLayers = layersConfig.map((config) => createVectorLayer(config))

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), ...vectorLayers],
      view: new View({
        center: fromLonLat([38.973633, 45.029636]),
        zoom: 16
      })
    })

    setMap(mapInstance)
    setOverlay(createTooltip(mapInstance))

    return () => mapInstance.setTarget(undefined)
  }, [])

  return (
    <>
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100vh'
        }}
      />
      <FeatureInfo features={selectedFeature} />
    </>
  )
}
