import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PanoramaControls } from './PanoramaControls.tsx'
import { Preloader } from '../ui/Preloader.tsx'

interface PanoramaViewerProps {
  open: boolean
  onClose: () => void
}

export const PanoramaViewer = ({ open, onClose }: PanoramaViewerProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const initialRotationRef = useRef({ x: 0, y: 0 })
  const initialFovRef = useRef(75)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !mountRef.current) return
    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 0)
    cameraRef.current = camera
    initialFovRef.current = camera.fov

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    setLoading(true)
    const texture = new THREE.TextureLoader().load(
      '/images/panorama.jpg',
      () => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0
        })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)
        sphereRef.current = sphere

        initialRotationRef.current = {
          x: sphere.rotation.x,
          y: sphere.rotation.y
        }

        setLoading(false)

        let opacity = 0
        const fadeIn = () => {
          if (!sphere.material) return
          opacity += 0.02
          if (opacity >= 1) opacity = 1
          ;(sphere.material as THREE.MeshBasicMaterial).opacity = opacity
          if (opacity < 1) requestAnimationFrame(fadeIn)
        }
        fadeIn()

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
      if (mountRef.current) mountRef.current.style.cursor = 'grabbing'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sphereRef.current) return
      const deltaX = e.clientX - previousX
      const deltaY = e.clientY - previousY
      sphereRef.current.rotation.y -= deltaX * 0.002
      sphereRef.current.rotation.x -= deltaY * 0.002
      previousX = e.clientX
      previousY = e.clientY
    }
    const onMouseUp = () => {
      isDragging = false
      if (mountRef.current) mountRef.current.style.cursor = 'grab'
    }
    const onMouseLeave = () => (isDragging = false)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!cameraRef.current) return
      cameraRef.current.fov += e.deltaY * 0.02
      cameraRef.current.fov = THREE.MathUtils.clamp(
        cameraRef.current.fov,
        30,
        100
      )
      cameraRef.current.updateProjectionMatrix()
    }

    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseup', onMouseUp)
    container.addEventListener('mouseleave', onMouseLeave)
    container.addEventListener('wheel', onWheel)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      container.replaceChildren()
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('mouseleave', onMouseLeave)
      container.removeEventListener('wheel', onWheel)
      sphereRef.current = null
      cameraRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (mountRef.current) mountRef.current.style.cursor = 'grab'
  }, [open])

  if (!open) return null

  const handleReset = () => {
    if (sphereRef.current && cameraRef.current) {
      sphereRef.current.rotation.x = initialRotationRef.current.x
      sphereRef.current.rotation.y = initialRotationRef.current.y
      cameraRef.current.fov = initialFovRef.current
      cameraRef.current.updateProjectionMatrix()
    }
  }

  const rotate = (axis: 'x' | 'y', delta: number) => {
    if (!sphereRef.current) return
    sphereRef.current.rotation[axis] += delta
  }

  const zoom = (deltaFov: number) => {
    if (!cameraRef.current) return
    cameraRef.current.fov = THREE.MathUtils.clamp(
      cameraRef.current.fov + deltaFov,
      30,
      100
    )
    cameraRef.current.updateProjectionMatrix()
  }

  return (
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1010,
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(120, 120, 120, 0.4)'
      }}
    >
      {loading && <Preloader />}
      <PanoramaControls
        onClose={onClose}
        handleReset={handleReset}
        rotate={rotate}
        zoom={zoom}
      />
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '85%',
          position: 'relative'
        }}
      ></div>
    </div>
  )
}
