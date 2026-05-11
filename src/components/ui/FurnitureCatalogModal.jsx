import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FURNITURE_CATALOG } from '../../modules/editor/useEditorStore'

const CATEGORIES = [
  { id: 'all',      label: 'Всё' },
  { id: 'living',   label: 'Гостиная' },
  { id: 'bedroom',  label: 'Спальня' },
  { id: 'kitchen',  label: 'Кухня' },
  { id: 'bathroom', label: 'Ванная' },
]

function FurnitureCatalogModal({ isOpen, onClose, onAddItem, isDark }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [justAdded, setJustAdded] = useState(null)

  // Закрытие по Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const filtered = FURNITURE_CATALOG.filter(f => {
    const matchCat    = activeCategory === 'all' || f.category === activeCategory
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAdd = (furniture) => {
    setJustAdded(furniture.id)
    onAddItem(furniture)
    setTimeout(() => {
      setJustAdded(null)
      onClose()
    }, 400)
  }

  const accent      = isDark ? '#7c3aed' : '#f97316'
  const accentLight = isDark ? '#a855f7' : '#fbbf24'
  const modalBg     = isDark ? 'rgba(9,9,11,0.82)' : 'rgba(255,255,255,0.82)'
  const border      = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const cardBg      = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const cardHover   = isDark ? 'rgba(124,58,237,0.12)'  : 'rgba(249,115,22,0.08)'
  const cardBorder  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const txtMain     = isDark ? '#ffffff' : '#18181b'
  const txtSub      = isDark ? '#71717a' : '#a1a1aa'
  const inputBg     = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const tabActive   = { background: accent, color: '#fff' }
  const tabInactive = { background: 'transparent', color: txtSub, border: `1px solid ${border}` }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — лёгкое затемнение, квартира видна */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30"
            style={{ background: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)' }}
            onClick={onClose}
          />

          {/* Панель каталога */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-4 right-4 bottom-4 z-40 rounded-2xl overflow-hidden flex flex-col"
            style={{
              height: '72vh',
              background: modalBg,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${border}`,
              boxShadow: `0 -8px 60px ${accent}20, 0 0 0 1px ${border}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <div>
                <h2 className="font-bold text-lg" style={{ color: txtMain }}>Каталог мебели</h2>
                <p className="text-sm mt-0.5" style={{ color: txtSub }}>Нажми на предмет чтобы добавить в комнату</p>
              </div>

              {/* Поиск */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4" stroke={txtSub} strokeWidth="1.3"/>
                    <path d="M9.5 9.5l2.5 2.5" stroke={txtSub} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none w-44"
                    style={{ background: inputBg, border: `1px solid ${border}`, color: txtMain }}
                    autoFocus
                  />
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: inputBg, border: `1px solid ${border}` }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11 3L3 11M3 3l8 8" stroke={txtSub} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Категории */}
            <div className="flex items-center gap-2 px-6 py-3 shrink-0 overflow-x-auto"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                  style={activeCategory === cat.id ? tabActive : tabInactive}
                >
                  {cat.label}
                  <span className="ml-1.5 text-xs opacity-60">
                    {cat.id === 'all' ? FURNITURE_CATALOG.length : FURNITURE_CATALOG.filter(f => f.category === cat.id).length}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Сетка */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p style={{ color: txtSub }}>Ничего не найдено</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {filtered.map((furniture, i) => (
                    <motion.button
                      key={furniture.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.02 }}
                      onClick={() => handleAdd(furniture)}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex flex-col items-center rounded-2xl p-3 text-center transition-all relative overflow-hidden"
                      style={{
                        background: justAdded === furniture.id ? `${accent}20` : cardBg,
                        border: justAdded === furniture.id ? `1px solid ${accent}` : `1px solid ${cardBorder}`,
                        boxShadow: justAdded === furniture.id ? `0 0 20px ${accent}30` : 'none',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = cardHover
                        e.currentTarget.style.border = `1px solid ${accent}40`
                      }}
                      onMouseLeave={e => {
                        if (justAdded !== furniture.id) {
                          e.currentTarget.style.background = cardBg
                          e.currentTarget.style.border = `1px solid ${cardBorder}`
                        }
                      }}
                    >
                      {/* Чекмарк при добавлении */}
                      <AnimatePresence>
                        {justAdded === furniture.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl"
                            style={{ background: `${accent}20` }}
                          >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ background: accent }}>
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M4 9l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Иконка */}
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2.5 flex items-center justify-center"
                        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                      >
                        {furniture.icon ? (
                          <img src={furniture.icon} alt={furniture.title}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: furniture.color }} />
                        )}
                      </div>

                      {/* Название */}
                      <p className="text-xs font-medium leading-tight mb-1 line-clamp-2" style={{ color: txtMain }}>
                        {furniture.title}
                      </p>
                      <p className="text-xs" style={{ color: txtSub }}>
                        {furniture.size[0]}×{furniture.size[2]} м
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FurnitureCatalogModal