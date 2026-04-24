import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }
  })
}

function Home() {
  return (
    <main className="bg-zinc-950 text-white">

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Дипломный проект · МГСУ 2025
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
        >
          Спроектируй
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
            свой дом.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="max-w-xl text-lg text-zinc-400 mb-10 leading-relaxed"
        >
          Выбери планировку квартиры и расставь мебель в интерактивном
          3D-редакторе прямо в браузере — без установки программ.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex items-center gap-4"
        >
          <Link
            to="/catalog"
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all duration-200 hover:scale-105"
          >
            Смотреть планировки
          </Link>
          <a
            href="#how"
            className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all duration-200"
          >
            Как это работает
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-xs"
        >
          <span>прокрути вниз</span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent" />
        </motion.div>

      </section>

      <section id="how" className="py-32 px-6 max-w-5xl mx-auto">

        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Три шага до результата
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              number: '01',
              title: 'Выбери планировку',
              desc: 'Открой каталог и выбери квартиру с подходящей площадью и количеством комнат.'
            },
            {
              number: '02',
              title: 'Расставь мебель',
              desc: 'В 3D-редакторе перетаскивай мебель по комнате и смотри результат в реальном времени.'
            },
            {
              number: '03',
              title: 'Проверь нормы',
              desc: 'Сервис автоматически проверяет соблюдение строительных норм СП 54.13330 и укажет на ошибки.'
            },
          ].map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300"
            >
              <div className="text-5xl font-bold text-violet-400/30 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </section>

      <section className="py-32 px-6 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-5xl font-bold mb-6">
            Готов попробовать?
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            Открой каталог планировок и начни проектировать прямо сейчас.
          </p>
          <Link
            to="/catalog"
            className="inline-block px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-lg transition-all duration-200 hover:scale-105"
          >
            Открыть каталог
          </Link>
        </motion.div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5 text-center text-zinc-600 text-sm">
        Дипломная работа · НИУ МГСУ · 2025
      </footer>

    </main>
  )
}

export default Home
