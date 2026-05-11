export const APARTMENT_BOUNDS = {

  'apt-1room-2': {
    outer:     { xMin: -6.85, xMax: 6.70, zMin: -1.80, zMax: 1.30 },
    bathrooms: [{ xMin: 4.0,  xMax: 6.70, zMin: -1.80, zMax: 1.30 }],
    rooms: {
      living:   { xMin: -6.85, xMax: 2.0,  zMin: -1.80, zMax: 1.30, name: 'Гостиная/кухня' },
      bathroom: { xMin: 2.0,   xMax: 6.70, zMin: -1.80, zMax: 1.30, name: 'Санузел' },
    },
  },

  'apt-3room': {
    outer:     { xMin: -7.19, xMax: 6.18, zMin: -5.16, zMax: 3.84 },
    bathrooms: [
      { xMin: -0.10, xMax: 1.79,  zMin: 2.24,  zMax: 3.61,  name: 'Санузел 1' },
      { xMin: -2.06, xMax: -0.37, zMin: 2.24,  zMax: 3.84,  name: 'Санузел 2' },
      { xMin: -2.87, xMax: -1.16, zMin: -4.94, zMax: -3.50, name: 'Санузел 3' },
    ],
    rooms: {
      bedroom1: { xMin: 2.08,  xMax: 6.18,  zMin: 1.11,  zMax: 3.84,  name: 'Спальня 1' },
      bedroom2: { xMin: -7.19, xMax: -2.21, zMin: 1.11,  zMax: 3.84,  name: 'Спальня 2' },
      living:   { xMin: -7.18, xMax: -2.92, zMin: -2.18, zMax: 0.83,  name: 'Гостиная' },
      kitchen:  { xMin: -7.19, xMax: -3.11, zMin: -5.16, zMax: -2.33, name: 'Кухня' },
      bathroom1:{ xMin: -0.10, xMax: 1.79,  zMin: 2.24,  zMax: 3.61,  name: 'Санузел 1' },
      bathroom2:{ xMin: -2.06, xMax: -0.37, zMin: 2.24,  zMax: 3.84,  name: 'Санузел 2' },
      bathroom3:{ xMin: -2.87, xMax: -1.16, zMin: -4.94, zMax: -3.50, name: 'Санузел 3' },
      wardrobe: { xMin: -1.03, xMax: -0.64, zMin: -1.67, zMax: 0.96,  name: 'Гардероб' },
      hallway:  { xMin: -2.92, xMax: 2.08,  zMin: -2.18, zMax: 1.11,  name: 'Прихожая' },
    },
  },

  // ── apt-3room2 — замерь инструментом и заполни координаты ──────
  // Пока ставим широкие границы чтобы мебель не была заблокирована
  'apt-3room2': {
    outer:     { xMin: -12.0, xMax: 12.0, zMin: -12.0, zMax: 12.0 },
    bathrooms: [
      // Замерь санузлы инструментом и вставь координаты
      { xMin: -3.0, xMax: 0.0, zMin: 5.0, zMax: 9.0, name: 'Санузел 1' },
      { xMin: -3.0, xMax: 0.0, zMin: 0.0, zMax: 4.0, name: 'Санузел 2' },
    ],
    rooms: {
      living:   { xMin: -12.0, xMax: 12.0, zMin: -12.0, zMax: 12.0, name: 'Кухня-гостиная' },
      bedroom1: { xMin: -12.0, xMax: 12.0, zMin: -12.0, zMax: 12.0, name: 'Спальня 1' },
      bedroom2: { xMin: -12.0, xMax: 12.0, zMin: -12.0, zMax: 12.0, name: 'Спальня 2' },
    },
  },

  'apt-1room': {
    outer:     { xMin: -6.0, xMax: 6.0,  zMin: -3.0, zMax: 3.0 },
    bathrooms: [{ xMin: 3.5, xMax: 6.0,  zMin: -3.0, zMax: 0.0 }],
    rooms: {},
  },
  'apt-2room': {
    outer:     { xMin: -7.0, xMax: 7.0,  zMin: -4.0, zMax: 4.0 },
    bathrooms: [{ xMin: 4.0, xMax: 7.0,  zMin: -4.0, zMax: 0.0 }],
    rooms: {},
  },
  'apt-studroom': {
    outer:     { xMin: -5.0, xMax: 5.0,  zMin: -3.0, zMax: 3.0 },
    bathrooms: [{ xMin: 2.5, xMax: 5.0,  zMin: -3.0, zMax: 0.0 }],
    rooms: {},
  },
}

export function isInBathroom(x, z, apartmentId) {
  const bounds = APARTMENT_BOUNDS[apartmentId]
  if (!bounds) return true
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
  return 'Коридор'
}

export function clampToApartment(x, z, itemW, itemD, rotation, apartmentId) {
  const bounds = APARTMENT_BOUNDS[apartmentId]
  if (!bounds) return [x, z]

  const { outer } = bounds
  const WALL_MARGIN = 0.15

  const cos = Math.abs(Math.cos(rotation || 0))
  const sin = Math.abs(Math.sin(rotation || 0))
  const hw = (itemW * cos + itemD * sin) / 2
  const hd = (itemW * sin + itemD * cos) / 2

  const clampedX = Math.max(outer.xMin + hw + WALL_MARGIN, Math.min(outer.xMax - hw - WALL_MARGIN, x))
  const clampedZ = Math.max(outer.zMin + hd + WALL_MARGIN, Math.min(outer.zMax - hd - WALL_MARGIN, z))

  return [clampedX, clampedZ]
}