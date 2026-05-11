import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSiteTheme } from '../context/ThemeContext'
import * as THREE from 'three'

// Вращающийся 3D объект на фоне
function FloatingObject({ isDark }) {
  const meshRef = useRef()
  const mesh2Ref = useRef()
  const mesh3Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15
      meshRef.current.rotation.y = t * 0.2
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.3
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x = -t * 0.1
      mesh2Ref.current.rotation.z = t * 0.15
      mesh2Ref.current.position.y = Math.sin(t * 0.4 + 1) * 0.2
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.y = t * 0.25
      mesh3Ref.current.rotation.z = -t * 0.1
      mesh3Ref.current.position.y = Math.sin(t * 0.6 + 2) * 0.25
    }
  })

  const color1 = isDark ? '#7c3aed' : '#f97316'
  const color2 = isDark ? '#a855f7' : '#fbbf24'
  const color3 = isDark ? '#ec4899' : '#fb923c'

  return (
    <>
      {/* Основной куб wireframe */}
      <mesh ref={meshRef} position={[2.5, 0, 0]}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshBasicMaterial color={color1} wireframe opacity={0.3} transparent />
      </mesh>
      {/* Внутренний куб */}
      <mesh ref={mesh2Ref} position={[2.5, 0, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial color={color2} wireframe opacity={0.2} transparent />
      </mesh>
      {/* Октаэдр */}
      <mesh ref={mesh3Ref} position={[-2.8, 0.5, -1]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color={color3} wireframe opacity={0.2} transparent />
      </mesh>
      {/* Маленькие частицы */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * Math.PI / 3) * 3.5,
          Math.cos(i * Math.PI / 3) * 1.5,
          -1
        ]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshBasicMaterial color={color1} opacity={0.4} transparent />
        </mesh>
      ))}
    </>
  )
}

function Background3D({ isDark }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true }}
    >
      <FloatingObject isDark={isDark} />
    </Canvas>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }
  })
}

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: '3D-редактор',
    desc: 'Расставляй мебель в реальном трёхмерном пространстве. Перетаскивай, вращай, удаляй — полный контроль над планировкой.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2 6h6l-5 3.5 2 6L12 14l-5 3.5 2-6L4 8h6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI-дизайнер',
    desc: 'Опиши желаемый интерьер — искусственный интеллект расставит мебель за тебя и объяснит каждое решение.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Рекомендации',
    desc: 'Сервис даст обратную связь и рекомендации по обустройству пространства',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Режим просмотра',
    desc: 'Погрузись в готовый интерьер от первого лица — ходи по комнатам и оцени результат как в реальности.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Реальные планировки',
    desc: 'Точные 3D-модели квартир  — те же планировки, размеры и высота потолков что в реальных квартирах.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Загрузи свой план',
    desc: 'Загрузи PDF или фото плана своей квартиры — ИИ автоматически построит 3D-модель по твоей планировке.',
  },
]

const STEPS = [
  { num: '01', title: 'Выбери планировку', desc: 'Открой каталог и выбери квартиру с нужной площадью и количеством комнат. Или загрузи свой план.' },
  { num: '02', title: 'Расставь мебель', desc: 'Используй 3D-редактор или попроси AI расставить мебель — опиши стиль и получи готовое решение.' },
  { num: '03', title: 'Проверь, оцени и скачай pdf файл с итогами', desc: 'Проверь планировку, пройдись по квартире от первого лица, оцени результат. Сервис' },
]

function Home() {
  const { isDark } = useSiteTheme()

  const bg         = isDark ? 'bg-zinc-950 text-white'  : 'bg-white text-zinc-900'
  const subtext    = isDark ? 'text-zinc-400'            : 'text-zinc-500'
  const cardBg     = isDark ? 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06]' : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'
  const stepBg     = isDark ? 'bg-white/[0.02] border-white/5' : 'bg-zinc-50 border-zinc-100'
  const accent     = isDark ? '#7c3aed' : '#f97316'
  const accentText = isDark ? 'text-violet-400' : 'text-orange-500'
  const btnPrimary = isDark ? 'bg-violet-600 hover:bg-violet-500' : 'bg-orange-500 hover:bg-orange-400'
  const badgeBg    = isDark ? 'border-white/10 bg-white/5 text-zinc-400' : 'border-orange-200 bg-orange-50 text-orange-600'
  const glowColor  = isDark ? 'rgba(124,58,237,0.12)' : 'rgba(249,115,22,0.08)'

  return (
    <main className={`transition-colors duration-300 ${bg}`}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-dark {
          background: linear-gradient(135deg, #a78bfa, #f472b6, #a78bfa);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .animated-gradient-light {
          background: linear-gradient(135deg, #f97316, #fbbf24, #f97316);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* 3D фон */}
        <div className="absolute inset-0">
          <Background3D isDark={isDark} />
        </div>

        {/* Градиентное свечение */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: glowColor }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className={`mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm ${badgeBg}`}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
            Дипломный проект · НИУ МГСУ · 2026
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
          >
            Спроектируй
            <br />
            <span className={isDark ? 'animated-gradient-dark' : 'animated-gradient-light'}>
              свой дом.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className={`max-w-2xl mx-auto text-xl mb-4 leading-relaxed ${subtext}`}
          >
            Интерактивный веб-сервис для проектирования интерьера жилых помещений.
            Выбери планировку, расставь мебель в 3D, проверь расстановку — всё в браузере.
          </motion.p>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className={`max-w-xl mx-auto text-sm mb-10 ${subtext} opacity-70`}
          >
            На основе реальных планировок ·  AI - помощник
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/catalog"
              className={`px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg ${btnPrimary}`}
              style={{ boxShadow: `0 8px 30px ${accent}40` }}
            >
              Открыть редактор
            </Link>
            <a href="#features"
              className={`px-8 py-4 rounded-xl border font-medium text-lg transition-all duration-200 ${
                isDark ? 'border-white/10 hover:border-white/30 text-zinc-300 hover:text-white' : 'border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Узнать больше
            </a>
          </motion.div>

          {/* Метрики */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex items-center justify-center gap-12 mt-16 flex-wrap"
          >
            {[
              { value: '5', label: 'планировок' },
              { value: 'AI', label: 'дизайнер' },
              { value: '3D', label: 'редактор' },
              { value: '10+', label: ' рекомендаций' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}
                  style={{ color: accent }}>{item.value}</div>
                <div className={`text-sm ${subtext}`}>{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Скролл вниз */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs ${subtext}`}
        >
          <span>прокрути вниз</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── КАК ЭТО РАБОТАЕТ ─────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Процесс</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Три шага до результата</h2>
            <p className={`text-lg max-w-xl mx-auto ${subtext}`}>
              От выбора планировки до готового интерьера — быстро и без лишних усилий
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div key={step.num}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className={`p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden ${stepBg}`}
              >
                <div className="absolute top-4 right-4 text-6xl font-bold opacity-5">{step.num}</div>
                <div className="text-4xl font-bold mb-4" style={{ color: accent }}>{step.num}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className={`leading-relaxed ${subtext}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI СЕКЦИЯ ────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: `${accent}10` }} />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Главная фича</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className={isDark ? 'animated-gradient-dark' : 'animated-gradient-light'}>
                  AI-дизайнер
                </span>
                <br />внутри редактора
              </h2>
              <p className={`text-lg mb-6 leading-relaxed ${subtext}`}>
                Опиши желаемый интерьер текстом — система сама расставит мебель,
                соблюдая строительные нормы и эргономику. Никаких знаний дизайна не нужно.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  'Расставляет 4-8 предметов за 5 секунд',
                  'Учитывает размеры комнат и проходы',
                  'Объясняет каждое решение',
                  'Можно скорректировать вручную',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accent}20` }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className={subtext}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/catalog"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:scale-105 ${btnPrimary}`}
              >
                Попробовать
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>

            {/* Превью AI панели */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="float"
            >
              <div className={`rounded-2xl border overflow-hidden shadow-2xl ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}
                style={{ boxShadow: `0 30px 80px ${accent}20` }}
              >
                <div className={`p-4 border-b flex items-center gap-3 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, #7c3aed, #ec4899)` }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1l1.5 4h4l-3.5 2.5 1.5 4L7 9 3.5 11.5l1.5-4L1.5 5h4z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>AI-дизайнер</p>
                    <p className={`text-xs ${subtext}`}>расставит мебель за тебя</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className={`text-xs uppercase tracking-widest mb-2 ${subtext}`}>Быстрый выбор</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['Уютная гостиная', 'Современная спальня', 'Минимализм'].map(q => (
                      <span key={q} className="text-xs px-3 py-1.5 rounded-full border"
                        style={{ borderColor: `${accent}40`, color: accent }}>
                        {q}
                      </span>
                    ))}
                  </div>
                  <div className={`rounded-xl p-3 mb-4 ${isDark ? 'bg-white/5' : 'bg-zinc-50'}`}>
                    <p className={`text-sm ${subtext}`}>Уютная спальня для двоих с рабочей зоной у окна...</p>
                  </div>
                  <div className="w-full py-3 rounded-xl text-white text-sm font-medium text-center"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)' }}>
                    ✦ Расставить мебель
                  </div>
                  <div className={`mt-3 p-3 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/8' : 'bg-green-50 border-green-100'}`}>
                    <p className="text-emerald-400 text-xs font-medium mb-1">✓ Расстановка готова — 6 предметов</p>
                    <p className={`text-xs ${subtext}`}>Кровать поставил у дальней стены — классическое решение для спальни. Рабочий стол у окна даёт естественный свет...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ФУНКЦИИ ──────────────────────────────────────────── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Возможности</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Всё для проектирования</h2>
            <p className={`text-lg max-w-xl mx-auto ${subtext}`}>
              Полный набор инструментов для создания идеального интерьера
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
                className={`p-6 rounded-2xl border transition-all duration-300 group cursor-default ${cardBg}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${subtext}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── НОРМЫ ────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Превью модального окна норм */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="float order-2 lg:order-1"
            >
              <div className={`rounded-2xl border overflow-hidden shadow-xl ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
                <div className={`p-5 border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Проверка размещения</h3>
                  <p className={`text-sm mt-0.5 ${subtext}`}>Найдено замечаний: 3</p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {[
                    { level: 'error',   color: 'red',    title: 'Неправильное размещение',    msg: 'Сантехника установлена вне санузла ' },
                    { level: 'warning', color: 'yellow', title: 'Эргономика',                msg: 'Проход между диваном и столом менее 60 см' },
                    { level: 'advice',  color: 'orange', title: 'Рекомендация',              msg: 'Холодильник установлен рядом с плитой — нежелательно' },
                  ].map(item => (
                    <div key={item.title} className={`p-3 rounded-xl border ${
                      item.color === 'red'    ? 'bg-red-500/10 border-red-500/20' :
                      item.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20' :
                                               'bg-orange-500/10 border-orange-500/20'
                    }`}>
                      <p className={`text-sm font-medium mb-0.5 ${
                        item.color === 'red' ? 'text-red-400' : item.color === 'yellow' ? 'text-yellow-400' : 'text-orange-400'
                      }`}>{item.title}</p>
                      <p className={`text-xs ${subtext}`}>{item.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="order-1 lg:order-2"
            >
              <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Безопасность</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Рекомендации планировки</h2>
              <p className={`text-lg mb-6 leading-relaxed ${subtext}`}>
                Сервис автоматически проверяет расстановку мебели 
                и даёт рекомендации по улучшению планировки.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { color: 'text-red-400',    label: 'Неправильное размещение',   desc: 'Критические ошибки' },
                  { color: 'text-yellow-400', label: 'Эргономика',       desc: 'Проходы, зоны доступа, удобство' },
                  { color: 'text-orange-400', label: 'Рекомендации',     desc: 'Советы по улучшению планировки' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')}`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.label}</span>
                    <span className={`text-sm ${subtext}`}>— {item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: `${accent}12` }} />
        </div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-3xl mx-auto relative"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Готов спроектировать
            <br />
            <span className={isDark ? 'animated-gradient-dark' : 'animated-gradient-light'}>идеальный дом?</span>
          </h2>
          <p className={`text-xl mb-10 ${subtext}`}>
            Открой каталог планировок и начни проектировать прямо сейчас — бесплатно, без регистрации.
          </p>
          <Link to="/catalog"
            className={`inline-block px-10 py-5 rounded-2xl text-white font-semibold text-xl transition-all duration-200 hover:scale-105 ${btnPrimary}`}
            style={{ boxShadow: `0 12px 40px ${accent}40` }}
          >
            Начать проектирование
          </Link>
        </motion.div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className={`py-10 px-6 border-t ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`text-sm ${subtext}`}>
            Дипломная работа · НИУ МГСУ · Институт ИСТАС · 2026
          </div>
          <div className={`text-sm ${subtext}`}>
            Разработано с использованием React, Three.js 
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home