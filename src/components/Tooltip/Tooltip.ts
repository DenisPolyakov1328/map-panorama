import Overlay from 'ol/Overlay'
import { Map as OlMap } from 'ol'

export const createTooltip = (map: OlMap): Overlay => {
  const tip = document.createElement('div')
  tip.className = 'ol-tooltip'
  tip.style.position = 'relative'
  tip.style.padding = '6px 8px'
  tip.style.background = 'rgba(255,255,255,0.9)'
  tip.style.border = '1px solid rgba(0,0,0,0.15)'
  tip.style.borderRadius = '8px'
  tip.style.whiteSpace = 'nowrap'
  tip.style.fontSize = '14px'
  tip.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)'
  tip.style.pointerEvents = 'none'
  tip.style.display = 'none'

  const overlay = new Overlay({
    element: tip,
    offset: [12, 0],
    positioning: 'bottom-left'
  })

  map.addOverlay(overlay)
  return overlay
}

export const updateTooltip = (
  overlay: Overlay,
  coord: [number, number],
  lon: number,
  lat: number
) => {
  const element = overlay.getElement()
  if (!element) return
  element.innerHTML = `Lon: ${lon.toFixed(6)}<br/>Lat: ${lat.toFixed(6)}`
  overlay.setPosition(coord)
  element.style.display = 'block'
}

export const hideTooltip = (overlay: Overlay) => {
  const element = overlay.getElement()
  if (!element) return
  element.style.display = 'none'
}
