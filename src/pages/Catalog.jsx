import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { apartments } from '../data/apartments'
import { useSiteTheme } from '../context/ThemeContext'

const FILTERS = [
  { id: 'all',   label: 'Все' },
  { id: '0',     label: 'Студии' },
  { id: '1',     label: '1-комн.' },
  { id: '2',     label: '2-комн.' },
  { id: '3',     label: '3-комн.' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}

function ApartmentCard({ apt, index, isDark }) {
  const accent     = isDark ? '#7c3aed' : '#f97316'
  const cardBg     = isDark ? 'bg-zinc-900 border-white/8 hover:border-violet-500/40' : 'bg-white border-zinc-100 hover:border-orange-300'
  const sub        = isDark ? 'text-zinc-500' : 'text-zinc-400'
  const txt        = isDark ? 'text-white' : 'text-zinc-900'
  const tagBg      = isDark ? 'bg-white/5 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
  const roomLabel  = apt.rooms === 0 ? 'Студия' : `${apt.rooms}-комн.`

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index % 4}>
      <Link to={`/apartment/${apt.id}`}
        className={`group block rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${cardBg}`}
        style={{ boxShadow: `0 4px 20px rgba(0,0,0,0.08)` }}
      >
        {/* Фото */}
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          {apt.plan ? (
            <img src={apt.plan} alt={apt.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: isDark ? '#1a1a2e' : '#f0f0f8' }}
            >
              {/* Схематичный план */}
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

          {/* Бейдж типа */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
            style={{ background: accent }}
          >
            {roomLabel}
          </div>

          {/* Вариант */}
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs ${tagBg}`}>
            {apt.subtitle}
          </div>
        </div>

        {/* Инфо */}
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

          {/* Фичи */}
          <div className="flex flex-wrap gap-1.5">
            {apt.features.slice(0, 3).map(f => (
              <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${tagBg}`}>{f}</span>
            ))}
            {apt.features.length > 3 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${tagBg}`}>+{apt.features.length - 3}</span>
            )}
          </div>
        </div>

        {/* Нижняя полоска */}
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

function Catalog() {
  const { isDark } = useSiteTheme()
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? apartments
    : apartments.filter(a => String(a.rooms) === activeFilter)

  const bg      = isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
  const sub     = isDark ? 'text-zinc-400' : 'text-zinc-500'
  const accent  = isDark ? '#7c3aed' : '#f97316'
  const tabActive   = isDark ? 'bg-violet-600 text-white' : 'bg-orange-500 text-white'
  const tabInactive = isDark ? 'bg-white/5 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'

  // Группируем по типу для отображения
  const groups = [
    { label: 'Студии',       rooms: 0 },
    { label: '1-комнатные',  rooms: 1 },
    { label: '2-комнатные',  rooms: 2 },
    { label: '3-комнатные',  rooms: 3 },
  ]

  return (
    <main className={`min-h-screen pt-24 pb-20 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Шапка */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="text-center mb-12"
        >
          <p className={`text-sm uppercase tracking-widest mb-3 font-medium`} style={{ color: accent }}>
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

        {/* Сетка или группы */}
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
      </div>
    </main>
  )
}

export default Catalog