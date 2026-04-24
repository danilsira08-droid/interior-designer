// Модуль проверки норм и эргономики
// Источники:
// 🔴 СП 54.13330.2022, п. 7.20 — размещение сантехники
// 🟡 Эргономика жилого пространства — проходы и доступ
// 🟠 Рекомендации производителей — техника и отопление

const RULES = {
  // --- НОРМАТИВНЫЕ (красные) ---
  SANITARY_ZONE: {
    id: 'SANITARY_ZONE',
    level: 'error',
    source: 'СП 54.13330.2022, п. 7.20',
    sourceUrl: 'https://docs.cntd.ru/document/745881815',
    title: 'Нарушение нормы',
  },

  // --- ЭРГОНОМИКА (жёлтые) ---
  MIN_PASSAGE: {
    id: 'MIN_PASSAGE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация по эргономике',
  },
  MAIN_PASSAGE: {
    id: 'MAIN_PASSAGE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация по эргономике',
  },
  DOOR_ZONE: {
    id: 'DOOR_ZONE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация по эргономике',
  },
  BED_ACCESS: {
    id: 'BED_ACCESS',
    level: 'warning',
    source: 'Рекомендации производителей мебели',
    sourceUrl: null,
    title: 'Рекомендация по эргономике',
  },
  WARDROBE_ZONE: {
    id: 'WARDROBE_ZONE',
    level: 'warning',
    source: 'Рекомендации производителей мебели',
    sourceUrl: null,
    title: 'Рекомендация по эргономике',
  },
  SOFA_ZONE: {
    id: 'SOFA_ZONE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация по эргономике',
  },

  // --- ЗДРАВЫЙ СМЫСЛ (оранжевые) ---
  FRIDGE_STOVE: {
    id: 'FRIDGE_STOVE',
    level: 'advice',
    source: 'Рекомендации производителей бытовой техники',
    sourceUrl: null,
    title: 'Рекомендация',
  },
  RADIATOR_BLOCK: {
    id: 'RADIATOR_BLOCK',
    level: 'advice',
    source: 'Рекомендации производителей радиаторов отопления',
    sourceUrl: null,
    title: 'Рекомендация',
  },
  WINDOW_BLOCK: {
    id: 'WINDOW_BLOCK',
    level: 'advice',
    source: 'Здравый смысл — естественное освещение',
    sourceUrl: null,
    title: 'Рекомендация',
  },
}

// Получить bounding box объекта в 2D (вид сверху)
function getBBox(item) {
  const [w, , d] = item.size
  const [x, , z] = item.position
  const cos = Math.cos(item.rotation)
  const sin = Math.sin(item.rotation)

  // После поворота реальные размеры по осям
  const rw = Math.abs(w * cos) + Math.abs(d * sin)
  const rd = Math.abs(w * sin) + Math.abs(d * cos)

  return {
    minX: x - rw / 2,
    maxX: x + rw / 2,
    minZ: z - rd / 2,
    maxZ: z + rd / 2,
    centerX: x,
    centerZ: z,
    w: rw,
    d: rd,
  }
}

// Расстояние между двумя bounding box-ами
function distanceBetween(a, b) {
  const dx = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX))
  const dz = Math.max(0, Math.max(a.minZ, b.minZ) - Math.min(a.maxZ, b.maxZ))
  return Math.sqrt(dx * dx + dz * dz)
}

// Санитарные объекты
const SANITARY_IDS = ['toilet', 'bath', 'shower', 'washing-machine']
// Кухонные объекты
const KITCHEN_IDS = ['fridge', 'stove', 'dining-table', 'kitchen-table']
// Мягкая мебель
const SOFT_IDS = ['sofa', 'armchair']
// Шкафы
const WARDROBE_IDS = ['wardrobe']
// Кровати
const BED_IDS = ['bed']

export function checkNorms(items) {
  const violations = []

  // Комната: x от -4 до 4, z от -3 до 3
  const ROOM = { minX: -4, maxX: 4, minZ: -3, maxZ: 3 }

  // Позиции радиаторов (у внешних стен, обычно под окнами)
  // Задняя стена z = -3, окна обычно по центру
  const RADIATORS = [
    { x: 0, z: -2.85, w: 1.0, d: 0.1 }, // радиатор под окном задней стены
  ]

  // Позиция двери (левая стена)
  const DOOR = { x: -3.95, z: 0, openRadius: 0.85, openDirection: 'right' }

  for (let i = 0; i < items.length; i++) {
    const a = items[i]
    const bboxA = getBBox(a)

    // ─── Е-3: Зона открывания двери ───
    const distToDoor = Math.sqrt(
      Math.pow(bboxA.centerX - DOOR.x, 2) +
      Math.pow(bboxA.centerZ - DOOR.z, 2)
    )
    if (distToDoor < DOOR.openRadius + Math.max(bboxA.w, bboxA.d) / 2) {
      violations.push({
        ...RULES.DOOR_ZONE,
        message: `"${a.title}" находится в зоне открывания двери. Освободите пространство радиусом 85 см от двери.`,
        objectIds: [a.id],
      })
    }

    // ─── З-2: Мебель перекрывает радиатор ───
    for (const rad of RADIATORS) {
      const radBbox = {
        minX: rad.x - rad.w / 2, maxX: rad.x + rad.w / 2,
        minZ: rad.z - rad.d / 2, maxZ: rad.z + rad.d / 2,
      }
      const dist = distanceBetween(bboxA, radBbox)
      if (dist < 0.1) {
        violations.push({
          ...RULES.RADIATOR_BLOCK,
          message: `"${a.title}" перекрывает радиатор отопления. Оставьте не менее 10 см — иначе теплоотдача снижается на 20–30%.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── З-3: Мебель перекрывает окно ───
    // Окно на задней стене z = -3, x от -1.5 до 1.5, высота > 0.9м
    const WINDOW = { minX: -1.5, maxX: 1.5, z: -3 }
    if (
      a.size[1] > 0.9 &&
      bboxA.minZ < WINDOW.z + 0.3 &&
      bboxA.maxX > WINDOW.minX &&
      bboxA.minX < WINDOW.maxX
    ) {
      violations.push({
        ...RULES.WINDOW_BLOCK,
        message: `"${a.title}" перекрывает оконный проём. Это ухудшает естественное освещение и вентиляцию.`,
        objectIds: [a.id],
      })
    }

    // ─── Н-1: Сантехника вне санузла ───
    if (SANITARY_IDS.includes(a.catalogId)) {
      // Зона санузла: правый угол комнаты
      const BATHROOM_ZONE = { minX: 1.5, maxX: 4, minZ: -3, maxZ: 0 }
      if (
        bboxA.centerX < BATHROOM_ZONE.minX ||
        bboxA.centerZ > BATHROOM_ZONE.maxZ
      ) {
        violations.push({
          ...RULES.SANITARY_ZONE,
          message: `"${a.title}" размещена вне зоны санузла. Сантехника не может располагаться над жилыми комнатами и кухней согласно СП 54.13330.2022, п. 7.20.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Е-4: Доступ к кровати ───
    if (BED_IDS.includes(a.catalogId)) {
      const [w, , d] = a.size
      const leftClear = bboxA.minX - ROOM.minX
      const rightClear = ROOM.maxX - bboxA.maxX
      const hasAccess = leftClear >= 0.6 || rightClear >= 0.6
      if (!hasAccess) {
        violations.push({
          ...RULES.BED_ACCESS,
          message: `"${a.title}" стоит вплотную к стенам с обеих сторон. Оставьте хотя бы 60 см с одной стороны для удобного доступа.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Е-5: Зона перед шкафом ───
    if (WARDROBE_IDS.includes(a.catalogId)) {
      const frontClear = ROOM.maxX - bboxA.maxX
      if (frontClear < 0.6) {
        violations.push({
          ...RULES.WARDROBE_ZONE,
          message: `"${a.title}": перед шкафом менее 60 см. Двери не откроются свободно.`,
          objectIds: [a.id],
        })
      }
    }

    // Проверки между парами объектов
    for (let j = i + 1; j < items.length; j++) {
      const b = items[j]
      const bboxB = getBBox(b)
      const dist = distanceBetween(bboxA, bboxB)

      // ─── Е-1: Минимальный проход 60 см ───
      if (dist < 0.6 && dist > 0) {
        violations.push({
          ...RULES.MIN_PASSAGE,
          message: `Расстояние между "${a.title}" и "${b.title}" — ${Math.round(dist * 100)} см. Минимальный проход — 60 см.`,
          objectIds: [a.id, b.id],
        })
      }

      // ─── З-1: Холодильник рядом с плитой ───
      const isFridgeStove =
        (a.catalogId === 'fridge' && b.catalogId === 'stove') ||
        (a.catalogId === 'stove' && b.catalogId === 'fridge')
      if (isFridgeStove && dist < 0.15) {
        violations.push({
          ...RULES.FRIDGE_STOVE,
          message: `Холодильник стоит вплотную к плите. Оставьте не менее 15 см — тепловое воздействие сокращает срок службы холодильника.`,
          objectIds: [a.id, b.id],
        })
      }
    }
  }

  // Убираем дубли по objectIds
  const seen = new Set()
  return violations.filter(v => {
    const key = v.id + v.objectIds.sort().join(',')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
