import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apartments } from '../data/apartments'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }
  })
}

function Catalog() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-20 px-6">

      {/* Заголовок */}
      <div className="max-w-6xl mx-auto mb-12">
        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-violet-400 text-sm font-medium mb-3 tracking-widest uppercase"
        >
          Каталог
        </motion.p>
        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-5xl font-bold mb-4"
        >
          Выбери планировку
        </motion.h1>
        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-zinc-400 text-lg max-w-xl"
        >
          Открой любую квартиру и спроектируй интерьер в 3D-редакторе
        </motion.p>
      </div>

      {/* Сетка карточек */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {apartments.map((apt, i) => (
          <motion.div
            key={apt.id}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 3}
          >
            <Link to={`/apartment/${apt.id}`} className="group block">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 overflow-hidden">

                {/* Превью — заглушка пока нет фото */}
                <div className="h-56 bg-gradient-to-br from-violet-900/20 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white/5 mb-2">{apt.rooms}К</div>
                    <div className="text-zinc-500 text-sm">{apt.area} м²</div>
                  </div>
                  {/* Стрелка при hover */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Информация */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold">{apt.title}</h2>
                    <span className="text-sm text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                      {apt.area} м²
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 line-clamp-2">
                    {apt.description}
                  </p>

                  {/* Характеристики */}
                  <div className="flex items-center gap-4 text-sm text-zinc-500 mb-5">
                    <span>{apt.rooms}-комн.</span>
                    <span>·</span>
                    <span>{apt.floor} этаж</span>
                    <span>·</span>
                    <span>потолки {apt.ceilingHeight} м</span>
                  </div>

                  {/* Теги */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {apt.features.map(f => (
                      <span key={f} className="text-xs text-zinc-400 border border-white/10 px-3 py-1 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Кнопка */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">Смотреть планировку</span>
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 group-hover:bg-violet-600 flex items-center justify-center transition-colors duration-200">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </main>
  )
}

export default Catalog
