export const APARTMENT_BOUNDS = {
  'apt-1room':     { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [{ xMin: -3.1, xMax: -1.1, zMin: -1.6, zMax: 1.1 }] },
  'apt-1room-2':   { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [{ xMin: 4.0,  xMax: 6.70, zMin: -1.80, zMax: 1.30 }] },
  'apt-1room-3':   { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-2room':     { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-2room-2':   { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-2room-3':   { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-studroom':  { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-studroom-2':{ outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-studroom-3':{ outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
  'apt-3room':     {
    outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 },
    bathrooms: [
      { xMin: -0.10, xMax: 1.79,  zMin: 2.24,  zMax: 3.61  },
      { xMin: -2.06, xMax: -0.37, zMin: 2.24,  zMax: 3.84  },
      { xMin: -2.87, xMax: -1.16, zMin: -4.94, zMax: -3.50 },
    ],
  },
  'apt-3room2':    { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },

  // ── apt-3room-3 — из замеров, с запасом 0.15м ────────────────
  'apt-3room-3': {
    outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 },
    bathrooms: [
      // Санузел 1: X:-1.61..1.12, Z:-2.81..-1.02 — берём с большим запасом
      { xMin: -1.9, xMax: 1.4, zMin: -3.1, zMax: -0.7 },
      // Санузел 2: X:1.12..2.27, Z:-2.71..-1.00 — тоже с запасом
      { xMin: 0.8,  xMax: 2.6, zMin: -3.1, zMax: -0.7 },
    ],
    rooms: {
      kitchen:  { xMin: 2.15, xMax: 8.0,  zMin: 0.0,  zMax: 3.3,  name: 'Кухня' },
      living1:  { xMin: 2.15, xMax: 8.0,  zMin: -3.1, zMax: 0.3,  name: 'Гостиная 1' },
      bedroom:  { xMin: -6.4, xMax: -0.1, zMin: 0.25, zMax: 3.3,  name: 'Спальня' },
      living2:  { xMin: -6.4, xMax: -1.5, zMin: -3.1, zMax: 0.3,  name: 'Гостиная 2' },
    },
  },

  'custom': { outer: { xMin: -20, xMax: 20, zMin: -20, zMax: 20 }, bathrooms: [] },
}

export function clampToApartment(x, z, itemW, itemD, rotation, apartmentId) {
  const bounds = APARTMENT_BOUNDS[apartmentId]
  if (!bounds) return [x, z]

  const { outer } = bounds
  const MARGIN = 0.05
  const cos = Math.abs(Math.cos(rotation || 0))
  const sin = Math.abs(Math.sin(rotation || 0))
  const hw = (itemW * cos + itemD * sin) / 2
  const hd = (itemW * sin + itemD * cos) / 2

  const clampedX = Math.max(outer.xMin + hw + MARGIN, Math.min(outer.xMax - hw - MARGIN, x))
  const clampedZ = Math.max(outer.zMin + hd + MARGIN, Math.min(outer.zMax - hd - MARGIN, z))

  return [clampedX, clampedZ]
}

export function isInBathroom(x, z, apartmentId) {
  const bounds = APARTMENT_BOUNDS[apartmentId]
  if (!bounds) return true
  if (!bounds.bathrooms || bounds.bathrooms.length === 0) return false
  return bounds.bathrooms.some(b =>
    x >= b.xMin && x <= b.xMax && z >= b.zMin && z <= b.zMax
  )
}

export function getRoomName(x, z, apartmentId) {
  const bounds = APARTMENT_BOUNDS[apartmentId]
  if (!bounds?.rooms) return null
  for (const room of Object.values(bounds.rooms)) {
    if (x >= room.xMin && x <= room.xMax && z >= room.zMin && z <= room.zMax) {
      return room.name
    }
  }
  return null
}