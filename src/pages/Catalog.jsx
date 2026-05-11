import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { apartments } from '../data/apartments'
import { useSiteTheme } from '../context/ThemeContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }
  })
}

const ROOM_FILTERS = [
  { label: 'Все',       value: null },
  { label: 'Студия',    value: 0 },
  { label: '1 комната', value: 1 },
  { label: '2 комнаты', value: 2 },
  { label: '3 комнаты', value: 3 },
]

// Цвета акцентов для карточек
const CARD_ACCENTS_DARK  = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b']
const CARD_ACCENTS_LIGHT = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6']

function ApartmentCard({ apt, index, isDark }) {
  const [hovered, setHovered] = useState(false)
  const accent = isDark
    ? CARD_ACCENTS_DARK[index % CARD_ACCENTS_DARK.length]
    : CARD_ACCENTS_LIGHT[index % CARD_ACCENTS_LIGHT.length]

  const roomLabel = apt.rooms === 0 ? 'Студия' : `${apt.rooms}-комн.`
  const hasPreview = apt.preview // путь к изображению превью

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={index + 2}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/apartment/${apt.id}`} className="group block h-full">
        <motion.div
          animate={{ y: hovered ? -6 : 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl border overflow-hidden h-full transition-all duration-300 flex flex-col ${
            isDark ? 'border-white/8 bg-zinc-950' : 'border-zinc-200 bg-white'
          }`}
          style={{
            boxShadow: hovered
              ? `0 20px 60px ${accent}25, 0 0 0 1px ${accent}30`
              : isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)'
          }}
        >
          {/* Превью */}
          <div className="h-52 relative overflow-hidden flex-shrink-0"
            style={{ background: isDark ? `${accent}15` : `${accent}08` }}
          >
            {hasPreview ? (
              <img src={apt.preview} alt={apt.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <>
                {/* Декоративный план */}
                <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 200" fill="none">
                  <rect x="40" y="30" width="150" height="140" stroke={accent} strokeWidth="2"/>
                  <rect x="190" y="30" width="170" height="80" stroke={accent} strokeWidth="2"/>
                  <rect x="190" y="110" width="80" height="60" stroke={accent} strokeWidth="2"/>
                  <rect x="270" y="110" width="90" height="60" stroke={accent} strokeWidth="2"/>
                  <line x1="40" y1="100" x2="190" y2="100" stroke={accent} strokeWidth="1" strokeDasharray="4 4"/>
                  {/* Мебель */}
                  <rect x="60" y="110" width="50" height="30" rx="3" stroke={accent} strokeWidth="1" opacity="0.5"/>
                  <rect x="200" y="45" width="60" height="40" rx="2" stroke={accent} strokeWidth="1" opacity="0.5"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl font-bold opacity-5" style={{ color: accent }}>
                    {apt.rooms === 0 ? 'С' : apt.rooms}
                  </span>
                </div>
              </>
            )}

            {/* Hover overlay */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${accent}15, transparent)` }}
            />

            {/* Бейджи */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm border ${
                isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white/70 border-white/50 text-zinc-700'
              }`}>{roomLabel}</span>
              {apt.id === 'apt-1room-2' && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                  style={{ background: accent }}>
                  Готовый интерьер
                </span>
              )}
            </div>

            {/* Стрелка */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>

            <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${isDark ? 'from-zinc-950' : 'from-white'} to-transparent`} />
          </div>

          {/* Контент */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-2">
              <h2 className={`text-base font-semibold leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{apt.title}</h2>
              <span className={`text-sm px-2 py-0.5 rounded-lg shrink-0 ml-2 ${isDark ? 'text-zinc-500 bg-white/5' : 'text-zinc-400 bg-zinc-100'}`}>
                {apt.area} м²
              </span>
            </div>

            <p className={`text-sm leading-relaxed mb-3 line-clamp-2 flex-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {apt.description}
            </p>

            {/* Характеристики */}
            <div className={`flex items-center gap-3 text-xs mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <span>{apt.floor} этаж</span>
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
              <span>потолки {apt.ceilingHeight} м</span>
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
              <span>{apt.area} м²</span>
            </div>

            {/* Теги */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {apt.features.slice(0, 2).map(f => (
                <span key={f} className={`text-xs px-2 py-0.5 rounded-full border ${
                  isDark ? 'text-zinc-400 border-white/8' : 'text-zinc-500 border-zinc-200'
                }`}>{f}</span>
              ))}
            </div>

            {/* Кнопка */}
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-sm ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-700'} transition-colors`}>
                Открыть планировку
              </span>
              <motion.div
                animate={{ backgroundColor: hovered ? accent : `${accent}20` }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function Catalog() {
  const [activeFilter, setActiveFilter] = useState(null)
  const { isDark } = useSiteTheme()

  const filtered = activeFilter === null
    ? apartments
    : apartments.filter(a => a.rooms === activeFilter)

  const accent      = isDark ? '#7c3aed' : '#f97316'
  const accentText  = isDark ? 'text-violet-400' : 'text-orange-500'
  const badgeBg     = isDark ? 'border-violet-500/20 bg-violet-500/5 text-violet-400' : 'border-orange-200 bg-orange-50 text-orange-500'
  const subtext     = isDark ? 'text-zinc-400' : 'text-zinc-500'
  const filterActive   = isDark ? 'bg-violet-600 text-white' : 'bg-orange-500 text-white'
  const filterInactive = isDark ? 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 border border-zinc-200'

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-dark { background: linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .animated-gradient-light { background: linear-gradient(135deg,#f97316,#fbbf24,#f97316); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      {/* Фоновое свечение */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: `${accent}06` }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: `${accent}05` }} />
      </div>

      <div className="relative pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Заголовок */}
          <div className="mb-12">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-4 ${badgeBg}`}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
              ЖК Мытищи Парк · {apartments.length} планировки
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
            >
              Выбери свою{' '}
              <span className={isDark ? 'animated-gradient-dark' : 'animated-gradient-light'}>
                планировку
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className={`text-xl max-w-2xl ${subtext}`}
            >
              Реальные планировки квартир с точными размерами. Открой любую и спроектируй интерьер в 3D-редакторе.
            </motion.p>
          </div>

          {/* Фильтры */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="flex items-center gap-2 mb-10 flex-wrap"
          >
            {ROOM_FILTERS.map(filter => (
              <button key={filter.label} onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.value ? filterActive : filterInactive
                }`}
              >
                {filter.label}
              </button>
            ))}
            <span className={`ml-auto text-sm ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {filtered.length} {filtered.length === 1 ? 'вариант' : filtered.length < 5 ? 'варианта' : 'вариантов'}
            </span>
          </motion.div>

          {/* Карточки */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((apt, i) => (
              <ApartmentCard key={apt.id} apt={apt} index={i} isDark={isDark} />
            ))}

            {/* Загрузить свой план */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={filtered.length + 2}>
              <div className={`rounded-2xl border border-dashed transition-all duration-300 h-full min-h-[380px] flex flex-col items-center justify-center p-8 text-center cursor-pointer ${
                isDark ? 'border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5' : 'border-zinc-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}>
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border transition-colors ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-violet-500/10' : 'bg-zinc-100 border-zinc-200'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke={accent} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.div>
                <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Загрузить свой план</p>
                <p className={`text-sm leading-relaxed mb-4 ${subtext}`}>
                  Загрузи PDF или фото плана — ИИ построит 3D автоматически
                </p>
                <span className="text-xs border px-3 py-1 rounded-full"
                  style={{ color: accent, borderColor: `${accent}40` }}>
                  скоро
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default Catalog