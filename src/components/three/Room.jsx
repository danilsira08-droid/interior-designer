import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

// ── OFFSETS ──────────────────────────────────────────────────────
const APARTMENT_OFFSETS = {
  'apt-1room':    -13.6,
  'apt-1room-2':   0,
  'apt-2room':     0,
  'apt-studroom':  0,
  'apt-3room':     0,
  'apt-3room2':    0,   // подберёшь после первого запуска
}

// ── ЛАМПЫ ────────────────────────────────────────────────────────
const LAMP_NAMES = new Set([
  'lamp_ceiling_1','lamp_ceiling_2','lamp_ceiling_3',
  'lamp_ceiling_4','lamp_ceiling_5','lamp_ceiling_6',
  'lamp_ceiling_7','lamp_ceiling_8','lamp_ceiling_9',
  'lamp_ceiling_10','lamp_ceiling_11','lamp_ceiling_12',
  'lamp_ceiling_13','lamp_ceiling_14','lamp_ceiling_15',
  'lamp_ceiling_16','lamp_ceiling_17','lamp_ceiling_18',
  'lamp_ceiling_19','lamp_ceiling_20',
  'lamp_kitchen','ceiling_kitchen',
])

// ── ОКНА ─────────────────────────────────────────────────────────
const WINDOW_PARENT_NAMES = new Set([
  'Window1','Window2','Window3','Window4',
  'Window5','Window6','Window7','Window8',
  'window','window001','window002',
  'Photo1','Photo2',
])

// ── САНУЗЛЫ ──────────────────────────────────────────────────────
const BATHROOM_WALL_NAMES = new Set([
  'Walls_Bathroom_1','Walls_Bathroom_2','Walls_Bathroom_3',
])
const BATHROOM_FLOOR_NAMES = new Set([
  'Floor_Bathroom_1','Floor_Bathroom_2','Floor_Bathroom_3',
  'Floor_Bathroom_4','Floor_Bathroom_5','Floor_Bathroom_6',
])

// ── СТЕНЫ КОМНАТ (apt-3room2) ─────────────────────────────────────
// Для окраски используем основной wallColor
// В будущем можно добавить отдельные цвета на каждую комнату
const ROOM_WALL_NAMES = new Set([
  'Walls_Bedroom','Walls_Bedroom_1','Walls_Bedroom_2',
  'Walls_Kitchen','Walls_Kitchen_1',
  'Walls_LivingRoom','Walls_LivingRoom_1','Walls_LivingRoom_2',
])
const ROOM_FLOOR_NAMES = new Set([
  'Floor_Bedroom','Floor_Bedroom_1','Floor_Bedroom_2',
  'Floor_Kitchen','Floor_Kitchen_1',
  'Floor_LivingRoom','Floor_LivingRoom_1','Floor_LivingRoom_2',
])

function isGlassMesh(name) {
  return name.includes('Glass') || name.includes('glass') || name.includes('Frame_Glass')
}

function getLampConfig(name) {
  if (name === 'lamp_kitchen' || name === 'ceiling_kitchen')
    return { intensity: 3.0, color: '#fff0cc', distance: 6,  decay: 1.5 }
  if (name === 'lamp_ceiling_11')
    return { intensity: 2.5, color: '#ffe4b5', distance: 6,  decay: 1.8 }
  if (['lamp_ceiling_4','lamp_ceiling_5'].includes(name))
    return { intensity: 1.5, color: '#ffedcc', distance: 5,  decay: 2.0 }
  return   { intensity: 4.0, color: '#fff8f0', distance: 8,  decay: 1.5 }
}

function LampLight({ mesh, lampName, yOffset }) {
  const [pos, setPos] = useState(null)
  useEffect(() => {
    if (!mesh) return
    const box = new THREE.Box3().setFromObject(mesh)
    const center = new THREE.Vector3()
    box.getCenter(center)
    center.y += yOffset
    setPos([center.x, center.y, center.z])
  }, [mesh, yOffset])
  if (!pos) return null
  const cfg = getLampConfig(lampName)
  return <pointLight position={pos} intensity={cfg.intensity} color={cfg.color} distance={cfg.distance} decay={cfg.decay} />
}

function applyColor(child, color, removeTexture = true) {
  if (!child.material || !color) return
  const mats = Array.isArray(child.material) ? child.material : [child.material]
  mats.forEach((mat, i) => {
    const m = mat.clone()
    if (removeTexture) m.map = null
    m.color = new THREE.Color(color)
    m.needsUpdate = true
    if (Array.isArray(child.material)) child.material[i] = m
    else child.material = m
  })
}

function Room({ modelPath, apartmentId, showCeiling, wallColor, ceilingColor, floorColor, bathroomWallColor, bathroomFloorColor }) {
  const { scene } = useGLTF(modelPath)
  const [lamps, setLamps] = useState([])
  const yOffset = APARTMENT_OFFSETS[apartmentId] ?? 0

  const [windowTexture] = useState(() => {
    const tex = new THREE.TextureLoader().load('/images/window-view-1.jpg')
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  })

  useEffect(() => {
    const foundLamps = []

    scene.traverse(child => {
      if (!child.isMesh) return
      child.castShadow    = true
      child.receiveShadow = true

      const orig   = child.name
      const parent = child.parent?.name || ''

      // ── Потолок ────────────────────────────────────────────────
      if (orig === 'Ceiling') {
        child.visible = showCeiling
        if (ceilingColor) applyColor(child, ceilingColor)
        return
      }

      // ── Стены санузлов ──────────────────────────────────────────
      if (BATHROOM_WALL_NAMES.has(orig) || BATHROOM_WALL_NAMES.has(parent)) {
        if (bathroomWallColor) applyColor(child, bathroomWallColor)
        return
      }

      // ── Полы санузлов ───────────────────────────────────────────
      if (BATHROOM_FLOOR_NAMES.has(orig) || BATHROOM_FLOOR_NAMES.has(parent)) {
        if (bathroomFloorColor) applyColor(child, bathroomFloorColor, false)
        return
      }

      // ── Стены комнат (apt-3room2) ──────────────────────────────
      // Красятся основным цветом стен
      if (ROOM_WALL_NAMES.has(orig) || ROOM_WALL_NAMES.has(parent)) {
        if (wallColor) applyColor(child, wallColor)
        return
      }

      // ── Полы комнат (apt-3room2) ───────────────────────────────
      if (ROOM_FLOOR_NAMES.has(orig) || ROOM_FLOOR_NAMES.has(parent)) {
        if (floorColor) applyColor(child, floorColor, false)
        return
      }

      // ── Основные стены ──────────────────────────────────────────
      if (orig === 'Walls' || parent === 'Walls') {
        if (wallColor) applyColor(child, wallColor)
        return
      }

      // ── Основной пол ────────────────────────────────────────────
      if (orig === 'Floor' || parent === 'Floor') {
        if (floorColor) applyColor(child, floorColor, false)
        return
      }

      // ── Окна — только стёкла прозрачные ────────────────────────
      if (WINDOW_PARENT_NAMES.has(parent)) {
        if (isGlassMesh(orig)) {
          child.material = new THREE.MeshStandardMaterial({
            map: windowTexture, transparent: true, opacity: 0.35,
            roughness: 0.05, metalness: 0.1,
            color: new THREE.Color('#ddeeff'),
          })
          child.renderOrder = 1
        }
        return
      }

      // ── Photo1/Photo2 ────────────────────────────────────────────
      if (orig === 'Photo1' || orig === 'Photo2') {
        child.material = new THREE.MeshBasicMaterial({ map: windowTexture, side: THREE.FrontSide })
        return
      }

      // ── Лампы ───────────────────────────────────────────────────
      const lampName = LAMP_NAMES.has(orig) ? orig : LAMP_NAMES.has(parent) ? parent : null
      if (lampName) {
        if (child.material) {
          const m = child.material.clone()
          m.emissive = new THREE.Color('#ffedaa')
          m.emissiveIntensity = 4.0
          m.needsUpdate = true
          child.material = m
        }
        if (!foundLamps.find(l => l.lampName === lampName)) {
          foundLamps.push({ lampName, mesh: child })
        }
      }
    })

    setLamps(foundLamps)
  }, [scene, showCeiling, wallColor, ceilingColor, floorColor, bathroomWallColor, bathroomFloorColor])

  return (
    <>
      <primitive object={scene} position={[0, yOffset, 0]} />
      {lamps.map((lamp, i) => (
        <LampLight key={i} mesh={lamp.mesh} lampName={lamp.lampName} yOffset={yOffset} />
      ))}
    </>
  )
}

function RoomFallback() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 12]} />
      <meshStandardMaterial color="#c4a882" roughness={0.8} />
    </mesh>
  )
}

export default function RoomLoader(props) {
  if (!props.modelPath) return <RoomFallback />
  return <Room {...props} />
}

useGLTF.preload('/models/apartments/apt-1room-2.glb')
useGLTF.preload('/models/apartments/apt-3room.glb')
useGLTF.preload('/models/apartments/apt-3room2.glb')