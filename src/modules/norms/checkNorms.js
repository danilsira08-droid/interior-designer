// Модуль рекомендаций по планировке
// Источники:
// 🔴 СП 54.13330.2022, п. 7.20 — размещение сантехники
// 🟡 Эргономика жилого пространства — проходы и доступ
// 🟠 Рекомендации производителей — техника и отопление

const RULES = {
  SANITARY_ZONE: {
    id: 'SANITARY_ZONE',
    level: 'error',
    source: 'СП 54.13330.2022, п. 7.20',
    sourceUrl: 'https://docs.cntd.ru/document/745881815',
    title: 'Нарушение нормы',
  },
  MIN_PASSAGE: {
    id: 'MIN_PASSAGE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация',
  },
  DOOR_ZONE: {
    id: 'DOOR_ZONE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация',
  },
  BED_ACCESS: {
    id: 'BED_ACCESS',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация',
  },
  WARDROBE_ZONE: {
    id: 'WARDROBE_ZONE',
    level: 'warning',
    source: 'Эргономика жилого пространства',
    sourceUrl: null,
    title: 'Рекомендация',
  },
  RADIATOR_BLOCK: {
    id: 'RADIATOR_BLOCK',
    level: 'advice',
    source: 'Рекомендации по отоплению',
    sourceUrl: null,
    title: 'Совет',
  },
  WINDOW_BLOCK: {
    id: 'WINDOW_BLOCK',
    level: 'advice',
    source: 'Естественное освещение',
    sourceUrl: null,
    title: 'Совет',
  },
  FRIDGE_STOVE: {
    id: 'FRIDGE_STOVE',
    level: 'advice',
    source: 'Рекомендации производителей',
    sourceUrl: null,
    title: 'Совет',
  },
}

// Предметы которые НЕ участвуют в проверке проходов
// (шторы, полки на стенах — они у стены и не блокируют проходы)
const EXCLUDE_FROM_PASSAGE = [
  'curtains',
  'wall-shelf',
  'shelf',
]

// Предметы сантехники
const SANITARY_IDS = ['toilet', 'bath', 'bath-kit', 'toilet-brush', 'trash-can']

// Предметы кровати
const BED_IDS = ['bed-kingsize', 'bed-1', 'bed-2']

// Предметы шкафов
const WARDROBE_IDS = ['wardrobe-1', 'wardrobe-2']

// Bounding box объекта в 2D (вид сверху) с учётом поворота
function getBBox(item) {
  const [w, , d] = item.size
  const [x, , z] = item.position
  const cos = Math.abs(Math.cos(item.rotation || 0))
  const sin = Math.abs(Math.sin(item.rotation || 0))

  // Реальные размеры после поворота
  const rw = w * cos + d * sin
  const rd = w * sin + d * cos

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

// Расстояние между краями двух bounding box-ов
function distanceBetweenEdges(a, b) {
  const dx = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX))
  const dz = Math.max(0, Math.max(a.minZ, b.minZ) - Math.min(a.maxZ, b.maxZ))
  return Math.sqrt(dx * dx + dz * dz)
}

// Пересекаются ли два bbox
function overlaps(a, b) {
  return (
    a.minX < b.maxX && a.maxX > b.minX &&
    a.minZ < b.maxZ && a.maxZ > b.minZ
  )
}

// Зоны санузла для каждой квартиры
// Определяем по catalogId квартиры — передаём через аргумент
const BATHROOM_ZONES = {
  default: [
    // Основная зона санузла — подбирается под конкретную квартиру
    { minX: -2, maxX: 2, minZ: -2, maxZ: 2 },
  ],
  'apt-1room-2': [
    // Санузел apt-1room-2: по координатам ванны/туалета которые ты расставлял
    // Ванна X=-1.031, Z=-0.938 / Туалет X=0.818, Z=-0.368
    // Зона санузла примерно:
    { minX: -2.5, maxX: 2.0, minZ: -2.5, maxZ: 1.0 },
  ],
}

export function checkNorms(items, apartmentId = 'apt-1room-2') {
  const violations = []

  // Позиции радиаторов в квартире — у внешних стен под окнами
  // Для apt-1room-2 окна Window1/Window2 на стороне X=6.70
  const RADIATORS = [
    { minX: 5.5, maxX: 7.0, minZ: -2.0, maxZ: 2.0 },
  ]

  // Зона открывания двери — примерная для apt-1room-2
  const DOORS = [
    { x: 0, z: -1.5, radius: 0.9 },
  ]

  // Зоны санузла
  const bathroomZones = BATHROOM_ZONES[apartmentId] || BATHROOM_ZONES.default

  // Проверяем находится ли точка в одной из зон санузла
  function isInBathroom(bbox) {
    return bathroomZones.some(zone =>
      bbox.centerX >= zone.minX && bbox.centerX <= zone.maxX &&
      bbox.centerZ >= zone.minZ && bbox.centerZ <= zone.maxZ
    )
  }

  for (let i = 0; i < items.length; i++) {
    const a = items[i]
    const bboxA = getBBox(a)

    // ─── Н-1: Сантехника вне санузла ────────────────────────────
    if (SANITARY_IDS.includes(a.catalogId)) {
      if (!isInBathroom(bboxA)) {
        violations.push({
          ...RULES.SANITARY_ZONE,
          message: `"${a.title}" размещена вне зоны санузла. Согласно СП 54.13330.2022 п. 7.20, сантехника не может располагаться над жилыми комнатами.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Р-1: Мебель перекрывает радиатор ────────────────────────
    for (const rad of RADIATORS) {
      const radBbox = { minX: rad.minX, maxX: rad.maxX, minZ: rad.minZ, maxZ: rad.maxZ }
      if (overlaps(bboxA, radBbox) || distanceBetweenEdges(bboxA, radBbox) < 0.1) {
        violations.push({
          ...RULES.RADIATOR_BLOCK,
          message: `"${a.title}" перекрывает радиатор отопления. Оставьте не менее 10 см — теплоотдача снизится на 20–30%.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Р-2: Зона открывания двери ──────────────────────────────
    for (const door of DOORS) {
      const distToDoor = Math.sqrt(
        Math.pow(bboxA.centerX - door.x, 2) +
        Math.pow(bboxA.centerZ - door.z, 2)
      )
      const halfDiag = Math.sqrt(bboxA.w * bboxA.w + bboxA.d * bboxA.d) / 2
      if (distToDoor - halfDiag < door.radius) {
        violations.push({
          ...RULES.DOOR_ZONE,
          message: `"${a.title}" находится в зоне открывания двери. Освободите пространство радиусом 90 см.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Р-3: Доступ к кровати ────────────────────────────────────
    if (BED_IDS.includes(a.catalogId)) {
      // Хотя бы 60 см с одной стороны (слева или справа по X)
      const leftSpace  = bboxA.minX - (-7)   // от левой стены
      const rightSpace = 7 - bboxA.maxX       // до правой стены
      const frontSpace = bboxA.minZ - (-2)    // спереди
      const hasAccess  = leftSpace >= 0.6 || rightSpace >= 0.6 || frontSpace >= 0.6
      if (!hasAccess) {
        violations.push({
          ...RULES.BED_ACCESS,
          message: `"${a.title}" стоит вплотную к стенам. Оставьте хотя бы 60 см с одной стороны для удобного доступа.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Р-4: Зона перед шкафом ──────────────────────────────────
    if (WARDROBE_IDS.includes(a.catalogId)) {
      // Ищем ближайший свободный проход перед шкафом
      const frontSpace = bboxA.minZ - (-2)
      const backSpace  = 2 - bboxA.maxZ
      const clearance  = Math.max(frontSpace, backSpace)
      if (clearance < 0.6) {
        violations.push({
          ...RULES.WARDROBE_ZONE,
          message: `Перед "${a.title}" менее 60 см. Дверцы не откроются свободно.`,
          objectIds: [a.id],
        })
      }
    }

    // ─── Проверки между парами объектов ──────────────────────────
    for (let j = i + 1; j < items.length; j++) {
      const b = items[j]
      const bboxB = getBBox(b)

      // Пропускаем шторы и настенные полки в проверке проходов
      if (
        EXCLUDE_FROM_PASSAGE.includes(a.catalogId) ||
        EXCLUDE_FROM_PASSAGE.includes(b.catalogId)
      ) continue

      const dist = distanceBetweenEdges(bboxA, bboxB)

      // ─── Е-1: Минимальный проход 60 см ───────────────────────
      // Проверяем только если объекты реально рядом (не в разных концах комнаты)
      // Центры не дальше 3м друг от друга
      const centerDist = Math.sqrt(
        Math.pow(bboxA.centerX - bboxB.centerX, 2) +
        Math.pow(bboxA.centerZ - bboxB.centerZ, 2)
      )
      if (dist < 0.6 && dist > 0.01 && centerDist < 4.0) {
        violations.push({
          ...RULES.MIN_PASSAGE,
          message: `Расстояние между "${a.title}" и "${b.title}" — ${Math.round(dist * 100)} см. Рекомендуемый проход — минимум 60 см.`,
          objectIds: [a.id, b.id],
        })
      }

      // ─── З-1: Холодильник рядом с плитой ─────────────────────
      const isFridgeStove =
        (a.catalogId === 'fridge' && b.catalogId === 'stove') ||
        (a.catalogId === 'stove' && b.catalogId === 'fridge')
      if (isFridgeStove && dist < 0.15) {
        violations.push({
          ...RULES.FRIDGE_STOVE,
          message: `Холодильник стоит вплотную к плите. Оставьте 15 см — тепловое воздействие сокращает срок службы холодильника.`,
          objectIds: [a.id, b.id],
        })
      }
    }
  }

  // Убираем дубли
  const seen = new Set()
  return violations.filter(v => {
    const key = v.id + (v.objectIds || []).slice().sort().join(',')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}