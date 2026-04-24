import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PointerLockControls } from '@react-three/drei'
import { useRef, Suspense, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useEditorStore } from '../../modules/editor/useEditorStore'
import Room from './Room'
import FurnitureItem from './FurnitureItem'

export const THEMES = {
  dark: { bg: '#111111', label: 'Тёмный' },
  warm: { bg: '#1a1208', label: 'Тёплый' },
  neutral: { bg: '#1a1a1a', label: 'Нейтральный' },
  violet: { bg: '#0d0a1a', label: 'Фиолетовый' },
}

function FirstPersonMovement() {
  const { camera } = useThree()
  const keys = useRef({})

  useEffect(() => {
    const onKeyDown = (e) => { keys.current[e.code] = true }
    const onKeyUp = (e) => { keys.current[e.code] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    camera.position.set(4, 1.6, 2.5)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [camera])

  useFrame((_, delta) => {
    const speed = 3
    const k = keys.current
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()

    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    const move = new THREE.Vector3()
    if (k['KeyW'] || k['ArrowUp']) move.addScaledVector(forward, 1)
    if (k['KeyS'] || k['ArrowDown']) move.addScaledVector(forward, -1)
    if (k['KeyA'] || k['ArrowLeft']) move.addScaledVector(right, -1)
    if (k['KeyD'] || k['ArrowRight']) move.addScaledVector(right, 1)

    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * delta)
      camera.position.add(move)
      camera.position.y = 1.6
    }
  })

  return null
}

const OrbitControlsWithRef = forwardRef(function OrbitControlsWithRef({ enabled, target }, ref) {
  const orbitRef = useRef()
  const { camera } = useThree()

  useImperativeHandle(ref, () => ({
    setTopView: () => {
      if (!orbitRef.current) return
      const t = new THREE.Vector3(...target)
      camera.position.set(t.x, 25, t.z)
      orbitRef.current.target.copy(t)
      orbitRef.current.update()
    }
  }))

  return (
    <OrbitControls
      ref={orbitRef}
      enabled={enabled}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.1}
      target={target}
    />
  )
})

function Scene({ apartmentId, mode, onExitFirstPerson, theme = 'dark', orbitRef }) {
  const { items, selectedId, deselect } = useEditorStore()
  const cameraLocked = selectedId !== null && mode === 'editor'
  const isViewer = mode === 'viewer'
  const bg = THEMES[theme]?.bg || '#111111'

  const modelPath = apartmentId
    ? `/models/apartments/${apartmentId}.glb`
    : null

  return (
    <Canvas
      camera={{ position: [4, 18, 3], fov: isViewer ? 80 : 55 }}
      style={{ background: bg }}
      gl={{ antialias: true, powerPreference: 'default' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} />
      <pointLight position={[-3, 5, -3]} intensity={0.3} color="#fff5e0" />

      {!isViewer && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          onPointerDown={(e) => {
            e.stopPropagation()
            deselect()
          }}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}

      <Suspense fallback={null}>
        <Room
          modelPath={modelPath}
          apartmentId={apartmentId}
          showCeiling={isViewer}
        />
      </Suspense>

      {items.map(item => (
        <FurnitureItem key={item.id} item={item} interactive={!isViewer} />
      ))}

      {isViewer ? (
        <>
          <PointerLockControls onUnlock={onExitFirstPerson} pointerSpeed={0.5} />
          <FirstPersonMovement />
        </>
      ) : (
        <OrbitControlsWithRef
          ref={orbitRef}
          enabled={!cameraLocked}
          target={[4, 0, 2.5]}
        />
      )}
    </Canvas>
  )
}

export default Scene
