import { motion, AnimatePresence } from 'framer-motion'

const PLANNED_FEATURES = [
  {
    icon: '📐',
    title: 'Проверка проходов',
    desc: 'Система будет проверять наличие достаточных проходов между предметами мебели — не менее 60 см для свободного передвижения по квартире.',
  },
  {
    icon: '🚿',
    title: 'Зонирование санузла',
    desc: 'Проверка правильного размещения сантехники — ванна, унитаз и раковина должны находиться в пределах санузла.',
  },
  {
    icon: '🛏',
    title: 'Доступ к мебели',
    desc: 'Рекомендации по доступу к кровати, шкафу и другим предметам — достаточно ли места чтобы открыть дверцы и комфортно использовать мебель.',
  },
  {
    icon: '🔥',
    title: 'Отопление',
    desc: 'Предупреждение если мебель перекрывает радиаторы отопления — это снижает эффективность обогрева на 20–30%.',
  },
  {
    icon: '💡',
    title: 'Естественное освещение',
    desc: 'Рекомендации по размещению высокой мебели — она не должна закрывать оконные проёмы и ухудшать освещённость.',
  },
  {
    icon: '🚪',
    title: 'Зона двери',
    desc: 'Проверка свободного открывания дверей — в радиусе открывания не должно быть мебели.',
  },
]

function NormsPlaceholderModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white font-bold text-lg">Анализ планировки</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/20">
                в разработке
              </span>
            </div>
            <p className="text-zinc-500 text-xs">Умные рекомендации по расстановке мебели</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Описание */}
        <div className="px-5 py-4 border-b border-white/5 bg-violet-500/5">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Мы работаем над системой умного анализа планировки. После завершения разработки
            сервис будет автоматически проверять расстановку мебели и давать персональные
            рекомендации по улучшению интерьера.
          </p>
        </div>

        {/* Список фич */}
        <div className="overflow-y-auto flex-1 p-4">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Что будет проверяться</p>
          <div className="flex flex-col gap-2">
            {PLANNED_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-200 mb-0.5">{f.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-white/5">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all"
          >
            Понятно
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default NormsPlaceholderModal