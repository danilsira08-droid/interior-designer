import { useState, useRef, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Line, Html } from '@react-three/drei'

// Компонент внутри Canvas
function MeasureToolScene({ active }) {
  const { camera, raycaster, gl } = useThree()
  const [points, setPoints]  = useState([])
  const [preview, setPreview] = useState(null)
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))

  const getWorldPoint = useCallback((e) => {
    const rect   = gl.domElement.getBoundingClientRect()
    const mouse  = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width)  * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(mouse, camera)
    const target = new THREE.Vector3()
    raycaster.ray.intersectPlane(groundPlane.current, target)
    return target
  }, [camera, raycaster, gl])

  const handleClick = useCallback((e) => {
    if (!active) return
    e.stopPropagation()
    const pt = getWorldPoint(e)
    if (!pt) return

    setPoints(prev => {
      if (prev.length >= 2) return [pt] // сброс после двух точек
      return [...prev, pt]
    })
  }, [active, getWorldPoint])

  const handleMove = useCallback((e) => {
    if (!active) return
    const pt = getWorldPoint(e)
    if (pt) setPreview(pt)
  }, [active, getWorldPoint])

  if (!active) return null

  // Текущая линия
  const linePoints = [...points]
  if (points.length === 1 && preview) linePoints.push(preview)

  const dist = linePoints.length === 2
    ? linePoints[0].distanceTo(linePoints[1])
    : null

  const midpoint = dist && new THREE.Vector3()
    .addVectors(linePoints[0], linePoints[1])
    .multiplyScalar(0.5)
    .add(new THREE.Vector3(0, 0.15, 0))

  return (
    <group
      onPointerMove={handleMove}
      onClick={handleClick}
    >
      {/* Невидимый большой пол для перехвата кликов */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Точки */}
      {points.map((pt, i) => (
        <mesh key={i} position={[pt.x, 0.05, pt.z]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
      ))}

      {/* Линия */}
      {linePoints.length === 2 && (
        <>
          <Line
            points={[[linePoints[0].x, 0.05, linePoints[0].z], [linePoints[1].x, 0.05, linePoints[1].z]]}
            color="#f97316"
            lineWidth={2}
            dashed={false}
          />
          {/* Засечки на концах */}
          {[linePoints[0], linePoints[1]].map((pt, i) => (
            <Line key={i}
              points={[
                [pt.x - 0.15, 0.05, pt.z],
                [pt.x + 0.15, 0.05, pt.z],
              ]}
              color="#f97316"
              lineWidth={2}
            />
          ))}
        </>
      )}

      {/* Подпись расстояния */}
      {dist !== null && midpoint && (
        <Html position={[midpoint.x, midpoint.y, midpoint.z]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(249,115,22,0.95)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}>
            {dist.toFixed(2)} м
          </div>
        </Html>
      )}

      {/* Координаты точек (для передачи разработчику) */}
      {points.map((pt, i) => (
        <Html key={`coord-${i}`} position={[pt.x, 0.3, pt.z]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: '#a0a0ff',
            padding: '2px 7px',
            borderRadius: '5px',
            fontSize: '10px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            X:{pt.x.toFixed(2)} Z:{pt.z.toFixed(2)}
          </div>
        </Html>
      ))}
    </group>
  )
}

// Кнопка-тулбар вне Canvas
function MeasureButton({ active, onToggle, measurements }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
          active
            ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 ring-1 ring-orange-500/30'
            : 'bg-white/5 border-white/8 text-zinc-400 hover:text-white hover:bg-white/10'
        }`}
        title="Инструмент замера — кликни две точки"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 13L13 1M3 11l2-2M6 8l2-2M9 5l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M1 10V13H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 1H13V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs">Замер</span>
        {active && <span className="text-xs text-orange-400/70">· кликни 2 точки</span>}
      </button>
    </div>
  )
}

export { MeasureToolScene, MeasureButton }