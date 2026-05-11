import { useRef, useState, useEffect, Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore, SANITARY_IDS } from '../../modules/editor/useEditorStore'
import { clampToApartment, isInBathroom } from '../../modules/editor/apartmentBounds'

// Вычисляет реальный bbox загруженной сцены
function SelectionOutline({ scene }) {
  const box    = new THREE.Box3().setFromObject(scene)
  const size   = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  // center — локальные координаты внутри группы (уже с учётом поворота группы)
  return (
    <mesh position={[center.x, center.y, center.z]}>
      <boxGeometry args={[size.x + 0.05, size.y + 0.05, size.z + 0.05]} />
      <meshBasicMaterial color="#7c3aed" wireframe opacity={0.6} transparent depthTest={false} />
    </mesh>
  )
}

function FurnitureModel({ modelPath, color, selected }) {
  const { scene } = useGLTF(modelPath)
  const cloned = useRef(null)

  // Клонируем один раз
  if (!cloned.current) {
    cloned.current = scene.clone(true)
  }

  return (
    <>
      <primitive object={cloned.current} />
      {selected && <SelectionOutline scene={cloned.current} />}
    </>
  )
}

function FurnitureModelSafe({ modelPath, color, selected, size }) {
  try {
    return <FurnitureModel modelPath={modelPath} color={color} selected={selected} />
  } catch (e) {
    return <FallbackBox size={size} color={color} selected={selected} />
  }
}

function FallbackBox({ size, color, selected }) {
  return (
    <>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color || '#888'} roughness={0.7} metalness={0.1} />
      </mesh>
      {selected && (
        <mesh>
          <boxGeometry args={[size[0] + 0.05, size[1] + 0.05, size[2] + 0.05]} />
          <meshBasicMaterial color="#7c3aed" wireframe opacity={0.6} transparent depthTest={false} />
        </mesh>
      )}
    </>
  )
}

export default function FurnitureItem({ item, interactive }) {
  const groupRef = useRef()
  const { camera, gl, raycaster, invalidate } = useThree()
  const { selectedId, selectItem, moveItem, currentApartmentId } = useEditorStore()
  const selected = selectedId === item.id

  const [bathroomWarning, setBathroomWarning] = useState(false)
  const isDragging = useRef(false)
  const dragPlane  = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const dragOffset = useRef(new THREE.Vector3())

  const isSanitary = SANITARY_IDS.has(item.catalogId)

  useEffect(() => {
    if (!isSanitary || !currentApartmentId) return
    const [x, , z] = item.position
    setBathroomWarning(!isInBathroom(x, z, currentApartmentId))
  }, [item.position, isSanitary, currentApartmentId])

  const getFloorPos = (event) => {
    const rect  = gl.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width)  * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(mouse, camera)
    const target = new THREE.Vector3()
    raycaster.ray.intersectPlane(dragPlane.current, target)
    return target
  }

  const handlePointerDown = (e) => {
    if (!interactive) return
    e.stopPropagation()
    selectItem(item.id)
    isDragging.current = true
    gl.domElement.style.cursor = 'grabbing'

    const floorPos = getFloorPos(e.nativeEvent)
    if (floorPos) {
      dragOffset.current.set(
        item.position[0] - floorPos.x,
        0,
        item.position[2] - floorPos.z,
      )
    }

    const onMove = (ev) => {
      if (!isDragging.current) return
      const pos = getFloorPos(ev)
      if (!pos) return

      let newX = pos.x + dragOffset.current.x
      let newZ = pos.z + dragOffset.current.z

      if (currentApartmentId) {
        ;[newX, newZ] = clampToApartment(
          newX, newZ,
          item.size[0], item.size[2],
          item.rotation,
          currentApartmentId,
        )
      }

      moveItem(item.id, [newX, 0, newZ])
      invalidate()
    }

    const onUp = () => {
      isDragging.current = false
      gl.domElement.style.cursor = 'grab'
      useEditorStore.getState().saveCurrentItems?.()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
  }

  const [x, y, z] = item.position

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      rotation={[0, item.rotation || 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => { if (interactive) gl.domElement.style.cursor = 'grab' }}
      onPointerOut={() => { if (interactive) gl.domElement.style.cursor = 'auto' }}
    >
      <Suspense fallback={<FallbackBox size={item.size} color={item.color} selected={selected} />}>
        {item.modelPath
          ? <FurnitureModelSafe modelPath={item.modelPath} color={item.color} selected={selected} size={item.size} />
          : <FallbackBox size={item.size} color={item.color} selected={selected} />
        }
      </Suspense>

      {/* Предупреждение — сантехника не в санузле */}
      {bathroomWarning && (
        <Html center distanceFactor={8} position={[0, item.size[1] + 0.3, 0]}>
          <div style={{
            background: 'rgba(220,38,38,0.95)', color: 'white',
            padding: '4px 10px', borderRadius: '8px',
            fontSize: '12px', fontWeight: 600,
            whiteSpace: 'nowrap', pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            ⚠️ Только в санузле
          </div>
        </Html>
      )}
    </group>
  )
}