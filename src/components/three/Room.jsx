import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

// Смещение по Y для каждой квартиры — подбирай здесь
const APARTMENT_OFFSETS = {
  'apt-1room': -13.6,
  'apt-2room': 0, // поменяй если нужно
}

function Room({ modelPath, apartmentId, showCeiling = false }) {
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        const name = child.name.toLowerCase()
        if (name.includes('ceiling') || name.includes('потолок')) {
          child.visible = showCeiling
        }
      }
    })
  }, [scene, showCeiling])

  const yOffset = APARTMENT_OFFSETS[apartmentId] ?? -13.6

  return <primitive object={scene} position={[0, yOffset, 0]} />
}

function RoomFallback() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#c4a882" roughness={0.8} />
      </mesh>
    </group>
  )
}

export default function RoomLoader({ modelPath, apartmentId, showCeiling }) {
  if (!modelPath) return <RoomFallback />
  return <Room modelPath={modelPath} apartmentId={apartmentId} showCeiling={showCeiling} />
}

useGLTF.preload('/models/apartments/apt-1room.glb')
useGLTF.preload('/models/apartments/apt-2room.glb')
