import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CloseButton } from '../ui/CloseButton.tsx'

interface PanoramaDialogProps {
  open: boolean
  onClose: () => void
}

export const PanoramaDialog = ({ open, onClose }: PanoramaDialogProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!open || !mountRef.current) return
    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    const texture = new THREE.TextureLoader().load(
      '/images/panorama.jpg',
      () => {
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        const animate = () => {
          renderer.render(scene, camera)
          frameRef.current = requestAnimationFrame(animate)
        }
        animate()
      }
    )

    let isDragging = false
    let previousX = 0
    let previousY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousX = e.clientX
      previousY = e.clientY
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - previousX
      const deltaY = e.clientY - previousY
      if (scene.children[0]) {
        scene.children[0].rotation.y -= deltaX * 0.002
        scene.children[0].rotation.x -= deltaY * 0.002
      }
      previousX = e.clientX
      previousY = e.clientY
    }
    const onMouseUp = () => (isDragging = false)

    const onWheel = (e: WheelEvent) => {
      camera.fov += e.deltaY * 0.02
      camera.fov = THREE.MathUtils.clamp(camera.fov, 30, 100)
      camera.updateProjectionMatrix()
    }

    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseup', onMouseUp)
    container.addEventListener('wheel', onWheel)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      container.replaceChildren()
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('wheel', onWheel)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1010,
        width: '100vw',
        height: '100vh'
      }}
    >
      <CloseButton
        onClick={onClose}
        position="absolute"
        sx={{ top: 20, right: 20 }}
      />
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.7)'
        }}
      />
    </div>
  )
}
