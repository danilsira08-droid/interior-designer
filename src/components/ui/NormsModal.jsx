import { motion, AnimatePresence } from 'framer-motion'

const LEVEL_CONFIG = {
  error:   { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',       dot: 'bg-red-400',    label: 'Нарушение нормы' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400', label: 'Рекомендация' },
  advice:  { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400', label: 'Совет' },
}

function ViolationCard({ v, onGoTo }) {
  const cfg = LEVEL_CONFIG[v.level]
  return (
    <div className={`p-3 rounded-xl border ${cfg.bg} mb-2`}>
      <div className="flex items-start gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mt-1.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`text-sm ${cfg.color} font-medium`}>{cfg.label}</p>
            {/* Кнопка перехода к объекту */}
            {onGoTo && v.objectIds && v.objectIds.length > 0 && (
              <button
                onClick={() => onGoTo(v.objectIds[0])}
                className={`shrink-0 text-xs px-2.5 py-1 rounded-lg transition-all hover:scale-105 ${cfg.color} border ${cfg.bg}`}
              >
                Перейти →
              </button>
            )}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">{v.message}</p>
          {v.sourceUrl && (
            <a href={v.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors mt-1 block">
              Читать норму →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function NormsModal({ violations, onClose, onGoToObject }) {
  const errors   = violations.filter(v => v.level === 'error')
  const warnings = violations.filter(v => v.level === 'warning')
  const advice   = violations.filter(v => v.level === 'advice')

  const handleGoTo = (objectId) => {
    onGoToObject(objectId)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Анализ планировки</h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              {violations.length === 0
                ? 'Всё в порядке'
                : `${violations.length} ${violations.length === 1 ? 'замечание' : violations.length < 5 ? 'замечания' : 'замечаний'}`}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Контент */}
        <div className="overflow-y-auto flex-1 p-4">
          {violations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l5 5L22 8" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-emerald-400 font-medium text-lg">Отличная планировка</p>
              <p className="text-zinc-500 text-sm mt-1">Нарушений и замечаний не обнаружено</p>
            </div>
          ) : (
            <>
              {errors.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"/>
                    Нарушения норм · {errors.length}
                  </p>
                  {errors.map((v, i) => <ViolationCard key={i} v={v} onGoTo={handleGoTo} />)}
                </div>
              )}
              {warnings.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block"/>
                    Рекомендации · {warnings.length}
                  </p>
                  {warnings.map((v, i) => <ViolationCard key={i} v={v} onGoTo={handleGoTo} />)}
                </div>
              )}
              {advice.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block"/>
                    Советы · {advice.length}
                  </p>
                  {advice.map((v, i) => <ViolationCard key={i} v={v} onGoTo={handleGoTo} />)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all"
          >
            Продолжить редактирование
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default NormsModal