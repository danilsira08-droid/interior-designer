import { useParams, Link } from 'react-router-dom'
import { Suspense, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apartments } from '../data/apartments'
import Scene, { THEMES } from '../components/three/Scene'
import { useEditorStore, FURNITURE_CATALOG } from '../modules/editor/useEditorStore'
import { checkNorms } from '../modules/norms/checkNorms'

const CATEGORIES = [
  { id: 'living', label: 'Гостиная' },
  { id: 'bedroom', label: 'Спальня' },
  { id: 'kitchen', label: 'Кухня' },
]

const LEVEL_CONFIG = {
  error: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
  advice: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
}

const THEME_PREVIEWS = {
  dark: 'bg-zinc-950 border-zinc-700',
  warm: 'bg-amber-950 border-amber-800',
  neutral: 'bg-zinc-800 border-zinc-600',
  violet: 'bg-violet-950 border-violet-800',
}

function ViolationCard({ v }) {
  const cfg = LEVEL_CONFIG[v.level]
  return (
    <div className={`p-3 rounded-xl border ${cfg.bg} mb-2`}>
      <div className="flex items-start gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mt-1.5 shrink-0`} />
        <div>
          <p className={`text-sm ${cfg.color} font-medium mb-0.5`}>{v.title}</p>
          <p className="text-zinc-300 text-sm leading-relaxed">{v.message}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-zinc-600 text-xs">{v.source}</p>
            {v.sourceUrl && (
              <a href={v.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Читать норму →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NormsModal({ violations, onClose }) {
  const errors = violations.filter(v => v.level === 'error')
  const warnings = violations.filter(v => v.level === 'warning')
  const advice = violations.filter(v => v.level === 'advice')
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-semibold text-lg">Проверка размещения</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <p className="text-zinc-500 text-sm">{violations.length === 0 ? 'Расстановка соответствует всем нормам' : `Найдено замечаний: ${violations.length}`}</p>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          {violations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-emerald-400 font-medium">Всё в порядке</p>
            </div>
          )}
          {errors.length > 0 && <div><p className="text-xs text-zinc-600 uppercase tracking-widest mb-2 px-1">Нарушения норм</p>{errors.map((v, i) => <ViolationCard key={i} v={v} />)}</div>}
          {warnings.length > 0 && <div className="mt-1"><p className="text-xs text-zinc-600 uppercase tracking-widest mb-2 px-1">Эргономика</p>{warnings.map((v, i) => <ViolationCard key={i} v={v} />)}</div>}
          {advice.length > 0 && <div className="mt-1"><p className="text-xs text-zinc-600 uppercase tracking-widest mb-2 px-1">Рекомендации</p>{advice.map((v, i) => <ViolationCard key={i} v={v} />)}</div>}
        </div>
        <div className="p-4 border-t border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white transition-all text-sm">Продолжить редактирование</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors text-sm font-medium">Подтвердить</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ThemePicker({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h2 className="text-white font-semibold text-lg mb-1">выбери тему редактора</h2>
          <p className="text-zinc-500 text-sm">можно поменять позже через кнопку в панели</p>
        </div>
        <div className="p-6 grid grid-cols-2 gap-3">
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`group relative p-4 rounded-xl border-2 ${THEME_PREVIEWS[key]} hover:border-violet-500 transition-all duration-200 text-left`}
            >
              <div className={`h-10 rounded-lg mb-3 ${THEME_PREVIEWS[key].split(' ')[0]}`} />
              <p className="text-white text-sm font-medium">{theme.label}</p>
            </button>
          ))}
        </div>
        <div className="px-6 pb-6">
          <button onClick={() => onSelect('dark')} className="w-full py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-sm transition-colors">
            оставить как есть
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Editor() {
  const { id } = useParams()
  const apt = apartments.find(a => a.id === id)
  const { items, selectedId, addItem, deleteItem, rotateItem } = useEditorStore()
  const [showModal, setShowModal] = useState(false)
  const [violations, setViolations] = useState([])
  const [mode, setMode] = useState('editor')
  const [theme, setTheme] = useState('dark')
  const [showThemePicker, setShowThemePicker] = useState(true)
  const orbitRef = useRef()

  // Храним selectedId в ref для доступа в keydown без замыкания
  const selectedIdRef = useRef(selectedId)
  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    setViolations(items.length > 0 ? checkNorms(items) : [])
  }, [items])

  // Клавиши — используем ref чтобы всегда видеть актуальный selectedId
  useEffect(() => {
    const handleKey = (e) => {
      if (mode !== 'editor') return
      const current = selectedIdRef.current
      if (current === null) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        deleteItem(current)
      }
      if (e.key === 'r' || e.key === 'R') {
        rotateItem(current)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mode, deleteItem, rotateItem])

  const handleTopView = () => {
    if (orbitRef.current) orbitRef.current.setTopView()
  }

  const errorCount = violations.filter(v => v.level === 'error').length
  const warningCount = violations.filter(v => v.level === 'warning').length
  const adviceCount = violations.filter(v => v.level === 'advice').length

  if (!apt) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Квартира не найдена</p>
          <Link to="/catalog" className="text-violet-400 hover:text-violet-300">Вернуться в каталог</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-btn {
          background: linear-gradient(135deg, #7c3aed, #a855f7, #ec4899, #7c3aed);
          background-size: 300% 300%;
          animation: gradientShift 3s ease infinite;
        }
      `}</style>

      {/* Шапка */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-zinc-950/90 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/apartment/${apt.id}`} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <span className="text-sm text-zinc-400">Редактор</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white">{apt.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'editor' && (
            <button
              onClick={handleTopView}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-sm transition-all mr-1"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                <path d="M7 2v1M7 11v1M2 7h1M11 7h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="text-xs">сверху</span>
            </button>
          )}

          <button
            onClick={() => setMode('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === 'editor' ? 'gradient-btn text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            редактор
            <span className={`text-xs ${mode === 'editor' ? 'text-white/60' : 'text-zinc-600'}`}>· расставляй мебель</span>
          </button>

          <button
            onClick={() => setMode('viewer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === 'viewer' ? 'gradient-btn text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            просмотр
            <span className={`text-xs ${mode === 'viewer' ? 'text-white/60' : 'text-zinc-600'}`}>· гуляй по квартире</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThemePicker(true)}
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors"
          >
            <div className={`w-3.5 h-3.5 rounded-full ${THEME_PREVIEWS[theme].split(' ')[0]} border border-white/20`} />
          </button>
          <span className="text-xs text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg">{apt.area} м²</span>
          {mode === 'editor' && items.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center gap-2"
            >
              Проверить нормы
              {violations.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-medium">{violations.length}</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Основная область */}
      <div className="flex flex-1 overflow-hidden relative">

        <AnimatePresence>
          {mode === 'editor' && (
            <motion.div
              initial={{ x: -280, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col shrink-0 overflow-y-auto absolute left-0 top-0 bottom-0 z-10"
            >
              {CATEGORIES.map(cat => {
                const catItems = FURNITURE_CATALOG.filter(f => f.category === cat.id)
                return (
                  <div key={cat.id}>
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest">{cat.label}</p>
                    </div>
                    <div className="p-3 flex flex-col gap-2">
                      {catItems.map(furniture => (
                        <button
                          key={furniture.id}
                          onClick={() => addItem(furniture)}
                          className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-violet-500/30 transition-all duration-150 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{furniture.title}</span>
                            <span className="text-xs text-zinc-600 group-hover:text-violet-400 transition-colors">+</span>
                          </div>
                          <div className="text-xs text-zinc-600 mt-0.5">{furniture.size[0]}×{furniture.size[2]} м</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{
            left: mode === 'editor' ? '256px' : '0',
            right: mode === 'editor' ? '224px' : '0',
            transition: 'left 0.25s, right 0.25s',
          }}
        >
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
              <div className="text-zinc-500 text-sm">Загрузка сцены...</div>
            </div>
          }>
            <Scene apartmentId={apt.id} mode={mode} onExitFirstPerson={() => setMode('editor')} theme={theme} orbitRef={orbitRef} />
          </Suspense>

          {mode === 'viewer' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 h-5 relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white/70" />
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {mode === 'editor' && (
            <motion.div
              initial={{ x: 224, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 224, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-56 border-l border-white/5 bg-zinc-950 flex flex-col shrink-0 absolute right-0 top-0 bottom-0 z-10"
            >
              <div className="p-4 border-b border-white/5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Свойства</p>
              </div>
              {selectedId !== null ? (() => {
                const item = items.find(i => i.id === selectedId)
                if (!item) return null
                return (
                  <div className="p-4 flex flex-col gap-3">
                    <p className="text-white font-medium">{item.title}</p>
                    <div className="text-xs text-zinc-500 space-y-1">
                      <div>Ширина: {item.size[0]} м</div>
                      <div>Высота: {item.size[1]} м</div>
                      <div>Глубина: {item.size[2]} м</div>
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <div className="text-zinc-600 text-xs mb-1">Позиция:</div>
                        <div>X: {item.position[0].toFixed(2)}</div>
                        <div>Y: {item.position[1].toFixed(2)}</div>
                        <div>Z: {item.position[2].toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <button onClick={() => rotateItem(selectedId)} className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition-colors">Повернуть (R)</button>
                      <button onClick={() => deleteItem(selectedId)} className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400 transition-colors">Удалить (Del)</button>
                    </div>
                  </div>
                )
              })() : (
                <div className="flex-1 flex items-center justify-center p-6">
                  <p className="text-zinc-700 text-sm text-center">выбери объект в сцене</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mode === 'editor' && (
        <div className="h-10 border-t border-white/5 bg-zinc-950/90 flex items-center px-6 gap-4 shrink-0">
          <span className="text-xs text-zinc-600 uppercase tracking-widest">Нормы:</span>
          {items.length === 0 && <span className="text-xs text-zinc-600">добавь мебель для проверки</span>}
          {errorCount > 0 && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />{errorCount} нарушение</button>}
          {warningCount > 0 && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{warningCount} рекомендации</button>}
          {adviceCount > 0 && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" />{adviceCount} совета</button>}
          {items.length > 0 && violations.length === 0 && <span className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />всё в порядке</span>}
          <span className="text-xs text-zinc-700 ml-auto">объектов: {items.length}</span>
        </div>
      )}

      {mode === 'viewer' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="h-12 border-t border-white/5 bg-zinc-950/95 flex items-center justify-center gap-8 shrink-0 backdrop-blur-md"
        >
          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['W','A','S','D'].map(k => (
                  <kbd key={k} className="px-2 py-1 rounded-md bg-white/8 border border-white/10 font-mono text-zinc-300">{k}</kbd>
                ))}
              </div>
              <span className="text-zinc-600">движение</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-md bg-white/8 border border-white/10 font-mono text-zinc-300">мышь</kbd>
              <span className="text-zinc-600">поворот</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-md bg-white/8 border border-white/10 font-mono text-zinc-300">Esc</kbd>
              <span className="text-zinc-600">разблокировать курсор</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <button onClick={() => setMode('editor')} className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors">
              ← выйти из просмотра
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showThemePicker && <ThemePicker onSelect={(t) => { setTheme(t); setShowThemePicker(false) }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && <NormsModal violations={violations} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </main>
  )
}

export default Editor
