import { useParams, Link } from 'react-router-dom'
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

function Apartment() {
  const { id } = useParams()
  const apt = apartments.find(a => a.id === id)

  if (!apt) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Квартира не найдена</p>
          <Link to="/catalog" className="text-violet-400 hover:text-violet-300">
            Вернуться в каталог
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24 pb-20">

      {/* Хлебные крошки */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="flex items-center gap-2 text-sm text-zinc-500"
        >
          <Link to="/catalog" className="hover:text-white transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-zinc-300">{apt.title}</span>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

        {/* Левая колонка — превью */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
        >
          {/* Главное фото / заглушка */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-violet-900/20 to-zinc-900 h-80 flex items-center justify-center mb-4 border border-white/5">
            <div className="text-center">
              <div className="text-8xl font-bold text-white/5 mb-2">{apt.rooms}К</div>
              <div className="text-zinc-500">{apt.area} м² · {apt.rooms}-комнатная</div>
            </div>
          </div>

          {/* Миниатюры */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="rounded-xl bg-white/[0.03] border border-white/5 h-20 flex items-center justify-center text-zinc-700 text-xs">
                фото {n}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Правая колонка — информация */}
        <div>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
          >
            <span className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3 block">
              {apt.rooms}-комнатная квартира
            </span>
            <h1 className="text-4xl font-bold mb-4">{apt.title}</h1>
            <p className="text-zinc-400 leading-relaxed mb-8">{apt.description}</p>
          </motion.div>

          {/* Характеристики */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {[
              { label: 'Площадь', value: `${apt.area} м²` },
              { label: 'Комнат', value: apt.rooms },
              { label: 'Этаж', value: apt.floor },
              { label: 'Высота потолков', value: `${apt.ceilingHeight} м` },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-zinc-500 text-xs mb-1">{item.label}</div>
                <div className="text-white font-semibold">{item.value}</div>
              </div>
            ))}
          </motion.div>

          {/* Особенности */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mb-8"
          >
            <p className="text-zinc-500 text-sm mb-3">Особенности</p>
            <div className="flex flex-wrap gap-2">
              {apt.features.map(f => (
                <span key={f} className="text-sm text-zinc-300 border border-white/10 px-3 py-1.5 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA кнопка */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
          >
            <Link
              to={`/editor/${apt.id}`}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18 10L10 18M2 10h16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Спроектировать интерьер
            </Link>
            <p className="text-center text-zinc-600 text-sm mt-3">
              Откроется 3D-редактор с этой планировкой
            </p>
          </motion.div>
        </div>

      </div>

    </main>
  )
}

export default Apartment
