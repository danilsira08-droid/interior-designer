import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { apartments } from '../data/apartments'
import { useSiteTheme } from '../context/ThemeContext'

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: '0',   label: 'Студии' },
  { id: '1',   label: '1-комн.' },
  { id: '2',   label: '2-комн.' },
  { id: '3',   label: '3-комн.' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}

function ApartmentCard({ apt, index, isDark }) {
  const accent    = isDark ? '#7c3aed' : '#f97316'
  const cardBg    = isDark ? 'bg-zinc-900 border-white/8 hover:border-violet-500/40' : 'bg-white border-zinc-100 hover:border-orange-300'
  const sub       = isDark ? 'text-zinc-500' : 'text-zinc-400'
  const txt       = isDark ? 'text-white' : 'text-zinc-900'
  const tagBg     = isDark ? 'bg-white/5 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
  const roomLabel = apt.rooms === 0 ? 'Студия' : `${apt.rooms}-комн.`

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index % 4}>
      <Link to={`/apartment/${apt.id}`}
        className={`group block rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${cardBg}`}
      >
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          {apt.plan ? (
            <img src={apt.plan} alt={apt.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: isDark ? '#1a1a2e' : '#f0f0f8' }}
            >
              <svg width="120" height="90" viewBox="0 0 120 90" fill="none" opacity="0.5">
                <rect x="4" y="4" width="112" height="82" rx="3" stroke={accent} strokeWidth="1.5"/>
                {apt.rooms >= 1 && <rect x="60" y="4" width="56" height="45" stroke={accent} strokeWidth="1"/>}
                {apt.rooms >= 2 && <rect x="4" y="4" width="56" height="45" stroke={accent} strokeWidth="1"/>}
                {apt.rooms >= 3 && <rect x="4" y="49" width="56" height="37" stroke={accent} strokeWidth="1"/>}
                <rect x="60" y="49" width="56" height="37" stroke={accent} strokeWidth="1"/>
              </svg>
              <p className="text-xs" style={{ color: accent }}>Фото скоро</p>
            </div>
          )}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
            style={{ background: accent }}
          >{roomLabel}</div>
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs ${tagBg}`}>
            {apt.subtitle}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-bold text-base ${txt}`}>{apt.title}</h3>
              <p className={`text-sm ${sub}`}>{apt.subtitle} · этаж {apt.floor}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg" style={{ color: accent }}>{apt.area} м²</p>
              <p className={`text-xs ${sub}`}>{apt.ceilingHeight} м потолки</p>
            </div>
          </div>
          <p className={`text-sm leading-relaxed line-clamp-2 mb-3 ${sub}`}>{apt.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {apt.features.slice(0, 3).map(f => (
              <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${tagBg}`}>{f}</span>
            ))}
            {apt.features.length > 3 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${tagBg}`}>+{apt.features.length - 3}</span>
            )}
          </div>
        </div>

        <div className={`px-4 py-3 border-t flex items-center justify-between ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
          <span className={`text-xs ${sub}`}>Открыть планировку</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}

// Хранилище пользовательской модели — в памяти браузера
export let customModelObjectUrl = null

function Catalog() {
  const { isDark } = useSiteTheme()
  const navigate   = useNavigate()
  const fileRef    = useRef()
  const [activeFilter, setActiveFilter] = useState('all')
  const [dragOver,     setDragOver]     = useState(false)
  const [uploading,    setUploading]    = useState(false)
  const [error,        setError]        = useState(null)

  const filtered = activeFilter === 'all'
    ? apartments
    : apartments.filter(a => String(a.rooms) === activeFilter)

  const bg          = isDark ? 'bg-zinc-950 text-white'  : 'bg-white text-zinc-900'
  const sub         = isDark ? 'text-zinc-400'            : 'text-zinc-500'
  const accent      = isDark ? '#7c3aed'                  : '#f97316'
  const tabActive   = isDark ? 'bg-violet-600 text-white' : 'bg-orange-500 text-white'
  const tabInactive = isDark ? 'bg-white/5 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'
  const uploadBg    = isDark
    ? `bg-zinc-900 border-2 ${dragOver ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 hover:border-white/20'}`
    : `bg-zinc-50 border-2 ${dragOver ? 'border-orange-400 bg-orange-50' : 'border-zinc-200 hover:border-zinc-300'}`

  const groups = [
    { label: 'Студии',      rooms: 0 },
    { label: '1-комнатные', rooms: 1 },
    { label: '2-комнатные', rooms: 2 },
    { label: '3-комнатные', rooms: 3 },
  ]

  const handleFile = (file) => {
    setError(null)
    if (!file) return

    if (!file.name.endsWith('.glb')) {
      setError('Поддерживается только формат GLB')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 100 МБ')
      return
    }

    setUploading(true)

    // Освобождаем предыдущий URL
    if (customModelObjectUrl) {
      URL.revokeObjectURL(customModelObjectUrl)
    }

    // Создаём Object URL — модель живёт в памяти браузера до закрытия вкладки
    customModelObjectUrl = URL.createObjectURL(file)

    setTimeout(() => {
      setUploading(false)
      navigate('/editor/custom')
    }, 500)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <main className={`min-h-screen pt-24 pb-20 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Шапка */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest mb-3 font-medium" style={{ color: accent }}>
            ЖК Мытищи Парк
          </p>
          <h1 className="text-5xl font-bold mb-4">Каталог планировок</h1>
          <p className={`text-lg max-w-xl mx-auto ${sub}`}>
            12 планировок — студии, 1-, 2- и 3-комнатные квартиры. Выбери и спроектируй интерьер в 3D.
          </p>
        </motion.div>

        {/* Фильтры */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="flex gap-2 justify-center mb-12 flex-wrap"
        >
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 ${activeFilter === f.id ? tabActive : tabInactive}`}
            >
              {f.label}
              <span className="ml-1.5 opacity-60 text-xs">
                {f.id === 'all' ? apartments.length : apartments.filter(a => String(a.rooms) === f.id).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Сетка */}
        {activeFilter !== 'all' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((apt, i) => (
              <ApartmentCard key={apt.id} apt={apt} index={i} isDark={isDark} />
            ))}
          </div>
        ) : (
          groups.map(group => {
            const groupApts = apartments.filter(a => a.rooms === group.rooms)
            if (!groupApts.length) return null
            return (
              <div key={group.rooms} className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold">{group.label}</h2>
                  <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}/>
                  <span className={`text-sm ${sub}`}>{groupApts.length} вар.</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupApts.map((apt, i) => (
                    <ApartmentCard key={apt.id} apt={apt} index={i} isDark={isDark} />
                  ))}
                </div>
              </div>
            )
          })
        )}

        {/* ── СВОЯ ПЛАНИРОВКА ───────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Своя планировка</h2>
            <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}/>
          </div>

          <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-white/8' : 'border-zinc-200'}`}>
            <div className="grid lg:grid-cols-2">

              {/* Зона загрузки */}
              <div className="p-8">
                <div
                  className={`rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${uploadBg}`}
                  style={{ minHeight: 220 }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef} type="file" accept=".glb"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                  />

                  {uploading ? (
                    <>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: `${accent}20` }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 rounded-full border-2 border-transparent"
                          style={{ borderTopColor: accent }}
                        />
                      </div>
                      <p className="text-sm font-medium" style={{ color: accent }}>Загрузка модели...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: `${accent}15` }}
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M14 4v16M7 11l7-7 7 7" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 22h20" stroke={accent} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold mb-1" style={{ color: isDark ? 'white' : '#18181b' }}>
                          {dragOver ? 'Отпустите файл' : 'Загрузить GLB файл'}
                        </p>
                        <p className={`text-sm ${sub}`}>
                          Перетащите файл или нажмите для выбора
                        </p>
                      </div>
                    </>
                  )}

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}
                </div>
              </div>

              {/* Описание */}
              <div className="p-8 flex flex-col justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <h3 className="text-xl font-bold mb-4">Используйте собственную планировку</h3>
                <p className={`text-sm leading-relaxed mb-6 ${sub}`}>
                  Загрузите 3D-модель своей квартиры и расставьте мебель из каталога, настройте отделку и получите смету — всё без привязки к готовым планировкам ЖК.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: '📐', text: 'Экспортируйте модель из Blender, SketchUp или ArchiCAD' },
                    { icon: '📁', text: 'Формат файла — GLB (бинарный glTF 2.0)' },
                    { icon: '⚡', text: 'Рекомендуемый размер — до 50 МБ для быстрой загрузки' },
                    { icon: '🔒', text: 'Файл не загружается на сервер — обрабатывается локально' },
                  ].map(item => (
                    <div key={item.text} className="flex items-start gap-3">
                      <span className="text-base mt-0.5">{item.icon}</span>
                      <span className={`text-sm ${sub}`}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${isDark ? 'border-white/5 bg-white/[0.02] text-zinc-600' : 'border-zinc-100 bg-zinc-50 text-zinc-400'}`}>
                  GLB — открытый стандарт для 3D-моделей в вебе (ISO/IEC 12113:2022). Поддерживается большинством профессиональных 3D-редакторов.
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  )
}

export default Catalog