import { create } from 'zustand'

export const FURNITURE_CATALOG = [
  // ГОСТИНАЯ
  {
    id: 'sofa',
    title: 'Диван',
    category: 'living',
    size: [2.0, 0.85, 0.9],
    color: '#4a3f6b',
    modelPath: '/models/furniture/sofa_1.glb',
  },
  {
    id: 'coffee-table',
    title: 'Журнальный стол',
    category: 'living',
    size: [1.1, 0.45, 0.6],
    color: '#5a4a2a',
    modelPath: null,
  },
  {
    id: 'chair',
    title: 'Стул',
    category: 'living',
    size: [0.5, 0.9, 0.5],
    color: '#4a3a2a',
    modelPath: '/models/furniture/chair_1.glb',
  },

  // СПАЛЬНЯ
  {
    id: 'bed-1',
    title: 'Кровать (вар. 1)',
    category: 'bedroom',
    size: [1.6, 0.5, 2.0],
    color: '#3a5a6b',
    modelPath: '/models/furniture/bed_1.glb',
  },
  {
    id: 'bed-2',
    title: 'Кровать (вар. 2)',
    category: 'bedroom',
    size: [1.6, 0.5, 2.0],
    color: '#2a4a5a',
    modelPath: '/models/furniture/bed_2.glb',
  },
  {
    id: 'wardrobe-1',
    title: 'Шкаф (вар. 1)',
    category: 'bedroom',
    size: [1.8, 2.2, 0.6],
    color: '#3a3a4a',
    modelPath: '/models/furniture/wardrobe_1.glb',
  },
  {
    id: 'wardrobe-2',
    title: 'Шкаф (вар. 2)',
    category: 'bedroom',
    size: [2.0, 2.2, 0.6],
    color: '#2a2a3a',
    modelPath: '/models/furniture/wardrobe_2.glb',
  },

  // КУХНЯ
  {
    id: 'dining-table',
    title: 'Обеденный стол',
    category: 'kitchen',
    size: [1.2, 0.75, 0.8],
    color: '#5a4a2a',
    modelPath: null,
  },
  {
    id: 'fridge',
    title: 'Холодильник',
    category: 'kitchen',
    size: [0.6, 1.8, 0.65],
    color: '#e0e0e0',
    modelPath: null,
  },
  {
    id: 'stove',
    title: 'Плита',
    category: 'kitchen',
    size: [0.6, 0.85, 0.6],
    color: '#c0c0c0',
    modelPath: null,
  },
]

let nextId = 1

export const useEditorStore = create((set, get) => ({
  items: [],
  selectedId: null,

  addItem: (catalogItem) => {
    const id = nextId++
    set(state => ({
      items: [
        ...state.items,
        {
          id,
          catalogId: catalogItem.id,
          title: catalogItem.title,
          size: catalogItem.size,
          color: catalogItem.color,
          position: [4, 0, 2.5],
          rotation: 0,
          modelPath: catalogItem.modelPath || null,
        }
      ],
      selectedId: id,
    }))
  },

  moveItem: (id, position) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, position } : item
      )
    }))
  },

  rotateItem: (id) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === id
          ? { ...item, rotation: item.rotation + Math.PI / 2 }
          : item
      )
    }))
  },

  selectItem: (id) => set({ selectedId: id }),
  deselect: () => set({ selectedId: null }),

  deleteItem: (id) => {
    set(state => ({
      items: state.items.filter(item => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }))
  },

  clearItems: () => set({ items: [], selectedId: null }),
}))
