function photos(id) {
  return {
    plan:        `/images/apartments/${id}-plan.jpg`,
    preview:     `/images/apartments/${id}-preview.jpg`,
    firstperson: `/images/apartments/${id}-fp.jpg`,
  }
}

export const apartments = [

  // ══════════════════════════════════════════════════════════════
  // СТУДИИ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'apt-studroom',
    title: 'Студия', subtitle: 'Вариант 1',
    rooms: 0, area: 28, ceilingHeight: 2.9,
    description: 'Компактная студия с рациональной планировкой. Французский балкон добавляет света и воздуха. Открытое пространство с чётким зонированием.',
    features: ['Французский балкон', 'Открытая планировка', 'Рациональное зонирование'],
    ...photos('apt-studroom'),
    modelPath: '/models/apartments/apt-studroom.glb',
    rooms_data: null, defaultFurniture: [],
  },
  {
    id: 'apt-studroom-2',
    title: 'Студия', subtitle: 'Вариант 2',
    rooms: 0, area: 31, ceilingHeight: 2.9,
    description: 'Просторная студия с удобной планировкой и большими окнами. Кухонная зона отделена барной стойкой.',
    features: ['Большие окна', 'Барная стойка', 'Высокие потолки'],
    ...photos('apt-studroom-2'),
    modelPath: '/models/apartments/apt-studroom2.glb',
    rooms_data: null, defaultFurniture: [],
  },
  {
    id: 'apt-studroom-3',
    title: 'Студия', subtitle: 'Вариант 3',
    rooms: 0, area: 25.77, ceilingHeight: 2.9,
    description: 'Студия с продуманной планировкой и двумя жилыми зонами. Отдельная кухня-ниша и удобный санузел.',
    features: ['Две жилые зоны', 'Отдельная кухня-ниша', 'Оптимальное зонирование'],
    ...photos('apt-studroom-3'),
    modelPath: '/models/apartments/apt-studroom3.glb',
    rooms_data: {
      studio:    { area: 10.9,  name: 'Студия' },
      hallway1:  { area: 3.9,   name: 'Прихожая 1' },
      hallway2:  { area: 2.78,  name: 'Прихожая 2' },
      kitchen:   { area: 3.9,   name: 'Кухня-ниша' },
      bathroom:  { area: 3.2,   name: 'Санузел' },
    },
    defaultFurniture: [],
  },

  // ══════════════════════════════════════════════════════════════
  // 1-КОМНАТНЫЕ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'apt-1room',
    title: '1-комнатная', subtitle: 'Вариант 1',
    rooms: 1, area: 46.12, ceilingHeight: 2.9,
    description: 'Просторная однокомнатная квартира с чётким зонированием кухни и гостиной. Отдельная спальня, удобная прихожая.',
    features: ['Отдельная спальня', 'Зонированная кухня-гостиная', 'Просторная прихожая'],
    ...photos('apt-1room'),
    modelPath: '/models/apartments/apt-1room.glb',
    rooms_data: {
      hallway:   { area: 3.54, name: 'Прихожая' },
      kitchen:   { area: 11.66, name: 'Кухня-ниша' },
      living:    { area: 14.11, name: 'Гостиная' },
      bedroom:   { area: 10.95, name: 'Спальня' },
      bathroom:  { area: 4.86,  name: 'Санузел' },
    },
    defaultFurniture: [],
  },
  {
    id: 'apt-1room-2',
    title: '1-комнатная', subtitle: 'Вариант 2',
    rooms: 1, area: 38, ceilingHeight: 2.9,
    description: 'Компактная однокомнатная квартира с продуманным зонированием. Раздельный санузел, просторная прихожая.',
    features: ['Раздельный санузел', 'Просторная прихожая', 'Удобное зонирование'],
    ...photos('apt-1room-2'),
    modelPath: '/models/apartments/apt-1room-2.glb',
    rooms_data: null, defaultFurniture: [],
  },
  {
    id: 'apt-1room-3',
    title: '1-комнатная', subtitle: 'Вариант 3',
    rooms: 1, area: 32.48, ceilingHeight: 2.9,
    description: 'Однокомнатная квартира с двумя изолированными жилыми зонами. Отдельная кухня-ниша и комфортный санузел.',
    features: ['Две жилые зоны', 'Отдельная кухня-ниша', 'Комфортная планировка'],
    ...photos('apt-1room-3'),
    modelPath: '/models/apartments/apt-1room3.glb',
    rooms_data: {
      hallway:  { area: 3.38,  name: 'Прихожая' },
      kitchen:  { area: 5.03,  name: 'Кухня-ниша' },
      living1:  { area: 10.01, name: 'Жилая комната 1' },
      living2:  { area: 10.27, name: 'Жилая комната 2' },
      bathroom: { area: 3.79,  name: 'Санузел' },
    },
    defaultFurniture: [],
  },

  // ══════════════════════════════════════════════════════════════
  // 2-КОМНАТНЫЕ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'apt-2room',
    title: '2-комнатная', subtitle: 'Вариант 1',
    rooms: 2, area: 67, ceilingHeight: 2.9,
    description: 'Просторная двухкомнатная квартира с изолированными комнатами. Большая кухня-гостиная, отдельная спальня.',
    features: ['Изолированные комнаты', 'Большая кухня', 'Два санузла'],
    ...photos('apt-2room'),
    modelPath: '/models/apartments/apt-2room.glb',
    rooms_data: null, defaultFurniture: [],
  },
  {
    id: 'apt-2room-2',
    title: '2-комнатная', subtitle: 'Вариант 2',
    rooms: 2, area: 72, ceilingHeight: 2.9,
    description: 'Двухкомнатная квартира с продуманной планировкой и удобным зонированием.',
    features: ['Просторная планировка', 'Удобное зонирование'],
    ...photos('apt-2room-2'),
    modelPath: '/models/apartments/apt-2room-2.glb',
    rooms_data: null, defaultFurniture: [],
  },
  {
    id: 'apt-2room-3',
    title: '2-комнатная', subtitle: 'Вариант 3',
    rooms: 2, area: 60.03, ceilingHeight: 2.9,
    description: 'Двухкомнатная квартира с просторной кухней и двумя изолированными жилыми комнатами. Постирочная и удобный санузел.',
    features: ['Две изолированные комнаты', 'Просторная кухня 14 м²', 'Постирочная', 'Санузел 4.36 м²'],
    ...photos('apt-2room-3'),
    modelPath: '/models/apartments/apt-2room3.glb',
    rooms_data: {
      hallway:   { area: 4.44,  name: 'Прихожая' },
      corridor:  { area: 4.51,  name: 'Коридор' },
      kitchen:   { area: 14.07, name: 'Кухня' },
      living1:   { area: 13.26, name: 'Жилая комната 1' },
      living2:   { area: 17.55, name: 'Жилая комната 2' },
      bathroom:  { area: 4.36,  name: 'Санузел' },
      laundry:   { area: 1.84,  name: 'Постирочная' },
    },
    defaultFurniture: [],
  },

  // ══════════════════════════════════════════════════════════════
  // 3-КОМНАТНЫЕ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'apt-3room',
    title: '3-комнатная', subtitle: 'Вариант 1',
    rooms: 3, area: 76, ceilingHeight: 2.9,
    description: 'Просторная трёхкомнатная квартира с двумя изолированными спальнями, кухней-гостиной и отдельной гостиной. Три санузла, гардероб, кладовая.',
    features: ['Две спальни', 'Три санузла', 'Гардероб', 'Кладовая 9.9 м²'],
    ...photos('apt-3room'),
    modelPath: '/models/apartments/apt-3room.glb',
    rooms_data: {
      kitchen:   { area: 12.5, name: 'Кухня-гостиная' },
      living:    { area: 13.5, name: 'Гостиная' },
      bedroom1:  { area: 13.6, name: 'Спальня 1' },
      bedroom2:  { area: 14.1, name: 'Спальня 2' },
      wardrobe:  { area: 2.9,  name: 'Гардероб' },
      corridor:  { area: 4.0,  name: 'Коридор' },
      bathroom1: { area: 2.1,  name: 'Санузел 1' },
      bathroom2: { area: 2.8,  name: 'Санузел 2' },
      bathroom3: { area: 2.4,  name: 'Санузел 3' },
      storage:   { area: 9.9,  name: 'Кладовая' },
    },
    defaultFurniture: [],
  },
  {
    id: 'apt-3room2',
    title: '3-комнатная', subtitle: 'Вариант 2',
    rooms: 3, area: 106, ceilingHeight: 2.9,
    description: 'Просторная трёхкомнатная квартира 106 м² с открытой кухней-гостиной, двумя изолированными спальнями, двумя санузлами и двумя гардеробными.',
    features: ['Открытая кухня-гостиная 23 м²', 'Две спальни', 'Два санузла', 'Две гардеробные'],
    ...photos('apt-3room-2'),
    modelPath: '/models/apartments/apt-3room2.glb',
    rooms_data: {
      living:    { area: 23.13, name: 'Кухня-гостиная' },
      bedroom1:  { area: 16.60, name: 'Спальня 1' },
      bedroom2:  { area: 15.34, name: 'Спальня 2' },
      bathroom1: { area: 3.30,  name: 'Санузел 1' },
      bathroom2: { area: 3.93,  name: 'Санузел 2' },
      wardrobe1: { area: 4.05,  name: 'Гардеробная 1' },
      wardrobe2: { area: 4.81,  name: 'Гардеробная 2' },
      kitchen:   { area: 3.02,  name: 'Кухонная зона' },
      hallway:   { area: 8.42,  name: 'Холл' },
      entrance:  { area: 7.25,  name: 'Прихожая' },
    },
    defaultFurniture: [],
  },
  {
    id: 'apt-3room-3',
    title: '3-комнатная', subtitle: 'Вариант 3',
    rooms: 3, area: 79.85, ceilingHeight: 2.9,
    description: 'Четырёхкомнатная квартира с четырьмя жилыми комнатами, просторной кухней-нишей и двумя санузлами.',
    features: ['Четыре жилые комнаты', 'Два санузла', 'Кухня-ниша 5.2 м²', 'Просторная прихожая'],
    ...photos('apt-3room-3'),
    modelPath: '/models/apartments/apt-3room3.glb',
    rooms_data: {
      living2:   { area: 17.4, name: 'Жилая комната 2' },
      living4:   { area: 17.2, name: 'Жилая комната 4' },
      living1:   { area: 14.2, name: 'Жилая комната 1' },
      living3:   { area: 11.1, name: 'Жилая комната 3' },
      kitchen:   { area: 5.2,  name: 'Кухня-ниша' },
      corridor:  { area: 4.9,  name: 'Коридор' },
      bathroom1: { area: 4.1,  name: 'Санузел 1' },
      hallway:   { area: 4.0,  name: 'Прихожая' },
      bathroom2: { area: 1.7,  name: 'Санузел 2' },
    },
    defaultFurniture: [],
  },

  // ══════════════════════════════════════════════════════════════
  // ПОЛЬЗОВАТЕЛЬСКАЯ
  // ══════════════════════════════════════════════════════════════
  {
    id: 'custom',
    title: 'Своя планировка', subtitle: '',
    rooms: null, area: 0, ceilingHeight: 2.9,
    description: 'Пользовательская планировка в формате GLB.',
    features: [],
    plan: null, preview: null, firstperson: null,
    modelPath: null,
    rooms_data: null, defaultFurniture: [],
  },
]