import { Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useFeatureHover } from '../../hooks/useFeatureHover'
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import { fromLonLat } from 'ol/proj'
import { defaults as defaultInteractions } from 'ol/interaction'
import { createTooltip } from '../Tooltip/Tooltip'
import { createVectorLayer } from '../../layers/createVectorLayer'
import { loadLayersData } from '../../api/loadLayersData.ts'
import { useFeatureClick } from '../../hooks/useFeatureClick'
import { Sidebar } from '../Sidebar/Sidebar'
import { useFeatureDoubleClick } from '../../hooks/useFeatureDoubleClick.ts'
import { PanoramaDialog } from '../Panorama/PanoramaDialog.tsx'

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const [vectorLayers, setVectorLayers] = useState<any[]>([])

  const [selectedFeature, setSelectedFeature] = useFeatureClick(map)
  useFeatureHover(map, overlay, selectedFeature)
  const [dblClickFeature, setDblClickFeature] = useFeatureDoubleClick(map)

  useEffect(() => {
    const loadData = async () => {
      try {
        const configs = await loadLayersData()
        const layers = configs.map((cfg) => createVectorLayer(cfg))
        setVectorLayers(layers)
      } catch (err) {
        console.error('Failed to load layers:', err)
      }
    }

    void loadData()
  }, [])

  useEffect(() => {
    if (!mapRef.current || vectorLayers.length === 0) return

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), ...vectorLayers],
      view: new View({
        center: fromLonLat([38.973633, 45.029636]),
        zoom: 16
      }),
      interactions: defaultInteractions({
        doubleClickZoom: false
      })
    })

    setMap(mapInstance)
    setOverlay(createTooltip(mapInstance))

    return () => mapInstance.setTarget(undefined)
  }, [vectorLayers])

  return (
    <>
      <Box ref={mapRef} sx={{ width: '100%', height: '100vh' }} />
      <Sidebar
        features={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
      <PanoramaDialog
        open={Boolean(dblClickFeature)}
        onClose={() => setDblClickFeature(null)}
      />
    </>
  )
}
