import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Пресеты окружения из @react-three/drei
// Превью — реальные скриншоты как выглядит каждое окружение
export const ENVIRONMENTS = [
  {
    id: null,
    label: 'Нейтральный',
    description: 'Стандартный серый фон без окружения',
    preset: null,
    bgColor: '#f0ece4',
    preview: null, // просто цвет
    previewBg: '#e8e4dc',
  },
  {
    id: 'apartment',
    label: 'Апартаменты',
    description: 'Тёплое мягкое освещение жилого пространства',
    preset: 'apartment',
    bgColor: '#e8ddd0',
    preview: null,
    previewBg: '#c8b89a',
  },
  {
    id: 'city',
    label: 'Город',
    description: 'Городская панорама с яркими огнями небоскрёбов',
    preset: 'city',
    bgColor: '#1a2030',
    preview: null,
    previewBg: '#2a3550',
  },
  {
    id: 'dawn',
    label: 'Рассвет',
    description: 'Тёплые оранжево-розовые тона утреннего неба',
    preset: 'dawn',
    bgColor: '#c87040',
    preview: null,
    previewBg: '#e08050',
  },
  {
    id: 'forest',
    label: 'Лес',
    description: 'Мягкий рассеянный свет сквозь листву деревьев',
    preset: 'forest',
    bgColor: '#304020',
    preview: null,
    previewBg: '#486030',
  },
  {
    id: 'lobby',
    label: 'Лобби',
    description: 'Яркое архитектурное освещение современного здания',
    preset: 'lobby',
    bgColor: '#d0c8b8',
    preview: null,
    previewBg: '#e0d8c8',
  },
  {
    id: 'night',
    label: 'Ночь',
    description: 'Тёмное звёздное небо с мягкими огнями города',
    preset: 'night',
    bgColor: '#0a0a1a',
    preview: null,
    previewBg: '#101025',
  },
  {
    id: 'park',
    label: 'Парк',
    description: 'Естественное дневное освещение на открытом воздухе',
    preset: 'park',
    bgColor: '#7090a0',
    preview: null,
    previewBg: '#8090b0',
  },
  {
    id: 'studio',
    label: 'Студия',
    description: 'Профессиональное студийное освещение — белое и равномерное',
    preset: 'studio',
    bgColor: '#e0e0e0',
    preview: null,
    previewBg: '#f0f0f0',
  },
  {
    id: 'sunset',
    label: 'Закат',
    description: 'Золотые тёплые тона закатного солнца',
    preset: 'sunset',
    bgColor: '#e06020',
    preview: null,
    previewBg: '#f07030',
  },
  {
    id: 'warehouse',
    label: 'Склад',
    description: 'Промышленное пространство с рассеянным верхним светом',
    preset: 'warehouse',
    bgColor: '#806040',
    preview: null,
    previewBg: '#907050',
  },
]

// Иконки-превью для каждого окружения (SVG сцены)
function EnvironmentPreview({ env, size = 'large' }) {
  const s = size === 'large' ? 120 : 56

  // Рисуем миниатюрную сцену для каждого типа окружения
  const scenes = {
    null: (
      // Нейтральный — простая комната
      <>
        <rect width={s} height={s} fill="#e8e4dc"/>
        <rect x={s*0.1} y={s*0.4} width={s*0.8} height={s*0.02} fill="#c8c4bc" opacity="0.5"/>
        <rect x={s*0.2} y={s*0.2} width={s*0.6} height={s*0.2} rx="2" fill="#d8d4cc"/>
        <rect x={s*0.35} y={s*0.42} width={s*0.3} height={s*0.4} rx="1" fill="#c8c4bc"/>
      </>
    ),
    city: (
      <>
        <rect width={s} height={s} fill="#0d1520"/>
        {/* Небоскрёбы */}
        {[0.05,0.18,0.30,0.42,0.55,0.68,0.80].map((x, i) => (
          <rect key={i} x={s*x} y={s*(0.2+i%3*0.1)} width={s*0.1} height={s*(0.6-i%3*0.1)} fill={`hsl(${200+i*20},40%,${15+i*3}%)`}/>
        ))}
        {/* Огни */}
        {[...Array(20)].map((_, i) => (
          <rect key={i} x={s*(0.05+Math.sin(i*7)*0.45+0.45)} y={s*(0.25+Math.cos(i*5)*0.25+0.25)} width={2} height={2} fill="#ffee88" opacity={0.7}/>
        ))}
        {/* Отражение на полу */}
        <rect x={0} y={s*0.7} width={s} height={s*0.3} fill="#060c14" opacity="0.8"/>
        <rect x={s*0.3} y={s*0.72} width={s*0.4} height={s*0.02} fill="#ffee44" opacity="0.15"/>
      </>
    ),
    dawn: (
      <>
        <defs>
          <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0a30"/>
            <stop offset="40%" stopColor="#ff4040"/>
            <stop offset="70%" stopColor="#ff8020"/>
            <stop offset="100%" stopColor="#ffcc60"/>
          </linearGradient>
        </defs>
        <rect width={s} height={s} fill="url(#dawn)"/>
        <ellipse cx={s*0.5} cy={s*0.75} rx={s*0.15} ry={s*0.08} fill="#ffdd00" opacity="0.9"/>
        <rect x={0} y={s*0.75} width={s} height={s*0.25} fill="#1a1008"/>
        {/* Деревья */}
        {[0.1,0.25,0.7,0.85].map((x,i) => (
          <polygon key={i} points={`${s*x},${s*0.75} ${s*(x+0.06)},${s*0.75} ${s*(x+0.03)},${s*0.55}`} fill="#0a0804"/>
        ))}
      </>
    ),
    forest: (
      <>
        <defs>
          <linearGradient id="forest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3010"/>
            <stop offset="100%" stopColor="#2a5018"/>
          </linearGradient>
        </defs>
        <rect width={s} height={s} fill="url(#forest)"/>
        {/* Лучи света */}
        {[0.2,0.4,0.6,0.8].map((x,i) => (
          <polygon key={i} points={`${s*x},0 ${s*(x+0.05)},0 ${s*(x+0.15)},${s}`} fill="#88cc44" opacity="0.08"/>
        ))}
        {/* Деревья */}
        {[0,0.15,0.3,0.5,0.65,0.8].map((x,i) => (
          <g key={i}>
            <rect x={s*(x+0.04)} y={s*0.6} width={s*0.02} height={s*0.4} fill="#3a2010"/>
            <ellipse cx={s*(x+0.05)} cy={s*(0.4+i%2*0.1)} rx={s*0.06} ry={s*0.12} fill={`hsl(120,${40+i*5}%,${20+i*3}%)`}/>
          </g>
        ))}
        <rect x={0} y={s*0.8} width={s} height={s*0.2} fill="#1a2808"/>
      </>
    ),
    lobby: (
      <>
        <rect width={s} height={s} fill="#e8e0d0"/>
        {/* Потолок с освещением */}
        <rect x={0} y={0} width={s} height={s*0.15} fill="#f0e8d8"/>
        {[0.2,0.5,0.8].map((x,i) => (
          <ellipse key={i} cx={s*x} cy={s*0.08} rx={s*0.08} ry={s*0.04} fill="#fff8e8" opacity="0.9"/>
        ))}
        {/* Перспектива */}
        <polygon points={`0,${s} ${s*0.3},${s*0.3} ${s*0.7},${s*0.3} ${s},${s}`} fill="#d8d0c0" opacity="0.3"/>
        <rect x={s*0.2} y={s*0.3} width={s*0.6} height={s*0.02} fill="#c0b8a8"/>
        {/* Колонны */}
        {[0.25,0.75].map((x,i) => (
          <rect key={i} x={s*x} y={s*0.3} width={s*0.04} height={s*0.7} fill="#c8c0b0"/>
        ))}
      </>
    ),
    night: (
      <>
        <defs>
          <radialGradient id="night" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#1a1a3a"/>
            <stop offset="100%" stopColor="#000008"/>
          </radialGradient>
        </defs>
        <rect width={s} height={s} fill="url(#night)"/>
        {/* Звёзды */}
        {[...Array(30)].map((_, i) => (
          <circle key={i}
            cx={s*(0.05+Math.abs(Math.sin(i*13))*0.9)}
            cy={s*(0.05+Math.abs(Math.cos(i*7))*0.6)}
            r={Math.random() > 0.8 ? 1.5 : 0.8}
            fill="white" opacity={0.4+Math.sin(i)*0.4}
          />
        ))}
        {/* Луна */}
        <circle cx={s*0.75} cy={s*0.2} r={s*0.07} fill="#fffce8" opacity="0.9"/>
        <circle cx={s*0.78} cy={s*0.18} r={s*0.06} fill="#000814" opacity="0.6"/>
        <rect x={0} y={s*0.7} width={s} height={s*0.3} fill="#050510"/>
      </>
    ),
    park: (
      <>
        <defs>
          <linearGradient id="park" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6090c0"/>
            <stop offset="60%" stopColor="#90b8d8"/>
            <stop offset="100%" stopColor="#c8e0f0"/>
          </linearGradient>
        </defs>
        <rect width={s} height={s} fill="url(#park)"/>
        {/* Облака */}
        <ellipse cx={s*0.3} cy={s*0.2} rx={s*0.15} ry={s*0.06} fill="white" opacity="0.7"/>
        <ellipse cx={s*0.7} cy={s*0.15} rx={s*0.12} ry={s*0.05} fill="white" opacity="0.6"/>
        <rect x={0} y={s*0.65} width={s} height={s*0.35} fill="#4a7030"/>
        {/* Деревья вдали */}
        {[0.1,0.3,0.55,0.75,0.9].map((x,i) => (
          <ellipse key={i} cx={s*x} cy={s*0.62} rx={s*0.05} ry={s*0.08} fill={`hsl(110,${35+i*4}%,25%)`}/>
        ))}
      </>
    ),
    studio: (
      <>
        <rect width={s} height={s} fill="#f0f0f0"/>
        {/* Градиент фона */}
        <defs>
          <radialGradient id="studio" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#d0d0d0"/>
          </radialGradient>
        </defs>
        <rect width={s} height={s} fill="url(#studio)"/>
        {/* Софтбоксы */}
        <rect x={s*0.05} y={s*0.1} width={s*0.15} height={s*0.2} rx="3" fill="white" opacity="0.95"/>
        <rect x={s*0.8} y={s*0.1} width={s*0.15} height={s*0.2} rx="3" fill="white" opacity="0.95"/>
        {/* Объект */}
        <ellipse cx={s*0.5} cy={s*0.5} rx={s*0.15} ry={s*0.15} fill="#e0e0e0"/>
        <ellipse cx={s*0.5} cy={s*0.85} rx={s*0.2} ry={s*0.04} fill="#c0c0c0" opacity="0.5"/>
      </>
    ),
    sunset: (
      <>
        <defs>
          <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0830"/>
            <stop offset="30%" stopColor="#8020a0"/>
            <stop offset="60%" stopColor="#e04010"/>
            <stop offset="80%" stopColor="#f08010"/>
            <stop offset="100%" stopColor="#ffc030"/>
          </linearGradient>
        </defs>
        <rect width={s} height={s} fill="url(#sunset)"/>
        {/* Солнце */}
        <ellipse cx={s*0.5} cy={s*0.7} rx={s*0.12} ry={s*0.06} fill="#ffee00" opacity="0.95"/>
        {/* Отражение на воде */}
        <rect x={0} y={s*0.72} width={s} height={s*0.28} fill="#100818" opacity="0.7"/>
        <rect x={s*0.35} y={s*0.74} width={s*0.3} height={s*0.02} fill="#ffee00" opacity="0.3"/>
        {/* Горизонт */}
        <rect x={0} y={s*0.68} width={s} height={s*0.04} fill="#2a0a20" opacity="0.5"/>
      </>
    ),
    apartment: (
      <>
        <rect width={s} height={s} fill="#d8c8b0"/>
        <defs>
          <radialGradient id="apt" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#fff8e8" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#c8a870" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width={s} height={s} fill="url(#apt)"/>
        {/* Окно */}
        <rect x={s*0.6} y={s*0.1} width={s*0.3} height={s*0.5} fill="#a8c8e8" opacity="0.6"/>
        <rect x={s*0.6} y={s*0.1} width={s*0.02} height={s*0.5} fill="#c8b898"/>
        <rect x={s*0.6} y={s*0.35} width={s*0.3} height={s*0.02} fill="#c8b898"/>
        {/* Мебель */}
        <rect x={s*0.05} y={s*0.55} width={s*0.45} height={s*0.2} rx="3" fill="#a89070"/>
        <rect x={s*0.05} y={s*0.3} width={s*0.35} height={s*0.25} rx="2" fill="#b8a080"/>
      </>
    ),
    warehouse: (
      <>
        <rect width={s} height={s} fill="#5a4030"/>
        {/* Металлический потолок */}
        {[...Array(8)].map((_, i) => (
          <rect key={i} x={0} y={s*i*0.04} width={s} height={s*0.02} fill="#6a5040" opacity="0.5"/>
        ))}
        {/* Фонари сверху */}
        {[0.2,0.5,0.8].map((x,i) => (
          <g key={i}>
            <rect x={s*x} y={0} width={s*0.04} height={s*0.15} fill="#808070"/>
            <ellipse cx={s*(x+0.02)} cy={s*0.15} rx={s*0.06} ry={s*0.03} fill="#fff8e0" opacity="0.9"/>
          </g>
        ))}
        {/* Пол */}
        <rect x={0} y={s*0.7} width={s} height={s*0.3} fill="#3a2818"/>
        {/* Перспектива */}
        <polygon points={`0,${s} ${s*0.4},${s*0.4} ${s*0.6},${s*0.4} ${s},${s}`} fill="#2a1810" opacity="0.4"/>
      </>
    ),
  }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ borderRadius: size === 'large' ? 12 : 8, display: 'block' }}>
      {scenes[env.id] || scenes[null]}
    </svg>
  )
}

function EnvironmentModal({ isOpen, onClose, currentEnv, onSelect, isDark }) {
  const [hovered, setHovered] = useState(null)
  const active = hovered || currentEnv

  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const modalBg = isDark ? 'rgba(9,9,11,0.95)'      : 'rgba(255,255,255,0.95)'
  const txt     = isDark ? '#ffffff' : '#18181b'
  const sub     = isDark ? '#71717a' : '#a1a1aa'
  const cardBg  = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const accent  = isDark ? '#7c3aed' : '#f97316'

  const activeEnv = ENVIRONMENTS.find(e => e.id === active) || ENVIRONMENTS[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="absolute left-4 right-4 bottom-4 z-40 rounded-2xl overflow-hidden flex flex-col"
            style={{
              height: '68vh',
              background: modalBg,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${border}`,
              boxShadow: `0 -8px 60px ${accent}15`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <div>
                <h2 className="font-bold text-base" style={{ color: txt }}>Окружение</h2>
                <p className="text-xs mt-0.5" style={{ color: sub }}>Влияет на освещение и отражения на мебели</p>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 3L3 11M3 3l8 8" stroke={sub} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Превью активного */}
              <div className="w-56 shrink-0 p-4 flex flex-col gap-3"
                style={{ borderRight: `1px solid ${border}` }}
              >
                <EnvironmentPreview env={activeEnv} size="large" />
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: txt }}>{activeEnv.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: sub }}>{activeEnv.description}</p>
                </div>
                <button
                  onClick={() => { onSelect(activeEnv.id); onClose() }}
                  className="w-full py-2 rounded-xl text-white text-sm font-medium mt-auto transition-all hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                >
                  Применить
                </button>
              </div>

              {/* Сетка */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-3 gap-2">
                  {ENVIRONMENTS.map(env => (
                    <motion.button
                      key={env.id ?? 'null'}
                      onClick={() => { onSelect(env.id); onClose() }}
                      onMouseEnter={() => setHovered(env.id)}
                      onMouseLeave={() => setHovered(null)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
                      style={{
                        background: currentEnv === env.id ? `${accent}15` : cardBg,
                        border: `1.5px solid ${currentEnv === env.id ? accent : border}`,
                      }}
                    >
                      <EnvironmentPreview env={env} size="small" />
                      <span className="text-xs font-medium" style={{ color: currentEnv === env.id ? accent : txt }}>
                        {env.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EnvironmentModal