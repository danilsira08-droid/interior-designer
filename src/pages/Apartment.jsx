import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { apartments } from '../data/apartments'
import { useSiteTheme } from '../context/ThemeContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }
  })
}

function Apartment() {
  const { id } = useParams()
  const apt = apartments.find(a => a.id === id)
  const { isDark } = useSiteTheme()
  const [activeImage, setActiveImage] = useState(0) // 0 = превью, 1 = план, 2+ = галерея

  const accent      = isDark ? '#7c3aed' : '#f97316'
  const accentText  = isDark ? 'text-violet-400' : 'text-orange-500'
  const bg          = isDark ? 'bg-zinc-950 text-white'  : 'bg-white text-zinc-900'
  const sub         = isDark ? 'text-zinc-400' : 'text-zinc-500'
  const cardBg      = isDark ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-50 border-zinc-100'
  const tagBorder   = isDark ? 'text-zinc-300 border-white/10' : 'text-zinc-600 border-zinc-200'
  const breadcrumb  = isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
  const thumbBg     = isDark ? 'bg-white/5 border-white/8'  : 'bg-zinc-100 border-zinc-200'
  const thumbActive = isDark ? 'border-violet-500' : 'border-orange-400'
  const btnPrimary  = isDark ? 'bg-violet-600 hover:bg-violet-500' : 'bg-orange-500 hover:bg-orange-400'

  // Все изображения для галереи
  const allImages = [
    apt?.preview  ? { src: apt.preview,  label: 'Рендер' }    : null,
    apt?.plan2d   ? { src: apt.plan2d,   label: '2D план' }   : null,
    ...(apt?.gallery || []).map((src, i) => ({ src, label: `Фото ${i + 1}` })),
  ].filter(Boolean)

  const hasImages = allImages.length > 0

  if (!apt) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="text-center">
          <p className={`mb-4 ${sub}`}>Квартира не найдена</p>
          <Link to="/catalog" style={{ color: accent }}>Вернуться в каталог</Link>
        </div>
      </main>
    )
  }

  const roomLabel = apt.rooms === 0 ? 'Студия' : `${apt.rooms}-комнатная квартира`

  return (
    <main className={`min-h-screen pt-20 pb-20 transition-colors duration-300 ${bg}`}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .grad-dark { background: linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .grad-light { background: linear-gradient(135deg,#f97316,#fbbf24,#f97316); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">

        {/* Хлебные крошки */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className={`flex items-center gap-2 text-sm mb-8 ${sub}`}
        >
          <Link to="/" className={`transition-colors ${breadcrumb}`}>Главная</Link>
          <span>/</span>
          <Link to="/catalog" className={`transition-colors ${breadcrumb}`}>Каталог</Link>
          <span>/</span>
          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{apt.title}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Левая — изображения */}
          <div>
            {/* Главное изображение */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className={`rounded-2xl overflow-hidden mb-4 border ${cardBg}`}
              style={{ height: '360px' }}
            >
              {hasImages && activeImage < allImages.length ? (
                <img
                  src={allImages[activeImage].src}
                  alt={allImages[activeImage].label}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Заглушка — красивый план-схема */
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                  style={{ background: isDark ? `${accent}10` : `${accent}08` }}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 500 360" fill="none">
                    {/* Контур квартиры */}
                    <rect x="30" y="30" width="440" height="300" stroke={accent} strokeWidth="2.5" rx="2"/>
                    {/* Комнаты */}
                    <line x1="200" y1="30" x2="200" y2="200" stroke={accent} strokeWidth="1.5"/>
                    <line x1="30" y1="200" x2="350" y2="200" stroke={accent} strokeWidth="1.5"/>
                    <line x1="350" y1="30" x2="350" y2="330" stroke={accent} strokeWidth="1.5"/>
                    {/* Мебель схема */}
                    <rect x="50" y="50" width="60" height="40" rx="3" stroke={accent} strokeWidth="1" opacity="0.6"/>
                    <rect x="220" y="50" width="80" height="50" rx="3" stroke={accent} strokeWidth="1" opacity="0.6"/>
                    <rect x="55" y="220" width="100" height="80" rx="3" stroke={accent} strokeWidth="1" opacity="0.6"/>
                    {/* Окна */}
                    <rect x="360" y="80" width="5" height="60" fill={accent} opacity="0.4"/>
                    <rect x="360" y="180" width="5" height="60" fill={accent} opacity="0.4"/>
                  </svg>
                  <div className="relative text-center">
                    <div className="text-6xl font-bold mb-2 opacity-10" style={{ color: accent }}>
                      {apt.rooms === 0 ? 'С' : apt.rooms}К
                    </div>
                    <p className={`text-sm ${sub}`}>Рендер появится после добавления</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Миниатюры */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="flex gap-2 flex-wrap"
            >
              {hasImages ? allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? thumbActive : thumbBg
                  }`}
                  style={{ width: 72, height: 52 }}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                </button>
              )) : (
                /* Заглушки под будущие фото */
                ['Рендер', '2D план', 'Фото'].map((label, i) => (
                  <div key={i}
                    className={`rounded-xl border-2 flex items-center justify-center text-xs transition-all ${thumbBg} ${sub}`}
                    style={{ width: 72, height: 52 }}
                  >
                    {label}
                  </div>
                ))
              )}
            </motion.div>
          </div>

          {/* Правая — информация */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <span className={`text-sm font-medium tracking-widest uppercase mb-2 block ${accentText}`}>
                {roomLabel}
              </span>
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
                { label: 'Площадь',         value: `${apt.area} м²` },
                { label: 'Комнаты',          value: apt.rooms === 0 ? 'Студия' : `${apt.rooms} комн.` },
                { label: 'Этаж',             value: apt.floor },
                { label: 'Высота потолков',  value: `${apt.ceilingHeight} м` },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-xl border ${cardBg}`}>
                  <div className={`text-xs mb-1 ${sub}`}>{item.label}</div>
                  <div className="font-bold text-lg">{item.value}</div>
                </div>
              ))}
            </motion.div>

            {/* Зоны квартиры (если есть) */}
            {apt.rooms_data && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mb-6">
                <p className={`text-xs uppercase tracking-widest mb-3 ${sub}`}>Зонирование</p>
                <div className="flex flex-col gap-2">
                  {Object.values(apt.rooms_data).map(zone => (
                    <div key={zone.name} className="flex items-center justify-between">
                      <span className={`text-sm ${sub}`}>{zone.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full"
                          style={{
                            width: `${Math.round(zone.area / apt.area * 120)}px`,
                            backgroundColor: accent,
                            opacity: 0.6,
                          }}
                        />
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {zone.area} м²
                        </span>
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
              <Link
                to={`/editor/${apt.id}`}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-200 hover:scale-[1.02] ${btnPrimary}`}
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
              <p className={`text-center text-sm mt-3 ${sub}`}>
                Расставь мебель и посмотри интерьер в 3D
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Apartment