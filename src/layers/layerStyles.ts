import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import { Point, LineString, Polygon } from 'ol/geom'
import type { FeatureLike } from 'ol/Feature'

export const getFeatureStyle = (
  feature: FeatureLike,
  isHighlighted = false
) => {
  const features = (feature as any).get('features')
  const size = Array.isArray(features) ? features.length : 1
  const radius = 8 + Math.min(size, 10)
  const geometry = feature.getGeometry()

  if (geometry instanceof Point) {
    return new Style({
      image: new CircleStyle({
        radius,
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
