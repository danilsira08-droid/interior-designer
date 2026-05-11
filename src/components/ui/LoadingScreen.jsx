import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSiteTheme } from '../../context/ThemeContext'

const PHRASES = [
  'Загружаем планировку...',
  'Расставляем стены...',
  'Настраиваем освещение...',
  'Расставляем мебель...',
  'Почти готово...',
]

function LoadingScreen({ isLoading, progress = 0 }) {
  const { isDark } = useSiteTheme()
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) return
    const timer = setInterval(() => {
      setPhraseIndex(i => (i + 1) % PHRASES.length)
    }, 900)
    return () => clearInterval(timer)
  }, [isLoading])

  const accent      = isDark ? '#7c3aed' : '#f97316'
  const accentLight = isDark ? '#a855f7' : '#fbbf24'
  const bg          = isDark ? '#09090b' : '#fafaf9'
  const textColor   = isDark ? '#a1a1aa' : '#71717a'
  const titleColor  = isDark ? '#ffffff' : '#18181b'
  const trackColor  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: bg }}
        >
          {/* Фоновое свечение */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
            style={{ background: `${accent}18` }}
          />

          <div className="relative flex flex-col items-center gap-8 px-8 text-center">

            {/* Логотип */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ color: titleColor, fontSize: '1.5rem', fontWeight: 700 }}
            >
              interior<span style={{ color: accent }}>.</span>
            </motion.div>

            {/* Анимация */}
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="relative" style={{ width: 80, height: 80 }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, border: `2px solid ${accent}30`, borderRadius: 20 }}
              />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 14, border: `2px solid ${accent}60`, borderRadius: 12 }}
              />
              <motion.div animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', inset: 28, background: `linear-gradient(135deg, ${accent}, ${accentLight})`, borderRadius: 8 }}
              />
            </motion.div>

            {/* Фраза */}
            <div style={{ height: 24 }}>
              <AnimatePresence mode="wait">
                <motion.p key={phraseIndex}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: textColor, fontSize: '0.875rem' }}
                >
                  {PHRASES[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Прогресс — реальный из useProgress */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ width: 220, height: 3, borderRadius: 99, background: trackColor, overflow: 'hidden' }}
            >
              <div style={{
                height: '100%',
                borderRadius: 99,
                background: `linear-gradient(90deg, ${accent}, ${accentLight})`,
                width: `${Math.min(progress, 100)}%`,
                transition: 'width 0.3s ease',
              }} />
            </motion.div>

            {/* Процент */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ color: textColor, fontSize: '0.75rem' }}
            >
              {Math.round(progress)}%
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
