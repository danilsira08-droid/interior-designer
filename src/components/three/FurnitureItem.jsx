import { useRef, Suspense, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Box, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '../../modules/editor/useEditorStore'

const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const planeTarget = new THREE.Vector3()

function GLBModel({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  const cloned = scene.clone(true)
  cloned.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return <primitive object={cloned} />
}

function BoxModel({ size, color, isSelected }) {
  const [w, h, d] = size
  return (
    <Box args={[w, h, d]} position={[0, h / 2, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        color={isSelected ? '#7c3aed' : color}
        roughness={0.7}
        emissive={isSelected ? '#4c1d95' : '#000000'}
        emissiveIntensity={isSelected ? 0.4 : 0}
      />
    </Box>
  )
}

// Глобальное состояние диалога — используем ref чтобы не перерисовывать всё
let confirmCallback = null

function FurnitureItem({ item, interactive = true }) {
  const { gl, camera, raycaster } = useThree()
  const { selectedId, selectItem, moveItem, deselect } = useEditorStore()
  const isSelected = selectedId === item.id && interactive
  const dragging = useRef(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [w, h, d] = item.size

  const handleConfirmYes = (e) => {
    e.stopPropagation()
    setShowConfirm(false)
    selectItem(item.id)
  }

  const handleConfirmNo = (e) => {
    e.stopPropagation()
    setShowConfirm(false)
    deselect()
  }

  const onPointerDown = (e) => {
    if (!interactive) return
    e.stopPropagation()

    // Если уже выбран — сразу тащим
    if (selectedId === item.id) {
      dragging.current = true
      gl.domElement.setPointerCapture(e.pointerId)
      gl.domElement.style.cursor = 'grabbing'
      return
    }

    // Показываем диалог подтверждения
    setShowConfirm(true)
  }

  const onPointerUp = (e) => {
    if (!interactive) return
    dragging.current = false
    gl.domElement.releasePointerCapture(e.pointerId)
    gl.domElement.style.cursor = 'auto'
  }

  const onPointerMove = (e) => {
    if (!dragging.current || !interactive || showConfirm) return
    e.stopPropagation()

    const rect = gl.domElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera({ x, y }, camera)
    raycaster.ray.intersectPlane(floorPlane, planeTarget)

    if (planeTarget) {
      const newX = Math.max(0.3 + w / 2, Math.min(10.0 - w / 2, planeTarget.x))
      const newZ = Math.max(-3.0 + d / 2, Math.min(5.4 - d / 2, planeTarget.z))
      moveItem(item.id, [newX, 0, newZ])
    }
  }

  return (
    <group
      position={item.position}
      rotation={[0, item.rotation, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {item.modelPath ? (
        <Suspense fallback={<BoxModel size={item.size} color={item.color} isSelected={isSelected} />}>
          <GLBModel modelPath={item.modelPath} />
        </Suspense>
      ) : (
        <BoxModel size={item.size} color={item.color} isSelected={isSelected} />
      )}

      {isSelected && (
        <Box args={[w + 0.06, h + 0.06, d + 0.06]} position={[0, h / 2, 0]}>
          <meshBasicMaterial color="#7c3aed" wireframe />
        </Box>
      )}

      {/* Диалог подтверждения — рендерится в 3D пространстве над объектом */}
      {showConfirm && (
        <Html
          position={[0, h + 0.5, 0]}
          center
          distanceFactor={6}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: 'rgba(24, 24, 27, 0.97)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              padding: '14px 18px',
              minWidth: '180px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              userSelect: 'none',
            }}
          >
            <p style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              переместить?
            </p>
            <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              {item.title}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onPointerDown={handleConfirmYes}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                да
              </button>
              <button
                onPointerDown={handleConfirmNo}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#a1a1aa',
                  fontSize: '13px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                }}
              >
                нет
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default FurnitureItem
