import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PointerLockControls, useProgress } from '@react-three/drei'
import { useRef, Suspense, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { EffectComposer, SSAO, Bloom, Vignette } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useEditorStore } from '../../modules/editor/useEditorStore'
import Room from './Room'
import FurnitureItem from './FurnitureItem'
import { MeasureToolScene } from '../ui/MeasureTool'

const CAMERA = {
  startPosition:     [4, 12, 0.01],
  startTarget:       [4, 0,  2.5],
  fovEditor:         55,
  fovViewer:         75,
  firstPersonHeight: 1.6,
  firstPersonStart:  [0, 1.6, 0],
  firstPersonSpeed:  4,
}

function LoadingWatcher({ onProgress }) {
  const { progress, active } = useProgress()
  useEffect(() => { onProgress(progress, active) }, [progress, active])
  return null
}

function FirstPersonMovement() {
  const { camera, invalidate } = useThree()
  const keys = useRef({})

  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true }
    const up   = (e) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    camera.position.set(...CAMERA.firstPersonStart)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
    }
  }, [camera])

  useFrame((_, delta) => {
    const k = keys.current
    if (!Object.values(k).some(Boolean)) return
    const forward = new THREE.Vector3()
    const right   = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0; forward.normalize()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()
    const move = new THREE.Vector3()
    if (k['KeyW'] || k['ArrowUp'])    move.addScaledVector(forward,  1)
    if (k['KeyS'] || k['ArrowDown'])  move.addScaledVector(forward, -1)
    if (k['KeyA'] || k['ArrowLeft'])  move.addScaledVector(right,   -1)
    if (k['KeyD'] || k['ArrowRight']) move.addScaledVector(right,    1)
    if (move.length() > 0) {
      move.normalize().multiplyScalar(CAMERA.firstPersonSpeed * delta)
      camera.position.add(move)
      camera.position.y = CAMERA.firstPersonHeight
      invalidate()
    }
  })
  return null
}

const OrbitControlsWithRef = forwardRef(function OrbitControlsWithRef({ enabled, target }, ref) {
  const orbitRef = useRef()
  const { camera, invalidate } = useThree()

  useImperativeHandle(ref, () => ({
    setTopView: () => {
      if (!orbitRef.current) return
      const t = new THREE.Vector3(...target)
      camera.position.set(t.x, 14, t.z + 0.01)
      orbitRef.current.target.copy(t)
      orbitRef.current.update()
      invalidate()
    }
  }))

  return (
    <OrbitControls
      ref={orbitRef} enabled={enabled}
      enablePan enableZoom enableRotate
      minDistance={2} maxDistance={40}
      maxPolarAngle={Math.PI / 2.1}
      target={target} makeDefault
    />
  )
})

function SceneContent({
  apartmentId, mode, onExitFirstPerson, orbitRef,
  wallColor, ceilingColor, floorColor,
  bathroomWallColor, bathroomFloorColor,
  onLoadProgress, measureActive,
}) {
  const { items, selectedId, deselect } = useEditorStore()
  const isViewer     = mode === 'viewer'
  const cameraLocked = (selectedId !== null || measureActive) && !isViewer
  const modelPath    = apartmentId ? `/models/apartments/${apartmentId}.glb` : null

  return (
    <>
      <LoadingWatcher onProgress={onLoadProgress} />

      <ambientLight intensity={isViewer ? 1.0 : 0.8} color="#fff8f0" />
      <directionalLight
        position={[6, 8, 5]} intensity={isViewer ? 0.8 : 1.5} color="#fff5e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5} shadow-camera-far={40}
        shadow-camera-left={-12} shadow-camera-right={12}
        shadow-camera-top={12}  shadow-camera-bottom={-12}
        shadow-bias={-0.001} shadow-radius={4}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.3} color="#c8d8ff" />

      {isViewer && (
        <>
          <pointLight position={[0,  2.2, 0]}  intensity={1.5} color="#ffedd5" distance={8} decay={2} />
          <pointLight position={[4,  2.2, 0]}  intensity={1.2} color="#fff5e0" distance={6} decay={2} />
          <pointLight position={[-3, 2.2, 0]}  intensity={1.0} color="#ffedd5" distance={6} decay={2} />
        </>
      )}

      {!isViewer && !measureActive && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}
          onPointerDown={e => { e.stopPropagation(); deselect() }}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}

      <Suspense fallback={null}>
        <Room
          modelPath={modelPath} apartmentId={apartmentId} showCeiling={isViewer}
          wallColor={wallColor} ceilingColor={ceilingColor} floorColor={floorColor}
          bathroomWallColor={bathroomWallColor} bathroomFloorColor={bathroomFloorColor}
        />
      </Suspense>

      <Suspense fallback={null}>
        {items.map(item => (
          <FurnitureItem key={item.id} item={item} interactive={!isViewer && !measureActive} />
        ))}
      </Suspense>

      <MeasureToolScene active={measureActive && !isViewer} />

      {isViewer ? (
        <>
          <PointerLockControls onUnlock={onExitFirstPerson} pointerSpeed={0.35} />
          <FirstPersonMovement />
        </>
      ) : (
        <OrbitControlsWithRef ref={orbitRef} enabled={!cameraLocked} target={CAMERA.startTarget} />
      )}

      <EffectComposer enableNormalPass>
        <SSAO radius={0.02} intensity={3} luminanceInfluence={0.95} bias={0.03} />
        <Bloom intensity={0.25} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.3} darkness={0.4} />
      </EffectComposer>
    </>
  )
}

// Анимация перехода в режим от первого лица
function FirstPersonTransition({ isTransitioning, onDone }) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={onDone}
          style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'radial-gradient(circle, rgba(10,10,20,0.95) 0%, rgba(0,0,0,1) 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px',
          }}
        >
          {/* Анимированный прицел */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ position: 'relative', width: 64, height: 64 }}
          >
            {/* Вращающееся кольцо */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 0,
                border: '2px solid transparent',
                borderTopColor: '#7c3aed',
                borderRightColor: '#7c3aed',
                borderRadius: '50%',
              }}
            />
            {/* Внутренний круг */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                position: 'absolute', inset: 12,
                border: '1px solid rgba(124,58,237,0.5)',
                borderRadius: '50%',
              }}
            />
            {/* Точка в центре */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 6, height: 6,
              background: '#7c3aed', borderRadius: '50%',
            }} />
            {/* Крестик */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(124,58,237,0.4)', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(124,58,237,0.4)', transform: 'translateX(-50%)' }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, letterSpacing: '0.1em' }}
          >
            Загрузка вида...
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: 'rgba(124,58,237,0.6)', fontSize: 12 }}
          >
            Нажми для захвата курсора
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Scene({
  apartmentId, mode, onExitFirstPerson, orbitRef,
  wallColor, ceilingColor, floorColor,
  bathroomWallColor, bathroomFloorColor,
  onLoadProgress, measureActive,
  containerRef,
}) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [actualMode,      setActualMode]      = useState(mode)
  const prevMode = useRef(mode)

  // Перехватываем переход в viewer
  useEffect(() => {
  if (mode === 'viewer' && prevMode.current !== 'viewer') {
    setIsTransitioning(true)
    setTimeout(() => {
      setActualMode('viewer')
      setIsTransitioning(false)  // ← скрываем overlay после переключения
    }, 600)
  } else if (mode !== 'viewer') {
    setActualMode(mode)
    setIsTransitioning(false)
  }
  prevMode.current = mode
}, [mode])

  // Запрашиваем полноэкранный режим при входе в viewer
  useEffect(() => {
    if (mode === 'viewer' && containerRef?.current) {
      const el = containerRef.current
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {}) // игнорируем если пользователь отклонил
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      }
    } else if (mode !== 'viewer') {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [mode])

  const handleTransitionDone = () => {
    // Анимация завершена — можно скрыть overlay
    // Сам режим уже переключён через setTimeout выше
  }

  const handleExitFirstPerson = () => {
    setIsTransitioning(false)
    setActualMode('editor')
    onExitFirstPerson()
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        camera={{
          position: CAMERA.startPosition,
          fov: actualMode === 'viewer' ? CAMERA.fovViewer : CAMERA.fovEditor,
        }}
        style={{ background: '#f0ece4' }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          preserveDrawingBuffer: true,
        }}
        shadows="soft"
      >
        <SceneContent
          apartmentId={apartmentId}
          mode={actualMode}
          onExitFirstPerson={handleExitFirstPerson}
          orbitRef={orbitRef}
          wallColor={wallColor} ceilingColor={ceilingColor} floorColor={floorColor}
          bathroomWallColor={bathroomWallColor} bathroomFloorColor={bathroomFloorColor}
          onLoadProgress={onLoadProgress}
          measureActive={measureActive}
        />
      </Canvas>

      {/* Анимация перехода поверх Canvas */}
      <FirstPersonTransition
        isTransitioning={isTransitioning}
        onDone={handleTransitionDone}
      />
    </div>
  )
}

export default Scene