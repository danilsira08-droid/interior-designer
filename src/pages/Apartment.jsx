import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { apartments } from '../data/apartments'
import { useSiteTheme } from '../context/ThemeContext'

const fadeUp = {
  hidden:   { opacity: 0, y: 24 },
  visible:  (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } })
}

const PHOTO_TABS = [
  { id: 'plan',        label: '2D план',     key: 'plan' },
  { id: 'preview',     label: '3D вид',      key: 'preview' },
  { id: 'firstperson', label: 'От первого лица', key: 'firstperson' },
]

function Apartment() {
  const { id }  = useParams()
  const apt     = apartments.find(a => a.id === id)
  const { isDark } = useSiteTheme()
  const [activeTab, setActiveTab] = useState('plan')

  const bg         = isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
  const sub        = isDark ? 'text-zinc-400' : 'text-zinc-500'
  const cardBg     = isDark ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-50 border-zinc-100'
  const tagBorder  = isDark ? 'text-zinc-300 border-white/10' : 'text-zinc-600 border-zinc-200'
  const breadcrumb = isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
  const btnPrimary = isDark ? 'bg-violet-600 hover:bg-violet-500' : 'bg-orange-500 hover:bg-orange-400'
  const tabActive  = isDark ? 'bg-white/10 text-white' : 'bg-zinc-200 text-zinc-900'
  const tabInactive= isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
  const accent     = isDark ? '#7c3aed' : '#f97316'
  const accentText = isDark ? 'text-violet-400' : 'text-orange-500'

  if (!apt) return (
    <main className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <p className={`mb-4 ${sub}`}>Квартира не найдена</p>
        <Link to="/catalog" style={{ color: accent }}>Вернуться в каталог</Link>
      </div>
    </main>
  )

  const activePhoto = apt[activeTab]
  const roomLabel   = apt.rooms === 0 ? 'Студия' : `${apt.rooms}-комн.`

  return (
    <main className={`min-h-screen pt-20 pb-20 ${bg}`}>
      <style>{`
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .grad-dark  { background:linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .grad-light { background:linear-gradient(135deg,#f97316,#fbbf24,#f97316); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">

        {/* Хлебные крошки */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className={`flex items-center gap-2 text-sm mb-8 ${sub}`}
        >
          <Link to="/"       className={`transition-colors ${breadcrumb}`}>Главная</Link>
          <span>/</span>
          <Link to="/catalog" className={`transition-colors ${breadcrumb}`}>Каталог</Link>
          <span>/</span>
          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{apt.title} · {apt.subtitle}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* ── ЛЕВАЯ — фото ─────────────────────────────────────── */}
          <div>
            {/* Табы */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="flex gap-1 mb-3"
            >
              {PHOTO_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? tabActive : tabInactive}`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Главное фото */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className={`rounded-2xl overflow-hidden border mb-3 ${cardBg}`}
              style={{ height: 360 }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  {activePhoto ? (
                    <img src={activePhoto} alt={PHOTO_TABS.find(t => t.id === activeTab)?.label}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  {/* Заглушка */}
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3"
                    style={{ display: activePhoto ? 'none' : 'flex' }}
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
                      {activeTab === 'plan' && (
                        <>
                          <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 24h32M24 8v32" stroke="currentColor" strokeWidth="1.5"/>
                        </>
                      )}
                      {activeTab === 'preview' && (
                        <>
                          <rect x="8" y="16" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 16l8-8 16 8" stroke="currentColor" strokeWidth="1.5"/>
                        </>
                      )}
                      {activeTab === 'firstperson' && (
                        <>
                          <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="24" cy="24" r="3" fill="currentColor"/>
                        </>
                      )}
                    </svg>
                    <p className={`text-sm ${sub}`}>
                      {activeTab === 'plan' && 'Фото 2D плана появится скоро'}
                      {activeTab === 'preview' && 'Фото 3D вида появится скоро'}
                      {activeTab === 'firstperson' && 'Фото от первого лица появится скоро'}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Миниатюры всех трёх */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="grid grid-cols-3 gap-2"
            >
              {PHOTO_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl overflow-hidden border-2 transition-all relative ${
                    activeTab === tab.id
                      ? isDark ? 'border-violet-500' : 'border-orange-400'
                      : isDark ? 'border-white/8'    : 'border-zinc-200'
                  }`}
                  style={{ height: 72 }}
                >
                  {apt[tab.key] ? (
                    <img src={apt[tab.key]} alt={tab.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-xs ${sub} ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
                      {tab.label}
                    </div>
                  )}
                  {/* Подпись */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs py-0.5 text-center">
                    {tab.label}
                  </div>
                </button>
              ))}
            </motion.div>
          </div>

          {/* ── ПРАВАЯ — информация ───────────────────────────────── */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium uppercase tracking-widest ${accentText}`}>
                  {roomLabel}
                </span>
                <span className={`text-sm ${sub}`}>· {apt.subtitle}</span>
              </div>
              <h1 className="text-4xl font-bold mb-1">
                <span className={isDark ? 'grad-dark' : 'grad-light'}>{apt.title}</span>
              </h1>
              <p className={`text-lg mb-6 leading-relaxed ${sub}`}>{apt.description}</p>
            </motion.div>

            {/* Характеристики */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              {[
                { label: 'Площадь',        value: `${apt.area} м²` },
                { label: 'Комнат',         value: apt.rooms === 0 ? 'Студия' : apt.rooms },
                { label: 'Этаж',           value: apt.floor },
                { label: 'Высота потолков',value: `${apt.ceilingHeight} м` },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-xl border ${cardBg}`}>
                  <div className={`text-xs mb-1 ${sub}`}>{item.label}</div>
                  <div className="font-bold text-lg">{item.value}</div>
                </div>
              ))}
            </motion.div>

            {/* Зонирование */}
            {apt.rooms_data && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mb-6">
                <p className={`text-xs uppercase tracking-widest mb-3 ${sub}`}>Зонирование</p>
                <div className="flex flex-col gap-2">
                  {Object.values(apt.rooms_data).map(zone => (
                    <div key={zone.name} className="flex items-center justify-between">
                      <span className={`text-sm ${sub}`}>{zone.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full"
                          style={{ width: `${Math.round(zone.area / apt.area * 120)}px`, backgroundColor: accent, opacity: 0.6 }}
                        />
                        <span className={`text-sm font-medium`}>{zone.area} м²</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Особенности */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mb-8">
              <p className={`text-xs uppercase tracking-widest mb-3 ${sub}`}>Особенности</p>
              <div className="flex flex-wrap gap-2">
                {apt.features.map(f => (
                  <span key={f} className={`text-sm border px-3 py-1.5 rounded-full ${tagBorder}`}>{f}</span>
                ))}
              </div>
            </motion.div>

            {/* Кнопка в редактор */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <Link to={`/editor/${apt.id}`}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-[1.02] ${btnPrimary}`}
                style={{ boxShadow: `0 8px 30px ${accent}35` }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
                  <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
                  <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
                  <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3"/>
                </svg>
                Открыть в редакторе
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Apartment