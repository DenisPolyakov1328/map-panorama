import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Cluster from 'ol/source/Cluster'
import GeoJSON from 'ol/format/GeoJSON'
import { getFeatureStyle } from './layerStyles.ts'
import type { FeatureLike } from 'ol/Feature'

interface CreateLayerOptions {
  data: any
  cluster?: boolean
  clusterDistance?: number
}

export const createVectorLayer = ({
  data,
  cluster = false,
  clusterDistance = 20
}: CreateLayerOptions) => {
  const source = new VectorSource({
    features: new GeoJSON().readFeatures(data, {
      featureProjection: 'EPSG:3857'
    })
  })

  const finalSource = cluster
    ? new Cluster({ source, distance: clusterDistance })
    : source

  return new VectorLayer({
    source: finalSource,
    style: (feature: FeatureLike) => getFeatureStyle(feature, false)
  })
}
