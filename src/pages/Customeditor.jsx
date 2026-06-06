import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { customModelObjectUrl } from '../pages/Catalog'
import Scene from '../components/three/Scene'
import LoadingScreen from '../components/ui/LoadingScreen'
import FurnitureCatalogModal from '../components/ui/FurnitureCatalogModal'
import CalculationsModal from '../components/ui/CalculationsModal'
import ColorPickerModal from '../components/ui/ColorPickerModal'
import { MeasureButton } from '../components/ui/MeasureTool'
import { useEditorStore } from '../modules/editor/useEditorStore'
import { useSiteTheme } from '../context/ThemeContext'

// Фиктивная квартира для расчётов
const CUSTOM_APT = {
  id: 'custom',
  title: 'Своя планировка',
  subtitle: '',
  area: 50,
  floor: null,
  ceilingHeight: 2.7,
  rooms_data: null,
}

function CustomEditor() {
  const navigate   = useNavigate()
  const { isDark } = useSiteTheme()

  const {
    items, selectedId,
    addItem, deleteItem, rotateItem,
    loadApartment,
    wallColor, ceilingColor, floorColor,
    bathroomWallColor, bathroomFloorColor,
    setWallColor, setCeilingColor, setFloorColor,
    setBathroomWallColor, setBathroomFloorColor,
  } = useEditorStore()

  const [showCalc,        setShowCalc]        = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showCatalog,     setShowCatalog]     = useState(false)
  const [measureActive,   setMeasureActive]   = useState(false)
  const [mode,            setMode]            = useState('editor')
  const [isLoading,       setIsLoading]       = useState(true)
  const [loadProgress,    setLoadProgress]    = useState(0)

  const orbitRef      = useRef()
  const canvasRef     = useRef()
  const selectedIdRef = useRef(selectedId)

  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])

  // Если нет модели — редиректим в каталог
  useEffect(() => {
    if (!customModelObjectUrl) {
      navigate('/catalog')
      return
    }
    setIsLoading(true)
    loadApartment(CUSTOM_APT)
  }, [])

  const handleLoadProgress = (progress, active) => {
    setLoadProgress(progress)
    if (!active && progress >= 100) setTimeout(() => setIsLoading(false), 400)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { setMeasureActive(false); return }
      if (mode !== 'editor' || measureActive) return
      const cur = selectedIdRef.current
      if (cur === null) return
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteItem(cur) }
      if (e.key === 'r' || e.key === 'R') rotateItem(cur)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mode, measureActive, deleteItem, rotateItem])

  const hdr   = isDark ? 'bg-zinc-950/90 border-white/5' : 'bg-white/90 border-zinc-200'
  const txt   = isDark ? 'text-white'    : 'text-zinc-900'
  const sub   = isDark ? 'text-zinc-400' : 'text-zinc-500'
  const panel = isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-100'
  const btn   = isDark
    ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/8'
    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 border border-zinc-200'
  const accent = isDark ? '#7c3aed' : '#f97316'

  return (
    <main className="h-screen flex flex-col overflow-hidden" style={{ background: isDark ? '#09090b' : '#f9f9f7' }}>
      <style>{`
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .gradient-btn { background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899,#7c3aed); background-size:300% 300%; animation:gradientShift 3s ease infinite; }
        .catalog-btn  { background:linear-gradient(135deg,#10b981,#3b82f6,#10b981); background-size:300% 300%; animation:gradientShift 4s ease infinite; }
      `}</style>

      <LoadingScreen isLoading={isLoading} progress={loadProgress} />

      {/* ШАПКА */}
      <div className={`h-16 flex items-center justify-between px-6 border-b backdrop-blur-md z-10 shrink-0 ${hdr}`}>
        <div className="flex items-center gap-3">
          <Link to="/catalog" className={`${sub} hover:text-violet-400 transition-colors`}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
          <div>
            <p className={`text-xs leading-none mb-0.5 ${sub}`}>редактор</p>
            <p className={`text-sm font-semibold leading-none ${txt}`}>Своя планировка</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'editor' && (
            <button onClick={() => orbitRef.current?.setTopView()} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${btn}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                <path d="M7 2v1M7 11v1M2 7h1M11 7h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="text-xs">сверху</span>
            </button>
          )}
          <button onClick={() => { setMode('editor'); setMeasureActive(false) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'editor' ? 'gradient-btn text-white' : btn}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Редактор
          </button>
          <button onClick={() => setMode('viewer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'viewer' ? 'gradient-btn text-white' : btn}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Просмотр
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'editor' && (
            <MeasureButton active={measureActive} onToggle={() => setMeasureActive(v => !v)} />
          )}
          <button onClick={() => setShowColorPicker(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${showColorPicker ? 'text-white' : btn}`}
            style={showColorPicker ? { backgroundColor: accent } : {}}
          >
            <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: wallColor }} />
            <span className="text-xs">Отделка</span>
          </button>
          <button onClick={() => setShowCalc(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="white" strokeWidth="1.3"/>
              <path d="M4 5h6M4 7h6M4 9h4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span className="text-xs">Расчёты</span>
          </button>
        </div>
      </div>

      {/* ОСНОВНАЯ ОБЛАСТЬ */}
      <div className="flex flex-1 overflow-hidden relative">
        <AnimatePresence>
          {mode === 'editor' && (
            <motion.div initial={{ x: 224, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 224, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`w-56 border-l flex flex-col shrink-0 absolute right-0 top-0 bottom-0 z-10 ${panel}`}
            >
              <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                <p className={`text-xs uppercase tracking-widest ${sub}`}>
                  {measureActive ? 'Режим замера' : 'Свойства'}
                </p>
              </div>
              {measureActive ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
                  <p className="text-sm text-orange-400 font-medium">Инструмент замера</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">Кликни две точки — появится расстояние</p>
                  <button onClick={() => setMeasureActive(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs transition-all"
                  >Выйти</button>
                </div>
              ) : selectedId !== null ? (() => {
                const item = items.find(i => i.id === selectedId)
                if (!item) return null
                return (
                  <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
                    <div className={`w-full rounded-xl overflow-hidden flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-zinc-50'}`} style={{ height: 140 }}>
                      {item.icon ? <img src={item.icon} alt={item.title} className="w-full h-full object-contain p-3"/> : <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: item.color }}/>}
                    </div>
                    <p className={`font-semibold ${txt}`}>{item.title}</p>
                    <button onClick={() => rotateItem(selectedId)}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}
                    >Повернуть (R)</button>
                    <button onClick={() => deleteItem(selectedId)}
                      className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-sm font-medium text-red-400 transition-colors"
                    >Удалить (Del)</button>
                  </div>
                )
              })() : (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <p className={`text-sm text-center ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>Выбери предмет чтобы увидеть свойства</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={canvasRef} className="absolute inset-0"
          style={{ right: mode === 'editor' ? '224px' : '0', transition: 'right 0.25s' }}
        >
          <Scene
            apartmentId={null}
            customModelPath={customModelObjectUrl}
            mode={mode}
            onExitFirstPerson={() => setMode('editor')}
            orbitRef={orbitRef}
            wallColor={wallColor} ceilingColor={ceilingColor} floorColor={floorColor}
            bathroomWallColor={bathroomWallColor} bathroomFloorColor={bathroomFloorColor}
            onLoadProgress={handleLoadProgress}
            measureActive={measureActive}
            containerRef={canvasRef}
          />

          {mode === 'viewer' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 h-5 relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50"/>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50"/>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white/70"/>
              </div>
            </div>
          )}

          {mode === 'editor' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              onClick={() => { setShowCatalog(v => !v); setMeasureActive(false) }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="absolute bottom-6 left-6 catalog-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-semibold shadow-2xl z-20"
              style={{ boxShadow: '0 8px 32px rgba(16,185,129,0.35)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3"/>
              </svg>
              Расставить мебель
              {items.length > 0 && <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>}
            </motion.button>
          )}

          <FurnitureCatalogModal isOpen={showCatalog} onClose={() => setShowCatalog(false)} onAddItem={addItem} isDark={isDark} />
        </div>
      </div>

      {mode === 'editor' && (
        <div className={`h-10 border-t flex items-center px-6 gap-4 shrink-0 text-xs ${isDark ? 'border-white/5 bg-zinc-950/90' : 'border-zinc-100 bg-white/90'}`}>
          {measureActive
            ? <span className="text-orange-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"/>Режим замера — кликни две точки · Esc для выхода</span>
            : <span className={isDark ? 'text-zinc-600' : 'text-zinc-400'}>R — повернуть · Del — удалить</span>
          }
          <span className={`ml-auto ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>объектов: {items.length}</span>
        </div>
      )}

      {mode === 'viewer' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="h-12 border-t border-white/5 bg-zinc-950/95 flex items-center justify-center gap-6 shrink-0"
        >
          <div className="flex items-center gap-5 text-xs text-zinc-400">
            <div className="flex gap-1">{['W','A','S','D'].map(k => <kbd key={k} className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-zinc-300">{k}</kbd>)}</div>
            <span className="text-zinc-600">движение</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-zinc-300">мышь</kbd>
            <span className="text-zinc-600">поворот</span>
            <div className="w-px h-4 bg-white/10"/>
            <button onClick={() => setMode('editor')} className="text-violet-400 hover:text-violet-300 transition-colors">← выйти</button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showColorPicker && (
          <ColorPickerModal onClose={() => setShowColorPicker(false)}
            wallColor={wallColor} ceilingColor={ceilingColor} floorColor={floorColor}
            bathroomWallColor={bathroomWallColor} bathroomFloorColor={bathroomFloorColor}
            onWallColor={setWallColor} onCeilingColor={setCeilingColor} onFloorColor={setFloorColor}
            onBathroomWallColor={setBathroomWallColor} onBathroomFloorColor={setBathroomFloorColor}
            hasBathroom={false}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCalc && (
          <CalculationsModal isOpen={showCalc} onClose={() => setShowCalc(false)} items={items} apt={CUSTOM_APT} canvasRef={canvasRef} />
        )}
      </AnimatePresence>
    </main>
  )
}

export default CustomEditor