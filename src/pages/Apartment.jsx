import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { apartments } from '../data/apartments'
import { useSiteTheme } from '../context/ThemeContext'

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } })
}

const PHOTO_TABS = [
  { id: 'plan',        label: '2D план',          key: 'plan' },
  { id: 'preview',     label: '3D вид',            key: 'preview' },
  { id: 'firstperson', label: 'От первого лица',   key: 'firstperson' },
]

function Apartment() {
  const { id }  = useParams()
  const apt     = apartments.find(a => a.id === id)
  const { isDark } = useSiteTheme()
  const [activeTab, setActiveTab] = useState('plan')

  const bg         = isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
  const sub        = isDark ? 'text-zinc-400' : 'text-zinc-500'
  const cardBg     = isDark ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-50 border-zinc-100'
  const tagBorder  = isDark ? 'text-zinc-300 border-white/10 bg-white/[0.03]' : 'text-zinc-600 border-zinc-200 bg-zinc-50'
  const breadcrumb = isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
  const btnPrimary = isDark ? 'bg-violet-600 hover:bg-violet-500' : 'bg-orange-500 hover:bg-orange-400'
  const tabActive  = isDark ? 'bg-white/10 text-white' : 'bg-zinc-200 text-zinc-900'
  const tabInactive= isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
  const accent     = isDark ? '#7c3aed' : '#f97316'
  const accentText = isDark ? 'text-violet-400' : 'text-orange-500'
  const imgBg      = isDark ? '#16162a' : '#f5f5fb'

  if (!apt) return (
    <main className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <p className={`mb-4 ${sub}`}>Квартира не найдена</p>
        <Link to="/catalog" style={{ color: accent }}>Вернуться в каталог</Link>
      </div>
    </main>
  )

  const activePhoto = apt[PHOTO_TABS.find(t => t.id === activeTab)?.key]
  const roomLabel   = apt.rooms === 0 ? 'Студия' : `${apt.rooms}-комн.`
  const totalRoomsArea = apt.rooms_data
    ? Object.values(apt.rooms_data).reduce((s, z) => s + z.area, 0).toFixed(2)
    : null

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
          <Link to="/"        className={`transition-colors ${breadcrumb}`}>Главная</Link>
          <span>/</span>
          <Link to="/catalog" className={`transition-colors ${breadcrumb}`}>Каталог</Link>
          <span>/</span>
          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{apt.title} · {apt.subtitle}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* ЛЕВАЯ — фото */}
          <div>
            {/* Табы */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="flex gap-1 mb-3 p-1 rounded-xl w-fit"
              style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
            >
              {PHOTO_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? tabActive : tabInactive}`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Главное фото */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className={`rounded-2xl overflow-hidden border mb-3 ${cardBg}`}
              style={{ height: 400, background: imgBg }}
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
                    <img src={activePhoto}
                      alt={PHOTO_TABS.find(t => t.id === activeTab)?.label}
                      className="w-full h-full"
                      style={{ objectFit: 'contain', padding: '16px' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.2">
                        {activeTab === 'plan' && (
                          <>
                            <rect x="8" y="8" width="48" height="48" rx="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 32h48M32 8v48" stroke="currentColor" strokeWidth="1.5"/>
                          </>
                        )}
                        {activeTab === 'preview' && (
                          <>
                            <rect x="8" y="20" width="48" height="36" rx="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M20 20L32 8l24 12" stroke="currentColor" strokeWidth="1.5"/>
                          </>
                        )}
                        {activeTab === 'firstperson' && (
                          <>
                            <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="32" cy="32" r="4" fill="currentColor"/>
                            <path d="M32 16v4M32 44v4M16 32h4M44 32h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </>
                        )}
                      </svg>
                      <p className={`text-sm ${sub}`}>
                        {activeTab === 'plan'        && 'Фото 2D плана появится скоро'}
                        {activeTab === 'preview'     && 'Фото 3D вида появится скоро'}
                        {activeTab === 'firstperson' && 'Фото от первого лица появится скоро'}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Миниатюры */}
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
                  style={{ height: 80, background: imgBg }}
                >
                  {apt[tab.key] ? (
                    <img src={apt[tab.key]} alt={tab.label}
                      className="w-full h-full"
                      style={{ objectFit: 'contain', padding: '6px' }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-xs ${sub}`}>
                      {tab.label}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                    {tab.label}
                  </div>
                </button>
              ))}
            </motion.div>
          </div>

          {/* ПРАВАЯ — информация */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium uppercase tracking-widest ${accentText}`}>{roomLabel}</span>
                <span className={`text-sm ${sub}`}>· {apt.subtitle}</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">
                <span className={isDark ? 'grad-dark' : 'grad-light'}>{apt.title}</span>
              </h1>
              <p className={`text-lg mb-6 leading-relaxed ${sub}`}>{apt.description}</p>
            </motion.div>

            {/* Ключевые характеристики */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              {[
                { label: 'Общая площадь',   value: `${apt.area} м²` },
                { label: 'Высота потолков', value: `${apt.ceilingHeight} м` },
                { label: 'Комнат',          value: apt.rooms === 0 ? 'Студия' : apt.rooms },
                { label: 'Санузлов',        value: apt.rooms_data
                  ? Object.values(apt.rooms_data).filter(z => z.name.toLowerCase().includes('санузел')).length || '—'
                  : '—'
                },
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
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-xs uppercase tracking-widest ${sub}`}>Зонирование</p>
                  {totalRoomsArea && (
                    <p className={`text-xs ${sub}`}>Всего: {totalRoomsArea} м²</p>
                  )}
                </div>
                <div className="space-y-2">
                  {Object.values(apt.rooms_data).map(zone => (
                    <div key={zone.name} className="flex items-center gap-3">
                      <span className={`text-sm w-44 shrink-0 ${sub}`}>{zone.name}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((zone.area / apt.area) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ background: accent, opacity: 0.6 }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">{zone.area} м²</span>
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

            {/* Кнопка */}
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