import { create } from 'zustand'

export const FURNITURE_CATALOG = [

  // ══════════════════════════════════════════════════════════════
  // СПАЛЬНЯ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bed-kingsize',
    title: 'Кровать King Size',
    description: 'Большая двуспальная кровать King Size с мягким изголовьем, ставится у стены изголовьем, подходит для просторной спальни',
    category: 'bedroom',
    size: [2.0, 0.6, 2.2],
    color: '#5a4a3a',
    modelPath: '/models/furniture/bed_kingsize.glb',
    icon: '/icons/furniture/bed_kingsize.jpg',
  },
  {
    id: 'bed-floss',
    title: 'Кровать Floss',
    description: 'Современная кровать king-size 2.09×2.54м. Изголовье и основание обиты светло-бежевой тканью, белая простыня, тёмные подушки, чёрное одеяло. Стиль — современный минимализм',
    category: 'bedroom',
    size: [2.09, 0.8, 2.54],
    color: '#c8b8a0',
    modelPath: '/models/furniture/bed_floss.glb',
    icon: '/icons/furniture/bed_floss.jpg',
  },
  {
    id: 'bed-1',
    title: 'Кровать (вар. 1)',
    description: 'Односпальная кровать компактного размера, подходит для небольших спален',
    category: 'bedroom',
    size: [1.6, 0.5, 2.0],
    color: '#3a5a6b',
    modelPath: '/models/furniture/bed_1.glb',
    icon: null,
  },
  {
    id: 'bed-2',
    title: 'Кровать (вар. 2)',
    description: 'Двуспальная кровать среднего размера в современном стиле',
    category: 'bedroom',
    size: [1.6, 0.5, 2.0],
    color: '#2a4a5a',
    modelPath: '/models/furniture/bed_2.glb',
    icon: null,
  },
  {
    id: 'wardrobe-nordic',
    title: 'Шкаф Nordic',
    description: 'Большой современный шкаф-гардероб 2.4×0.49×2.2м. Панели из светлого дуба и матовые белые дверцы без фурнитуры, ручки — прямые вырезы, открытые боковые полки. Стиль — минимализм, скандинавский',
    category: 'bedroom',
    size: [2.4, 2.2, 0.49],
    color: '#d4c4a0',
    modelPath: '/models/furniture/wardrobe_nordic.glb',
    icon: '/icons/furniture/wardrobe_nordic.jpg',
  },
  {
    id: 'wardrobe-classic',
    title: 'Шкаф Classic',
    description: 'Современный открытый шкаф-гардероб 2.0×0.6×2.06м из светлого натурального дерева. Система открытых ячеек и высокое отделение с металлической перекладиной для одежды. Без дверей, минимализм, скандинавский стиль',
    category: 'bedroom',
    size: [2.0, 2.06, 0.6],
    color: '#c8b888',
    modelPath: '/models/furniture/wardrobe_classic.glb',
    icon: '/icons/furniture/wardrobe_classic.jpg',
  },
  {
    id: 'wardrobe-1',
    title: 'Шкаф большой',
    description: 'Вместительный распашной шкаф для одежды, ставится вдоль стены, нужно 60 см перед дверцами',
    category: 'bedroom',
    size: [1.8, 2.2, 0.6],
    color: '#3a3a4a',
    modelPath: '/models/furniture/wardrobe_1.glb',
    icon: '/icons/furniture/wardrobe_large.jpg',
  },
  {
    id: 'wardrobe-2',
    title: 'Шкаф (вар. 2)',
    description: 'Широкий шкаф-купе для хранения одежды и вещей',
    category: 'bedroom',
    size: [2.0, 2.2, 0.6],
    color: '#2a2a3a',
    modelPath: '/models/furniture/wardrobe_2.glb',
    icon: null,
  },
  {
    id: 'mirror',
    title: 'Зеркало напольное',
    description: 'Высокое напольное зеркало с арочной верхней частью 0.17×0.53×1.62м. Тонкая рама золотого цвета, зеркало немного наклонено назад. Стиль — современный минимализм. Подходит для спальни, прихожей, гардеробной',
    category: 'bedroom',
    size: [0.17, 1.62, 0.53],
    color: '#d4af60',
    modelPath: '/models/furniture/mirror.glb',
    icon: '/icons/furniture/mirror.jpg',
  },
  {
    id: 'commod-bristol',
    title: 'Комод Bristol',
    description: 'Деревянный комод с ящиками в классическом стиле, используется в спальне или гостиной',
    category: 'bedroom',
    size: [1.0, 0.9, 0.5],
    color: '#6a5a4a',
    modelPath: '/models/furniture/commod_bristol.glb',
    icon: null,
  },
  {
    id: 'wall-shelf',
    title: 'Полка настенная',
    description: 'Навесная настенная полка для книг и декора, крепится к стене',
    category: 'bedroom',
    size: [1.0, 0.2, 0.3],
    color: '#8a6a4a',
    modelPath: '/models/furniture/wall_shelf.glb',
    icon: '/icons/furniture/wall_shelf.jpg',
  },
  {
    id: 'shelf',
    title: 'Стеллаж',
    description: 'Открытый стеллаж для книг и декора, ставится вертикально у стены',
    category: 'bedroom',
    size: [0.8, 1.8, 0.3],
    color: '#7a6a5a',
    modelPath: '/models/furniture/shelf.glb',
    icon: '/icons/furniture/shelf.jpg',
  },
  {
    id: 'computer-desk-apple',
    title: 'Рабочий стол',
    description: 'Современный рабочий стол, лучше ставить у окна для естественного освещения',
    category: 'bedroom',
    size: [1.4, 0.75, 0.7],
    color: '#3a3a4a',
    modelPath: '/models/furniture/computer_desk_apple.glb',
    icon: '/icons/furniture/computer_desk_apple.jpg',
  },

  // ══════════════════════════════════════════════════════════════
  // ГОСТИНАЯ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sofa-leather',
    title: 'Диван кожаный',
    description: 'Современный мягкий диван 2.38×1.05×0.81м. Обит чёрной матовой кожей, две декоративные подушки, объёмные сиденья, массивные подлокотники, глубокая посадка. Стиль — современный лофт, минимализм',
    category: 'living',
    size: [2.38, 1.05, 0.81],
    color: '#1a1a1a',
    modelPath: '/models/furniture/leather_sofa.glb',
    icon: '/icons/furniture/leather_sofa.jpg',
  },
  {
    id: 'sofa-polly',
    title: 'Диван Polly',
    description: 'Современный дизайнерский диван 2.31×1.01×0.72м. Обит мягкой белой тканью с выраженной текстурой, плавные скруглённые формы, интегрированные подлокотники, две круглые декоративные подушки. Стиль — современный минимализм',
    category: 'living',
    size: [2.31, 1.01, 0.72],
    color: '#f0ece8',
    modelPath: '/models/furniture/sofa_polly.glb',
    icon: '/icons/furniture/sofa_polly.jpg',
  },
  {
    id: 'sofa-grey-fabric',
    title: 'Диван серый',
    description: 'Современный трёхместный диван 2.9×1.07×0.74м. Обит светлой бежевой тканью, прямые строгие формы, мягкие сиденья, широкие подлокотники, три большие спинки-подушки. Стиль — скандинавский, минимализм',
    category: 'living',
    size: [2.9, 1.07, 0.74],
    color: '#b8b0a0',
    modelPath: '/models/furniture/sofa_grey_fabric.glb',
    icon: '/icons/furniture/sofa_grey_fabric.jpg',
  },
  {
    id: 'sofa-kelly',
    title: 'Диван Kelly',
    description: 'Современный двухместный диван 1.85×0.81×0.61м. Обит тёмно-синей матовой кожей, плавно изогнутая спинка и подлокотники, тонкие металлические ножки. Стиль — минималистичный, современный',
    category: 'living',
    size: [1.85, 0.61, 0.81],
    color: '#1a2a4a',
    modelPath: '/models/furniture/sofa_kelly.glb',
    icon: '/icons/furniture/sofa_kelly.jpg',
  },
  {
    id: 'sofa-vivente',
    title: 'Диван Vivente',
    description: 'Современный диван 1.69×0.9×0.62м. Обит чёрной кожей, спинка и сиденье разделены на сегменты, широкие подлокотники с верхней поверхностью из тёмного дерева. Строгий, прямые линии. Подходит для гостиной или офиса',
    category: 'living',
    size: [1.69, 0.62, 0.9],
    color: '#1a1a1a',
    modelPath: '/models/furniture/sofa_vivente_leather.glb',
    icon: '/icons/furniture/sofa_vivente_leather.jpg',
  },
  {
    id: 'sofa-1',
    title: 'Диван (вар. 1)',
    description: 'Компактный двухместный диван для гостиной, можно ставить у стены или в центре комнаты лицом к телевизору',
    category: 'living',
    size: [2.0, 0.85, 0.9],
    color: '#4a3f6b',
    modelPath: '/models/furniture/sofa_1.glb',
    icon: null,
  },
  {
    id: 'tv-set',
    title: 'ТВ-тумба',
    description: 'Современная ТВ-тумба 1.6×0.42×0.4м. Корпус из светлого дерева, дверцы с реечными вставками. В комплекте телевизор, акустика, декор. Низкая вытянутая конструкция. Стиль — современный, скандинавский. Ставится у стены напротив дивана',
    category: 'living',
    size: [1.6, 0.42, 0.4],
    color: '#c8b888',
    modelPath: '/models/furniture/tv_set.glb',
    icon: '/icons/furniture/tv_set.jpg',
  },
  {
    id: 'livingroom-cabinet',
    title: 'Тумба гостиная',
    description: 'Низкая тумба под телевизор, ставится у стены напротив дивана или зоны отдыха',
    category: 'living',
    size: [1.5, 0.6, 0.4],
    color: '#5a4a3a',
    modelPath: '/models/furniture/livingroom_cabinet.glb',
    icon: '/icons/furniture/livingroom_cabinet.jpg',
  },
  {
    id: 'carpet-beige',
    title: 'Ковёр бежевый',
    description: 'Большой прямоугольный ковёр 2.39×1.89м. Светлый бежевый цвет, тонкая линейная текстура. Стиль — минимализм, скандинавский. Кладётся под диван и журнальный столик',
    category: 'living',
    size: [2.39, 0.025, 1.89],
    color: '#e8dcc8',
    modelPath: '/models/furniture/carpet_beige.glb',
    icon: '/icons/furniture/carpet_beige.jpg',
  },
  {
    id: 'carpet-designer',
    title: 'Ковёр серый',
    description: 'Большой прямоугольный ковёр 2.99×2.0м. Тёмно-серый с мраморной пятнистой текстурой. Стиль — современный, лофт. Подходит для гостиных и кабинетов',
    category: 'living',
    size: [2.99, 0.037, 2.0],
    color: '#606060',
    modelPath: '/models/furniture/carpet_designer.glb',
    icon: '/icons/furniture/carpet_designer.jpg',
  },
  {
    id: 'carpet-designer2',
    title: 'Ковёр с узором',
    description: 'Современный прямоугольный ковёр 2.0×1.4м. Ворсовый с геометрическим абстрактным узором в оттенках чёрного, серого и красного. Стиль — модерн, урбан, лофт',
    category: 'living',
    size: [2.0, 0.01, 1.4],
    color: '#3a3a3a',
    modelPath: '/models/furniture/carpet_designer2.glb',
    icon: '/icons/furniture/carpet_designer2.jpg',
  },
  {
    id: 'puff',
    title: 'Пуф',
    description: 'Мягкий пуф для сидения или подставки под ноги, компактный, подходит для любой зоны',
    category: 'living',
    size: [0.6, 0.4, 0.6],
    color: '#7a6a5a',
    modelPath: '/models/furniture/puff.glb',
    icon: '/icons/furniture/puff.png',
  },
  {
    id: 'chair-1',
    title: 'Стул',
    description: 'Лёгкий стул для гостиной или рабочей зоны',
    category: 'living',
    size: [0.5, 0.9, 0.5],
    color: '#4a3a2a',
    modelPath: '/models/furniture/chair_1.glb',
    icon: null,
  },
  {
    id: 'curtains',
    title: 'Шторы',
    description: 'Плотные шторы для окна, вешаются вплотную к оконному проёму, не блокируют проход',
    category: 'living',
    size: [2.0, 2.5, 0.1],
    color: '#8a7a6a',
    modelPath: '/models/furniture/curtains.glb',
    icon: '/icons/furniture/curtains.jpg',
  },

  // ══════════════════════════════════════════════════════════════
  // КУХНЯ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'kitchen-set',
    title: 'Кухонный гарнитур',
    description: 'Полный кухонный гарнитур с верхними и нижними шкафами, мойкой и плитой — ставится вдоль стены кухни',
    category: 'kitchen',
    size: [3.0, 0.9, 0.6],
    color: '#c0c0c0',
    modelPath: '/models/furniture/kitchen_set.glb',
    icon: '/icons/furniture/kitchen_set.jpg',
  },
  {
    id: 'kitchen-set2',
    title: 'Гарнитур Olive',
    description: 'Современный модульный кухонный гарнитур 4.0×0.56×2.9м. Нижние шкафы — матовые оливковые, верхние — светлое дерево, без ручек. Чёрная мойка, стеклокерамика, два встроенных духовых шкафа. Стиль — современный минимализм. Ставится вдоль стены кухни',
    category: 'kitchen',
    size: [4.0, 2.9, 0.56],
    color: '#6b7a5a',
    modelPath: '/models/furniture/kitchen_set2.glb',
    icon: '/icons/furniture/kitchen_set2.jpg',
  },
  {
    id: 'kitchen-set3',
    title: 'Гарнитур Wood',
    description: 'Модульный кухонный гарнитур высотой 2.81м. Фасады нижних шкафов — тёмно-коричневые и светлое дерево, металлические ручки, светлая столешница. Чёрная мойка, навесные шкафы в тон. Стиль — современный, минимализм. Ставится вдоль стены кухни',
    category: 'kitchen',
    size: [3.0, 2.81, 0.6],
    color: '#5a3a2a',
    modelPath: '/models/furniture/kitchen_set3.glb',
    icon: '/icons/furniture/kitchen_set3.jpg',
  },
  {
    id: 'fridge',
    title: 'Холодильник',
    description: 'Двухдверный холодильник 0.55×0.61×1.66м. Матовая чёрная поверхность, верхняя дверь — морозильник, нижняя — холодильник с дозатором воды. Стиль — современный минимализм, лофт. Ставится рядом с кухонным гарнитуром',
    category: 'kitchen',
    size: [0.55, 1.66, 0.61],
    color: '#1a1a1a',
    modelPath: '/models/furniture/fridge.glb',
    icon: '/icons/furniture/fridge.jpg',
  },
  {
    id: 'table-dinner',
    title: 'Обеденный комплект',
    description: 'Современный обеденный комплект: овальный стол 2.49×1.03м из тёмного дерева и 8 кресел с мягкой светлой обивкой и тонкими чёрными ножками. Ставится в центре кухни или столовой',
    category: 'kitchen',
    size: [2.49, 0.9, 1.03],
    color: '#3a2a1a',
    modelPath: '/models/furniture/table_dinner.glb',
    icon: '/icons/furniture/table_dinner.jpg',
  },
  {
    id: 'kitchen-table-wood',
    title: 'Стол обеденный',
    description: 'Деревянный обеденный стол на 4 человека, ставится в центре кухни или столовой',
    category: 'kitchen',
    size: [1.2, 0.75, 0.8],
    color: '#8a6a4a',
    modelPath: '/models/furniture/kitchen_table_wood.glb',
    icon: '/icons/furniture/kitchen-table-wood.jpg',
  },
  {
    id: 'kitchen-chair-wood',
    title: 'Стул кухонный',
    description: 'Деревянный стул для кухни, ставится вокруг обеденного стола',
    category: 'kitchen',
    size: [0.5, 0.9, 0.5],
    color: '#7a5a3a',
    modelPath: '/models/furniture/kitchen_chair_wood.glb',
    icon: '/icons/furniture/kitchen-chair-wood.jpg',
  },

  // ══════════════════════════════════════════════════════════════
  // ВАННАЯ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bath',
    title: 'Ванна',
    description: 'Акриловая прямоугольная ванна — устанавливается у стены санузла',
    category: 'bathroom',
    size: [1.7, 0.6, 0.7],
    color: '#e0e0e0',
    modelPath: '/models/furniture/bath.glb',
    icon: '/icons/furniture/bath.jpg',
  },
  {
    id: 'bathtub',
    title: 'Ванна прямоугольная',
    description: 'Современная отдельностоящая ванна 1.62×0.77×0.83м. Гладкий белый материал, чёткие геометрические линии, чёрный металлический смеситель. Стиль — современный минимализм. Устанавливается в санузле',
    category: 'bathroom',
    size: [1.62, 0.83, 0.77],
    color: '#f0f0f0',
    modelPath: '/models/furniture/bathtub.glb',
    icon: '/icons/furniture/bathtub.jpg',
  },
  
  {
    id: 'shower',
    title: 'Душевая кабина',
    description: 'Современная душевая кабина 0.92×0.92×2.9м. Чёрный металлический каркас, полностью прозрачное стекло. Квадратная верхняя лейка, ручной душ, матово-чёрный смеситель. Стиль — минимализм, лофт. Только в санузле',
    category: 'bathroom',
    size: [0.92, 2.9, 0.92],
    color: '#2a2a2a',
    modelPath: '/models/furniture/shower.glb',
    icon: '/icons/furniture/shower.jpg',
  },
  {
    id: 'toilet',
    title: 'Унитаз',
    description: 'Напольный унитаз — устанавливается у стены санузла',
    category: 'bathroom',
    size: [0.6, 0.8, 0.4],
    color: '#e8e8e8',
    modelPath: '/models/furniture/toilet.glb',
    icon: '/icons/furniture/toilet.jpg',
  },
  {
    id: 'toilet2',
    title: 'Унитаз (вар. 2)',
    description: 'Напольный унитаз компактной прямоугольной формы 0.38×0.65×0.82м. Белая керамика, интегрированный бачок. Стиль — современный минимализм. Только в санузле',
    category: 'bathroom',
    size: [0.38, 0.82, 0.65],
    color: '#f0f0f0',
    modelPath: '/models/furniture/toilet2.glb',
    icon: '/icons/furniture/toilet2.jpg',
  },
  {
    id: 'toilet3',
    title: 'Унитаз (вар. 3)',
    description: 'Современный напольный унитаз 0.4×0.71×0.79м. Плавная закруглённая форма, глянцевая белая керамика, овальное сиденье. Стиль — современный минимализм. Только в санузле',
    category: 'bathroom',
    size: [0.4, 0.79, 0.71],
    color: '#f8f8f8',
    modelPath: '/models/furniture/toilet3.glb',
    icon: '/icons/furniture/toilet3.jpg',
  },
  {
    id: 'bath-kit',
    title: 'Раковина с тумбой',
    description: 'Раковина с зеркалом и тумбой для хранения — устанавливается у стены санузла',
    category: 'bathroom',
    size: [0.8, 0.85, 0.5],
    color: '#e0e0e0',
    modelPath: '/models/furniture/bath_kit.glb',
    icon: '/icons/furniture/bath_kit.jpg',
  },
  {
    id: 'bath-kit2',
    title: 'Тумба с раковиной',
    description: 'Современный комплект для ванной 1.38×0.52×1.9м. Настенное зеркало, белая керамическая раковина, два ящика из тёмного дерева с металлическими ручками, настенные светильники. Стиль — современный минимализм, скандинавский. Только в санузле',
    category: 'bathroom',
    size: [1.38, 1.9, 0.52],
    color: '#d0c0a0',
    modelPath: '/models/furniture/bath_kit2.glb',
    icon: '/icons/furniture/bath_kit2.jpg',
  },
  {
    id: 'bath-kit3',
    title: 'Тумба компактная',
    description: 'Современная компактная тумба для ванной 0.8×0.47×0.82м. Корпус из натурального дерева с вертикальным рифлением, накладная квадратная раковина из белой керамики, чёрный смеситель. Стиль — минимализм, эко. Только в санузле',
    category: 'bathroom',
    size: [0.8, 0.82, 0.47],
    color: '#c8a878',
    modelPath: '/models/furniture/bath_kit3.glb',
    icon: '/icons/furniture/bath_kit3.jpg',
  },
  {
    id: 'bath-kit4',
    title: 'Тумба двойная',
    description: 'Современная тумба для ванной с двумя раковинами 1.82×0.5×1.12м. Корпус из светлого дерева, две прямоугольные раковины, чёрные смесители, аксессуары. Стиль — современный минимализм. Только в санузле',
    category: 'bathroom',
    size: [1.82, 1.12, 0.5],
    color: '#d4c4a0',
    modelPath: '/models/furniture/bath_kit4.glb',
    icon: '/icons/furniture/bath_kit4.jpg',
  },
  {
    id: 'toilet-brush',
    title: 'Ёршик',
    description: 'Напольный ёршик — ставится рядом с унитазом в санузле',
    category: 'bathroom',
    size: [0.15, 0.4, 0.15],
    color: '#c0c0c0',
    modelPath: '/models/furniture/toilet_brush.glb',
    icon: null,
  },
  {
    id: 'trash-can',
    title: 'Мусорная корзина',
    description: 'Небольшая мусорная корзина для ванной комнаты или кухни',
    category: 'bathroom',
    size: [0.3, 0.4, 0.3],
    color: '#808080',
    modelPath: '/models/furniture/trash_can.glb',
    icon: '/icons/furniture/trash.jpg',
  },
]

// ── ID сантехники — только в санузле ────────────────────────────
export const SANITARY_IDS = new Set([
  'bath', 'bathtub', 'bathtub2', 'shower',
  'toilet', 'toilet2', 'toilet3',
  'bath-kit', 'bath-kit2', 'bath-kit3', 'bath-kit4',
  'toilet-brush', 'trash-can',
])

let nextId = 1

function loadItems(apartmentId) {
  if (!apartmentId) return null
  try {
    const saved = localStorage.getItem(`furniture_${apartmentId}`)
    if (saved) {
      const items = JSON.parse(saved)
      nextId = items.length > 0 ? items.reduce((max, i) => Math.max(max, i.id), 0) + 1 : 1
      return items
    }
  } catch (e) {}
  return null
}

function saveItems(apartmentId, items) {
  if (!apartmentId) return
  try { localStorage.setItem(`furniture_${apartmentId}`, JSON.stringify(items)) } catch (e) {}
}

export const useEditorStore = create((set, get) => ({
  items: [],
  selectedId: null,
  currentApartmentId: null,

  wallColor:            '#F5F0EA',
  ceilingColor:         '#FFFFFF',
  floorColor:           null,
  bathroomWallColor:    '#E8E8E8',
  bathroomFloorColor:   '#D0C8C0',

  loadApartment: (apartment) => {
    const saved = loadItems(apartment.id)
    if (saved !== null) {
      nextId = saved.length > 0 ? saved.reduce((max, i) => Math.max(max, i.id), 0) + 1 : 1
      set({ items: saved, selectedId: null, currentApartmentId: apartment.id })
      return
    }
    nextId = 1
    set({ items: [], selectedId: null, currentApartmentId: apartment.id })
  },

  addItem: (catalogItem) => {
    const id = nextId++
    const { currentApartmentId } = get()
    const position = catalogItem._aiPosition ?? [0, 0, 0]
    const rotation = catalogItem._aiRotation  ?? 0
    const newItem = {
      id,
      catalogId:  catalogItem.id,
      title:      catalogItem.title,
      size:       catalogItem.size,
      color:      catalogItem.color,
      position,
      rotation,
      modelPath:  catalogItem.modelPath || null,
      icon:       catalogItem.icon || null,
    }
    set(state => {
      const newItems = [...state.items, newItem]
      saveItems(currentApartmentId, newItems)
      return { items: newItems, selectedId: id }
    })
  },

  // НЕ сохраняет в localStorage — только в памяти (нет бесконечного цикла)
  moveItem: (id, position) => {
    set(state => ({
      items: state.items.map(item => item.id === id ? { ...item, position } : item)
    }))
  },

  // Вызывается после отпускания мыши
  saveCurrentItems: () => {
    const { currentApartmentId, items } = get()
    saveItems(currentApartmentId, items)
  },

  rotateItem: (id) => {
    const { currentApartmentId } = get()
    set(state => {
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, rotation: (item.rotation || 0) + Math.PI / 2 } : item
      )
      saveItems(currentApartmentId, newItems)
      return { items: newItems }
    })
  },

  selectItem:  (id) => set({ selectedId: id }),
  deselect:    ()   => set({ selectedId: null }),

  deleteItem: (id) => {
    const { currentApartmentId } = get()
    set(state => {
      const newItems = state.items.filter(item => item.id !== id)
      saveItems(currentApartmentId, newItems)
      return { items: newItems, selectedId: state.selectedId === id ? null : state.selectedId }
    })
  },

  clearItems: () => {
    const { currentApartmentId } = get()
    saveItems(currentApartmentId, [])
    set({ items: [], selectedId: null })
  },

  setWallColor:          (c) => set({ wallColor: c }),
  setCeilingColor:       (c) => set({ ceilingColor: c }),
  setFloorColor:         (c) => set({ floorColor: c }),
  setBathroomWallColor:  (c) => set({ bathroomWallColor: c }),
  setBathroomFloorColor: (c) => set({ bathroomFloorColor: c }),
}))