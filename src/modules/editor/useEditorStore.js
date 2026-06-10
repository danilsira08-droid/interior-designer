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
    description: 'Современная кровать king-size 2.09×2.54м. Изголовье и основание обиты светло-бежевой тканью. Стиль — современный минимализм',
    category: 'bedroom',
    size: [2.09, 0.8, 2.54],
    color: '#c8b8a0',
    modelPath: '/models/furniture/bed_floss.glb',
    icon: '/icons/furniture/bed_floss.jpg',
  },
  {
    id: 'modern-double-bed',
    title: 'Двуспальная кровать',
    description: 'Современная двуспальная кровать 2.03×2.21м с высоким мягким изголовьем',
    category: 'bedroom',
    size: [2.03, 1.22, 2.21],
    color: '#8a7a6a',
    modelPath: '/models/furniture/modern_double_bed.glb',
    icon: '/icons/furniture/modern_double_bed.jpg',
  },
  {
    id: 'bed-1',
    title: 'Компактная кровать',
    description: 'Односпальная кровать компактного размера, подходит для небольших спален',
    category: 'bedroom',
    size: [1.6, 0.5, 2.0],
    color: '#3a5a6b',
    modelPath: '/models/furniture/bed_1.glb',
    icon: '/icons/furniture/bed-1.jpg',
  },
  {
    id: 'bed-2',
    title: 'Двуспальная кровать',
    description: 'Двуспальная кровать среднего размера в современном стиле',
    category: 'bedroom',
    size: [1.6, 0.5, 2.0],
    color: '#2a4a5a',
    modelPath: '/models/furniture/bed_2.glb',
    icon: '/icons/furniture/bed-2.jpg',
  },
  {
    id: 'bedside-table-lamp',
    title: 'Тумбочка с лампой',
    description: 'Прикроватная тумбочка с настольной лампой и книгами 0.5×0.39×0.56м',
    category: 'bedroom',
    size: [0.5, 0.56, 0.39],
    color: '#c8b888',
    modelPath: '/models/furniture/bedside_table_lamp_books.glb',
    icon: '/icons/furniture/bedside_table_lamp_books.jpg',
  },
  {
    id: 'modern-wardrobe-system',
    title: 'Гардеробная система',
    description: 'Большая современная гардеробная система 3.33×0.62×2.24м',
    category: 'bedroom',
    size: [3.33, 2.24, 0.618],
    color: '#d4c4a0',
    modelPath: '/models/furniture/modern_wardrobe_system.glb',
    icon: '/icons/furniture/modern_wardrobe_system.jpg',
  },
  {
    id: 'modern-four-door-wardrobe',
    title: 'Шкаф четырёхдверный',
    description: 'Современный четырёхдверный шкаф 2.4×0.66×2.2м. Матовые фасады, минималистичный дизайн',
    category: 'bedroom',
    size: [2.4, 2.2, 0.66],
    color: '#e8e4dc',
    modelPath: '/models/furniture/modern_four_door_wardrobe.glb',
    icon: '/icons/furniture/modern_four_door_wardrobe.jpg',
  },
  {
    id: 'wardrobe-nordic',
    title: 'Шкаф Nordic',
    description: 'Большой современный шкаф-гардероб 2.4×0.49×2.2м. Стиль — минимализм, скандинавский',
    category: 'bedroom',
    size: [2.4, 2.2, 0.49],
    color: '#d4c4a0',
    modelPath: '/models/furniture/wardrobe_nordic.glb',
    icon: '/icons/furniture/wardrobe_nordic.jpg',
  },
  {
    id: 'wardrobe-classic',
    title: 'Шкаф Classic',
    description: 'Открытый шкаф-гардероб 2.0×0.6×2.06м из светлого дерева. Без дверей, скандинавский стиль',
    category: 'bedroom',
    size: [2.0, 2.06, 0.6],
    color: '#c8b888',
    modelPath: '/models/furniture/wardrobe_classic.glb',
    icon: '/icons/furniture/wardrobe_classic.jpg',
  },
  {
    id: 'wardrobe-1',
    title: 'Шкаф большой',
    description: 'Вместительный распашной шкаф для одежды, ставится вдоль стены',
    category: 'bedroom',
    size: [1.8, 2.2, 0.6],
    color: '#3a3a4a',
    modelPath: '/models/furniture/wardrobe_1.glb',
    icon: '/icons/furniture/wardrobe_large.jpg',
  },
  {
    id: 'wardrobe-2',
    title: 'Шкаф-купе',
    description: 'Широкий шкаф-купе для хранения одежды и вещей',
    category: 'bedroom',
    size: [2.0, 2.2, 0.6],
    color: '#2a2a3a',
    modelPath: '/models/furniture/wardrobe_2.glb',
    icon: '/icons/furniture/wardrobe_large2.jpg',
  },
  {
    id: 'mirror',
    title: 'Зеркало напольное',
    description: 'Высокое напольное зеркало с арочной верхней частью 0.17×0.53×1.62м',
    category: 'bedroom',
    size: [0.17, 1.62, 0.53],
    color: '#d4af60',
    modelPath: '/models/furniture/mirror.glb',
    icon: '/icons/furniture/mirror.jpg',
  },
  {
    id: 'commod-bristol',
    title: 'Комод Bristol',
    description: 'Деревянный комод с ящиками в классическом стиле',
    category: 'bedroom',
    size: [1.0, 0.9, 0.5],
    color: '#6a5a4a',
    modelPath: '/models/furniture/commod_bristol.glb',
    icon: '/icons/furniture/commod_bristol.jpg',
  },
  {
    id: 'wall-shelf',
    title: 'Полка настенная',
    description: 'Навесная настенная полка для книг и декора',
    category: 'bedroom',
    size: [1.0, 0.2, 0.3],
    color: '#8a6a4a',
    modelPath: '/models/furniture/wall_shelf.glb',
    icon: '/icons/furniture/wall_shelf.jpg',
  },
  {
    id: 'shelf',
    title: 'Панель с крючками',
    description: 'Открытый стеллаж для книг и декора, ставится вертикально у стены',
    category: 'bedroom',
    size: [0.8, 1.8, 0.3],
    color: '#7a6a5a',
    modelPath: '/models/furniture/shelf.glb',
    icon: '/icons/furniture/hook_panel.jpg',
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
  {
    id: 'oak-desk',
    title: 'Стол дубовый',
    description: 'Рабочий стол из дуба 1.2×0.6×0.77м. Натуральное дерево',
    category: 'bedroom',
    size: [1.2, 0.77, 0.6],
    color: '#a07848',
    modelPath: '/models/furniture/oak_desk.glb',
    icon: '/icons/furniture/oak_desk.jpg',
  },
  {
    id: 'white-minimal-desk',
    title: 'Стол минималистичный',
    description: 'Белый минималистичный письменный стол 1.2×0.5м',
    category: 'bedroom',
    size: [1.2, 0.143, 0.5],
    color: '#f0f0f0',
    modelPath: '/models/furniture/white_minimal_desk.glb',
    icon: '/icons/furniture/white_minimal_desk.jpg',
  },
  {
    id: 'classic-office-desk',
    title: 'Стол офисный классик',
    description: 'Классический офисный стол 1.48×0.65×0.77м. Тёмное дерево',
    category: 'bedroom',
    size: [1.48, 0.771, 0.65],
    color: '#3a2a1a',
    modelPath: '/models/furniture/classic_office_desk.glb',
    icon: '/icons/furniture/classic_office_desk.jpg',
  },
  {
    id: 'mid-century-desk-chair',
    title: 'Стол mid-century со стулом',
    description: 'Стол в стиле mid-century с подходящим стулом 1.84×0.62×0.93м',
    category: 'bedroom',
    size: [1.84, 0.925, 0.618],
    color: '#8a6040',
    modelPath: '/models/furniture/mid_century_desk_with_chair.glb',
    icon: '/icons/furniture/mid_century_desk_with_chair.jpg',
  },
  {
    id: 'white-office-chair',
    title: 'Кресло офисное белое',
    description: 'Современное офисное кресло 0.71×0.69×1.26м. Белая обивка',
    category: 'bedroom',
    size: [0.705, 1.26, 0.691],
    color: '#f0f0f0',
    modelPath: '/models/furniture/white_office_chair.glb',
    icon: '/icons/furniture/white_office_chair.jpg',
  },
  {
    id: 'green-fabric-office-chair',
    title: 'Кресло офисное зелёное',
    description: 'Современное офисное кресло 0.71×0.69×1.26м. Зелёная тканевая обивка',
    category: 'bedroom',
    size: [0.705, 1.26, 0.691],
    color: '#4a7050',
    modelPath: '/models/furniture/green_fabric_office_chair.glb',
    icon: '/icons/furniture/green_fabric_office_chair.jpg',
  },
  {
    id: 'beige-leather-office-chair',
    title: 'Кресло офисное бежевое',
    description: 'Современное офисное кресло 0.71×0.69×1.26м. Бежевая кожаная обивка',
    category: 'bedroom',
    size: [0.705, 1.26, 0.691],
    color: '#c8b090',
    modelPath: '/models/furniture/beige_leather_office_chair.glb',
    icon: '/icons/furniture/beige_leather_office_chair.jpg',
  },

  // ══════════════════════════════════════════════════════════════
  // ГОСТИНАЯ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sofa-leather',
    title: 'Диван кожаный',
    description: 'Современный мягкий диван 2.38×1.05×0.81м. Обит чёрной матовой кожей. Стиль — лофт, минимализм',
    category: 'living',
    size: [2.38, 1.05, 0.81],
    color: '#1a1a1a',
    modelPath: '/models/furniture/leather_sofa.glb',
    icon: '/icons/furniture/leather_sofa.jpg',
  },
  {
    id: 'sofa-polly',
    title: 'Диван Polly',
    description: 'Дизайнерский диван 2.31×1.01×0.72м. Белая ткань, скруглённые формы',
    category: 'living',
    size: [2.31, 1.01, 0.72],
    color: '#f0ece8',
    modelPath: '/models/furniture/sofa_polly.glb',
    icon: '/icons/furniture/sofa_polly.jpg',
  },
  {
    id: 'sofa-grey-fabric',
    title: 'Диван серый',
    description: 'Трёхместный диван 2.9×1.07×0.74м. Бежевая ткань. Стиль — скандинавский',
    category: 'living',
    size: [2.9, 1.07, 0.74],
    color: '#b8b0a0',
    modelPath: '/models/furniture/sofa_grey_fabric.glb',
    icon: '/icons/furniture/sofa_grey_fabric.jpg',
  },
  {
    id: 'sofa-kelly',
    title: 'Диван Kelly',
    description: 'Двухместный диван 1.85×0.81×0.61м. Тёмно-синяя матовая кожа',
    category: 'living',
    size: [1.85, 0.61, 0.81],
    color: '#1a2a4a',
    modelPath: '/models/furniture/sofa_kelly.glb',
    icon: '/icons/furniture/sofa_kelly.jpg',
  },
  {
    id: 'sofa-vivente',
    title: 'Диван Vivente',
    description: 'Диван 1.69×0.9×0.62м. Чёрная кожа, подлокотники из тёмного дерева',
    category: 'living',
    size: [1.69, 0.62, 0.9],
    color: '#1a1a1a',
    modelPath: '/models/furniture/sofa_vivente_leather.glb',
    icon: '/icons/furniture/sofa_vivente_leather.jpg',
  },
  {
    id: 'sofa-1',
    title: 'Диван трёхместный',
    description: 'Компактный трёхместный диван для гостиной',
    category: 'living',
    size: [2.0, 0.85, 0.9],
    color: '#4a3f6b',
    modelPath: '/models/furniture/sofa_1.glb',
    icon: '/icons/furniture/sofa_1.jpg',
  },
  {
    id: 'modern-corner-sofa',
    title: 'Угловой диван',
    description: 'Современный угловой диван 3.04×1.58×0.88м для большой гостиной',
    category: 'living',
    size: [3.04, 0.883, 1.58],
    color: '#d0c8b8',
    modelPath: '/models/furniture/modern_corner_sofa.glb',
    icon: '/icons/furniture/modern_corner_sofa.jpg',
  },
  {
    id: 'wooden-fabric-armchair',
    title: 'Кресло деревянное',
    description: 'Кресло с деревянным каркасом и тканевой обивкой 0.53×0.48×0.67м',
    category: 'living',
    size: [0.532, 0.671, 0.476],
    color: '#c8a878',
    modelPath: '/models/furniture/wooden_fabric_armchair.glb',
    icon: '/icons/furniture/wooden_fabric_armchair.jpg',
  },
  {
    id: 'folding-butterfly-chair',
    title: 'Кресло Butterfly',
    description: 'Складное кресло-бабочка 0.63×0.47×0.65м. Стиль — лофт, бохо',
    category: 'living',
    size: [0.633, 0.648, 0.471],
    color: '#8a6a4a',
    modelPath: '/models/furniture/folding_butterfly_chair.glb',
    icon: '/icons/furniture/folding_butterfly_chair.jpg',
  },
  {
    id: 'green-fabric-modern-chair',
    title: 'Кресло зелёное',
    description: 'Современное компактное кресло 0.48×0.58×0.43м. Зелёная ткань',
    category: 'living',
    size: [0.476, 0.431, 0.576],
    color: '#4a7050',
    modelPath: '/models/furniture/green_fabric_modern_chair.glb',
    icon: '/icons/furniture/green_fabric_modern_chair.jpg',
  },
  {
    id: 'tv-set',
    title: 'ТВ-тумба',
    description: 'Современная ТВ-тумба 1.6×0.42×0.4м из светлого дерева',
    category: 'living',
    size: [1.6, 0.42, 0.4],
    color: '#c8b888',
    modelPath: '/models/furniture/tv_set.glb',
    icon: '/icons/furniture/tv_set.jpg',
  },
  {
    id: 'oak-tv-stand',
    title: 'ТВ-тумба дубовая',
    description: 'Тумба под телевизор из дуба 1.65×0.47×0.58м',
    category: 'living',
    size: [1.65, 0.58, 0.47],
    color: '#a07848',
    modelPath: '/models/furniture/oak_tv_stand.glb',
    icon: '/icons/furniture/oak_tv_stand.jpg',
  },
  {
    id: 'livingroom-cabinet',
    title: 'Высокий шкаф',
    description: 'Высокий шкаф для гостиной, ставится у стены',
    category: 'living',
    size: [0.5, 1.8, 0.3],
    color: '#5a4a3a',
    modelPath: '/models/furniture/livingroom_cabinet.glb',
    icon: '/icons/furniture/livingroom_cabinet.jpg',
  },
  {
    id: 'glass-coffee-table',
    title: 'Журнальный стол стеклянный',
    description: 'Журнальный стол со стеклянной столешницей 1.2×0.6×0.43м',
    category: 'living',
    size: [1.2, 0.43, 0.6],
    color: '#c0d0e0',
    modelPath: '/models/furniture/glass_coffee_table.glb',
    icon: '/icons/furniture/glass_coffee_table.jpg',
  },
  {
    id: 'curved-wood-coffee-table',
    title: 'Журнальный стол деревянный',
    description: 'Деревянный журнальный стол с изогнутыми ножками 0.9×0.55×0.44м',
    category: 'living',
    size: [0.9, 0.441, 0.55],
    color: '#c8a070',
    modelPath: '/models/furniture/curved_wood_coffee_table.glb',
    icon: '/icons/furniture/curved_wood_coffee_table.jpg',
  },
  {
    id: 'carpet-beige',
    title: 'Ковёр бежевый',
    description: 'Прямоугольный ковёр 2.39×1.89м. Светлый бежевый цвет',
    category: 'living',
    size: [2.39, 0.025, 1.89],
    color: '#e8dcc8',
    modelPath: '/models/furniture/carpet_beige.glb',
    icon: '/icons/furniture/carpet_beige.jpg',
  },
  {
    id: 'carpet-designer',
    title: 'Ковёр серый',
    description: 'Прямоугольный ковёр 2.99×2.0м. Тёмно-серый с мраморной текстурой',
    category: 'living',
    size: [2.99, 0.037, 2.0],
    color: '#606060',
    modelPath: '/models/furniture/carpet_designer.glb',
    icon: '/icons/furniture/carpet_designer.jpg',
  },
  {
    id: 'carpet-designer2',
    title: 'Ковёр с узором',
    description: 'Прямоугольный ковёр 2.0×1.4м с геометрическим узором',
    category: 'living',
    size: [2.0, 0.01, 1.4],
    color: '#3a3a3a',
    modelPath: '/models/furniture/carpet_designer2.glb',
    icon: '/icons/furniture/carpet_designer2.jpg',
  },
  {
    id: 'puff',
    title: 'Пуф',
    description: 'Мягкий пуф для сидения или подставки под ноги',
    category: 'living',
    size: [0.6, 0.4, 0.6],
    color: '#7a6a5a',
    modelPath: '/models/furniture/puff.glb',
    icon: '/icons/furniture/puff.png',
  },
  {
    id: 'curtains',
    title: 'Шторы',
    description: 'Плотные шторы для окна',
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
    description: 'Полный кухонный гарнитур с верхними и нижними шкафами, мойкой и плитой',
    category: 'kitchen',
    size: [3.0, 0.9, 0.6],
    color: '#c0c0c0',
    modelPath: '/models/furniture/kitchen_set.glb',
    icon: '/icons/furniture/kitchen_set.jpg',
  },
  {
    id: 'kitchen-set2',
    title: 'Гарнитур Olive',
    description: 'Модульный кухонный гарнитур 4.0×0.56×2.9м. Оливковые фасады',
    category: 'kitchen',
    size: [4.0, 2.9, 0.56],
    color: '#6b7a5a',
    modelPath: '/models/furniture/kitchen_set2.glb',
    icon: '/icons/furniture/kitchen_set2.jpg',
  },
  {
    id: 'kitchen-set3',
    title: 'Гарнитур Wood',
    description: 'Модульный кухонный гарнитур 3.0×0.6×2.81м. Тёмно-коричневые фасады',
    category: 'kitchen',
    size: [3.0, 2.81, 0.6],
    color: '#5a3a2a',
    modelPath: '/models/furniture/kitchen_set3.glb',
    icon: '/icons/furniture/kitchen_set3.jpg',
  },
  {
    id: 'modern-kitchen-set',
    title: 'Гарнитур Modern',
    description: 'Современный кухонный гарнитур 2.4×0.6×2.1м',
    category: 'kitchen',
    size: [2.4, 2.1, 0.6],
    color: '#e0e0e0',
    modelPath: '/models/furniture/modern_kitchen_set.glb',
    icon: '/icons/furniture/modern_kitchen_set.jpg',
  },
  {
    id: 'modern-wood-kitchen-set',
    title: 'Гарнитур Wood Modern',
    description: 'Современный кухонный гарнитур из дерева 2.4×0.6×2.15м',
    category: 'kitchen',
    size: [2.4, 2.15, 0.6],
    color: '#a07848',
    modelPath: '/models/furniture/modern_wood_kitchen_set.glb',
    icon: '/icons/furniture/modern_wood_kitchen_set.jpg',
  },
  {
    id: 'fridge',
    title: 'Холодильник',
    description: 'Двухдверный холодильник 0.55×0.61×1.66м. Матовая чёрная поверхность',
    category: 'kitchen',
    size: [0.55, 1.66, 0.61],
    color: '#1a1a1a',
    modelPath: '/models/furniture/fridge.glb',
    icon: '/icons/furniture/fridge.jpg',
  },
  {
    id: 'table-dinner',
    title: 'Обеденный комплект',
    description: 'Обеденный комплект: овальный стол 2.49×1.03м и 8 кресел',
    category: 'kitchen',
    size: [2.49, 0.9, 1.03],
    color: '#3a2a1a',
    modelPath: '/models/furniture/table_dinner.glb',
    icon: '/icons/furniture/table_dinner.jpg',
  },
  {
    id: 'kitchen-table-wood',
    title: 'Стол обеденный',
    description: 'Деревянный обеденный стол на 4 человека',
    category: 'kitchen',
    size: [1.2, 0.75, 0.8],
    color: '#8a6a4a',
    modelPath: '/models/furniture/kitchen_table_wood.glb',
    icon: '/icons/furniture/kitchen-table-wood.jpg',
  },
  {
    id: 'modern-square-table',
    title: 'Стол квадратный',
    description: 'Современный квадратный стол 0.7×0.7×0.72м. Компактный',
    category: 'kitchen',
    size: [0.7, 0.72, 0.7],
    color: '#e0d8c8',
    modelPath: '/models/furniture/modern_square_table.glb',
    icon: '/icons/furniture/modern_square_table.jpg',
  },
  {
    id: 'oak-chair',
    title: 'Стул дубовый',
    description: 'Стул из дуба 0.51×0.50×0.79м',
    category: 'kitchen',
    size: [0.506, 0.786, 0.502],
    color: '#a07848',
    modelPath: '/models/furniture/oak_chair.glb',
    icon: '/icons/furniture/oak_chair.jpg',
  },
  {
    id: 'wooden-fabric-chair',
    title: 'Стул с обивкой',
    description: 'Стул с деревянным каркасом и тканевым сиденьем 0.52×0.53×0.77м',
    category: 'kitchen',
    size: [0.52, 0.768, 0.53],
    color: '#c8a878',
    modelPath: '/models/furniture/wooden_fabric_chair.glb',
    icon: '/icons/furniture/wooden_fabric_chair.jpg',
  },
  {
    id: 'modern-wooden-fabric-chair',
    title: 'Стул современный',
    description: 'Современный стул с деревянными ножками 0.54×0.63×0.71м',
    category: 'kitchen',
    size: [0.541, 0.712, 0.631],
    color: '#b09070',
    modelPath: '/models/furniture/modern_wooden_fabric_chair.glb',
    icon: '/icons/furniture/modern_wooden_fabric_chair.jpg',
  },
  {
    id: 'white-plastic-wooden-chair',
    title: 'Стул пластик/дерево',
    description: 'Стул с белым пластиковым сиденьем и деревянными ножками 0.47×0.50×0.79м',
    category: 'kitchen',
    size: [0.466, 0.785, 0.501],
    color: '#f0f0f0',
    modelPath: '/models/furniture/white_plastic_wooden_chair.glb',
    icon: '/icons/furniture/white_plastic_wooden_chair.jpg',
  },
  {
    id: 'kitchen-chair-wood',
    title: 'Стул кухонный',
    description: 'Деревянный стул для кухни',
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
    description: 'Акриловая прямоугольная ванна',
    category: 'bathroom',
    size: [1.7, 0.6, 0.7],
    color: '#e0e0e0',
    modelPath: '/models/furniture/bath.glb',
    icon: '/icons/furniture/bath.jpg',
  },
  {
    id: 'bathtub',
    title: 'Ванна прямоугольная',
    description: 'Отдельностоящая ванна 1.62×0.77×0.83м. Чёрный смеситель',
    category: 'bathroom',
    size: [1.62, 0.83, 0.77],
    color: '#f0f0f0',
    modelPath: '/models/furniture/bathtub.glb',
    icon: '/icons/furniture/bathtub.jpg',
  },
  {
    id: 'shower',
    title: 'Душевая кабина',
    description: 'Душевая кабина 0.92×0.92×2.9м. Чёрный каркас, прозрачное стекло',
    category: 'bathroom',
    size: [0.92, 2.9, 0.92],
    color: '#2a2a2a',
    modelPath: '/models/furniture/shower.glb',
    icon: '/icons/furniture/shower.jpg',
  },
  {
    id: 'toilet',
    title: 'Унитаз настенный',
    description: 'Напольный унитаз — устанавливается у стены санузла',
    category: 'bathroom',
    size: [0.6, 0.8, 0.4],
    color: '#e8e8e8',
    modelPath: '/models/furniture/toilet.glb',
    icon: '/icons/furniture/toilet.jpg',
  },
  {
    id: 'toilet2',
    title: 'Унитаз напольный',
    description: 'Напольный унитаз 0.38×0.65×0.82м. Белая керамика',
    category: 'bathroom',
    size: [0.38, 0.82, 0.65],
    color: '#f0f0f0',
    modelPath: '/models/furniture/toilet2.glb',
    icon: '/icons/furniture/toilet2.jpg',
  },
  {
    id: 'toilet3',
    title: 'Унитаз напольный',
    description: 'Современный напольный унитаз 0.4×0.71×0.79м. Плавная форма',
    category: 'bathroom',
    size: [0.4, 0.79, 0.71],
    color: '#f8f8f8',
    modelPath: '/models/furniture/toilet3.glb',
    icon: '/icons/furniture/toilet3.jpg',
  },
  {
    id: 'bath-kit',
    title: 'Раковина с тумбой',
    description: 'Раковина с зеркалом и тумбой для хранения',
    category: 'bathroom',
    size: [0.8, 0.85, 0.5],
    color: '#e0e0e0',
    modelPath: '/models/furniture/bath_kit.glb',
    icon: '/icons/furniture/bath_kit.jpg',
  },
  {
    id: 'bath-kit2',
    title: 'Тумба с раковиной',
    description: 'Комплект для ванной 1.38×0.52×1.9м. Зеркало, раковина, ящики из дерева',
    category: 'bathroom',
    size: [1.38, 1.9, 0.52],
    color: '#d0c0a0',
    modelPath: '/models/furniture/bath_kit2.glb',
    icon: '/icons/furniture/bath_kit2.jpg',
  },
  {
    id: 'bath-kit3',
    title: 'Тумба компактная',
    description: 'Компактная тумба для ванной 0.8×0.47×0.82м. Корпус из натурального дерева',
    category: 'bathroom',
    size: [0.8, 0.82, 0.47],
    color: '#c8a878',
    modelPath: '/models/furniture/bath_kit3.glb',
    icon: '/icons/furniture/bath_kit3.jpg',
  },
  {
    id: 'bath-kit4',
    title: 'Тумба двойная',
    description: 'Тумба для ванной с двумя раковинами 1.82×0.5×1.12м',
    category: 'bathroom',
    size: [1.82, 1.12, 0.5],
    color: '#d4c4a0',
    modelPath: '/models/furniture/bath_kit4.glb',
    icon: '/icons/furniture/bath_kit4.jpg',
  },
  {
    id: 'toilet-brush',
    title: 'Ёршик',
    description: 'Напольный ёршик — ставится рядом с унитазом',
    category: 'bathroom',
    size: [0.15, 0.4, 0.15],
    color: '#c0c0c0',
    modelPath: '/models/furniture/toilet_brush.glb',
    icon: '/icons/furniture/toilet_brush.jpg',
  },
  {
    id: 'trash-can',
    title: 'Мусорная корзина',
    description: 'Небольшая мусорная корзина для ванной или кухни',
    category: 'bathroom',
    size: [0.3, 0.4, 0.3],
    color: '#808080',
    modelPath: '/models/furniture/trash_can.glb',
    icon: '/icons/furniture/trash.jpg',
  },
]

export const SANITARY_IDS = new Set([
  'bath', 'bathtub', 'bathtub2', 'shower',
  'toilet', 'toilet2', 'toilet3',
  'bath-kit', 'bath-kit2', 'bath-kit3', 'bath-kit4',
  'toilet-brush', 'trash-can',
])

// ── Позиции спавна по категориям для конкретных квартир ──────────
// Мебель появляется в центре соответствующей комнаты
const CATEGORY_SPAWN = {
  'apt-1room': {
    // apt-1room: спальня X:0..4.4 Z:-3.6..-0.2 | гостиная X:0..4.5 Z:-0.2..3.9 | кухня X:-3.7..-1.0 Z:0..3.6
    bedroom:  [2.2,  0,  -1.9],
    living:   [2.2,  0,   1.8],
    kitchen:  [-2.3, 0,   1.8],
    bathroom: [-2.1, 0,  -0.3],
  },
  'apt-3room-3': {
    // кухня X:2.15..8 Z:0..3.3 | гостиная1 X:2.15..8 Z:-3.1..0.3 | спальня X:-6.4..-0.1 Z:0.25..3.3 | гостиная2 X:-6.4..-1.5 Z:-3.1..0.3
    bedroom:  [-3.2, 0,  1.8],
    living:   [-3.8, 0, -1.4],
    kitchen:  [ 5.0, 0,  1.6],
    bathroom: [ 0.0, 0, -1.9],
  },
}

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

function getSpawnPosition(category, apartmentId) {
  const aptSpawn = CATEGORY_SPAWN[apartmentId]
  if (!aptSpawn) return [0, 0, 0]
  return aptSpawn[category] || [0, 0, 0]
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

    // Если есть AI-позиция — используем её, иначе спавним в центр нужной комнаты
    const position = catalogItem._aiPosition
      ?? getSpawnPosition(catalogItem.category, currentApartmentId)

    const rotation = catalogItem._aiRotation ?? 0
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

  moveItem: (id, position) => {
    set(state => ({
      items: state.items.map(item => item.id === id ? { ...item, position } : item)
    }))
  },

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