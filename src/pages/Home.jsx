import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSiteTheme } from '../context/ThemeContext'

function FloatingObject({ isDark }) {
  const meshRef  = useRef()
  const mesh2Ref = useRef()
  const mesh3Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
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
      mesh3Ref.current.position.y = Math.sin(t * 0.6 + 2) * 0.25
    }
  })

  const c1 = isDark ? '#7c3aed' : '#f97316'
  const c2 = isDark ? '#a855f7' : '#fbbf24'
  const c3 = isDark ? '#ec4899' : '#fb923c'

  return (
    <>
      <mesh ref={meshRef} position={[2.5, 0, 0]}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshBasicMaterial color={c1} wireframe opacity={0.25} transparent />
      </mesh>
      <mesh ref={mesh2Ref} position={[2.5, 0, 0]}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial color={c2} wireframe opacity={0.18} transparent />
      </mesh>
      <mesh ref={mesh3Ref} position={[-2.8, 0.5, -1]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color={c3} wireframe opacity={0.18} transparent />
      </mesh>
    </>
  )
}

function Background3D({ isDark }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true }}
    >
      <FloatingObject isDark={isDark} />
    </Canvas>
  )
}

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] } })
}

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: '3D-редактор',
    desc: 'Полноценный трёхмерный редактор прямо в браузере. Перетаскивайте, вращайте и удаляйте мебель без установки дополнительных программ.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Смета бюджета',
    desc: 'Автоматический расчёт примерной стоимости мебели и отделочных материалов с указанием источников цен и применяемых формул.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 20L22 2M4 18l4-4M10 12l4-4M16 6l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 14v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 2h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Инструмент замеров',
    desc: 'Измеряйте расстояния прямо в 3D-пространстве — кликните две точки и получите точный размер в метрах.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v12M9 12l3 3 3-3M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Экспорт PDF и PNG',
    desc: 'Сохраните готовый дизайн-проект: скриншот планировки, список мебели, смета расходов — всё в одном документе.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Просмотр от первого лица',
    desc: 'Войдите внутрь и пройдитесь по квартире — оцените пространство как в реальности ещё до начала ремонта.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Своя планировка',
    desc: 'Загрузите собственную 3D-модель в формате GLB и работайте с ней так же, как с готовыми планировками.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Выберите планировку',
    desc: 'Откройте каталог и выберите подходящую планировку из 12 вариантов. Или загрузите свою модель в формате GLB.',
  },
  {
    num: '02',
    title: 'Расставьте мебель',
    desc: 'Используйте 3D-редактор: выбирайте предметы из реального каталога на 60+ позиций и размещайте их по своему усмотрению.',
  },
  {
    num: '03',
    title: 'Получите смету и экспортируйте',
    desc: 'Сервис автоматически рассчитает примерный бюджет на мебель и материалы отделки. Экспортируйте проект в PDF одним кликом.',
  },
]

export default function Home() {
  const { isDark } = useSiteTheme()

  const bg         = isDark ? 'bg-zinc-950 text-white'  : 'bg-white text-zinc-900'
  const sub        = isDark ? 'text-zinc-400'            : 'text-zinc-500'
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
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .grad-dark  { background:linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .grad-light { background:linear-gradient(135deg,#f97316,#fbbf24,#f97316); background-size:200% 200%; animation:gradientShift 4s ease infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0"><Background3D isDark={isDark} /></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: glowColor }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className={`mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm ${badgeBg}`}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
            Веб-приложение дизайна интерьера 
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
          >
            Спроектируйте
            <br />
            <span className={isDark ? 'grad-dark' : 'grad-light'}>свой дом.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className={`max-w-2xl mx-auto text-xl mb-3 leading-relaxed ${sub}`}
          >
            3D-редактор интерьера с примерным расчетом бюджета, инструментом замера и экспортом в PDF.
            12 готовых планировок квартир и поддержка собственных моделей.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex items-center justify-center gap-4 flex-wrap mt-10"
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
              Возможности
            </a>
          </motion.div>

          {/* Метрики */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex items-center justify-center gap-10 mt-16 flex-wrap"
          >
            {[
              { value: '12',  label: 'планировок' },
              { value: '60+', label: 'предметов мебели' },
              { value: 'PDF', label: 'экспорт' },
              { value: '3D',  label: 'просмотр' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: accent }}>{item.value}</div>
                <div className={`text-sm ${sub}`}>{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs ${sub}`}
        >
          <span>прокрутите вниз</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* КАК РАБОТАЕТ */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Процесс</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Три шага до результата</h2>
            <p className={`text-lg max-w-xl mx-auto ${sub}`}>От выбора планировки до готового расчета</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div key={step.num}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className={`p-8 rounded-2xl border relative overflow-hidden ${stepBg}`}
              >
                <div className="absolute top-4 right-4 text-6xl font-bold opacity-5">{step.num}</div>
                <div className="text-4xl font-bold mb-4" style={{ color: accent }}>{step.num}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className={`leading-relaxed ${sub}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* СМЕТА */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Превью сметы */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="order-2 lg:order-1"
              style={{ animation: 'float 5s ease-in-out infinite' }}
            >
              <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
              <div className={`rounded-2xl border overflow-hidden shadow-xl ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
                <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Расчёты и смета</h3>
                    <p className={`text-xs mt-0.5 ${sub}`}>1-комнатная · 46 м²</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-lg border ${isDark ? 'text-zinc-400 border-white/10' : 'text-zinc-500 border-zinc-200'}`}>PNG</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg text-white" style={{ background: accent }}>PDF</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Площадь',  value: '46 м²',   accent: true },
                      { label: 'Мебель',   value: '16.8 м²' },
                      { label: 'Свободно', value: '29.2 м²' },
                    ].map(item => (
                      <div key={item.label} className={`p-2.5 rounded-xl border text-center ${item.accent ? 'bg-violet-500/10 border-violet-500/20' : isDark ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                        <div className={`text-xs mb-0.5 ${sub}`}>{item.label}</div>
                        <div className={`font-bold text-sm ${item.accent ? 'text-violet-400' : isDark ? 'text-white' : 'text-zinc-900'}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className={`text-xs p-2.5 rounded-xl border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-100 bg-zinc-50'}`}>
                    {[
                      ['Кровать King Size', '85 000 ₽'],
                      ['Кухонный гарнитур', '120 000 ₽'],
                      ['Диван серый',       '105 000 ₽'],
                    ].map(([name, price]) => (
                      <div key={name} className="flex justify-between py-1">
                        <span className={sub}>{name}</span>
                        <span className="text-violet-400 font-medium">~{price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Ориентировочная сумма</span>
                    <span className="text-lg font-bold text-emerald-400">~520 000 ₽</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="order-1 lg:order-2"
            >
              <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Смета и экспорт</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Знайте бюджет
                <br />
                <span className={isDark ? 'grad-dark' : 'grad-light'}>до начала ремонта</span>
              </h2>
              <p className={`text-lg mb-6 leading-relaxed ${sub}`}>
                Сервис автоматически рассчитывает примерную стоимость мебели и материалов для отделки.
                Получите полную смету одним кликом и экспортируйте в PDF со скриншотом планировки.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '💰', text: 'Стоимость каждого предмета мебели из каталога' },
                  { icon: '🎨', text: 'Расход материалов' },
                  { icon: '📊', text: 'Итоговый бюджет: мебель + материалы отделки' },
                  { icon: '📄', text: 'Экспорт в PDF со скриншотом планировки' },
                  { icon: '🔗', text: 'Ссылки на источники цен' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className={sub}>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ФУНКЦИИ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className={`text-sm uppercase tracking-widest mb-3 ${accentText}`}>Возможности</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Всё для проектирования</h2>
            <p className={`text-lg max-w-xl mx-auto ${sub}`}>Полный набор инструментов в одном сервисе</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
                className={`p-6 rounded-2xl border transition-all duration-300 group cursor-default ${cardBg}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${accent}15`, color: accent }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: `${accent}12` }} />
        </div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-3xl mx-auto relative"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Готовы начать?
            <br />
            <span className={isDark ? 'grad-dark' : 'grad-light'}>Это бесплатно.</span>
          </h2>
          <p className={`text-xl mb-10 ${sub}`}>
            Откройте каталог планировок и спроектируйте интерьер прямо сейчас.
          </p>
          <Link to="/catalog"
            className={`inline-block px-10 py-5 rounded-2xl text-white font-semibold text-xl transition-all duration-200 hover:scale-105 ${btnPrimary}`}
            style={{ boxShadow: `0 12px 40px ${accent}40` }}
          >
            Открыть редактор
          </Link>
        </motion.div>
      </section>

      <footer className={`py-10 px-6 border-t ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`text-sm ${sub}`}>Сервис проектирования интерьера · 2026</div>
          <div className={`text-sm ${sub}`}>React · Three.js · WebGL</div>
        </div>
      </footer>
    </main>
  )
}