import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

// ─── МАТЕРИАЛЫ ───────────────────────────────────────────────────
// Цены актуальны на май 2025 г.
// Источник: интернет-магазин Лемана ПРО (lemanapro.ru)
const MATERIALS = [
  {
    key:      'paint',
    label:    'Краска для стен (2 слоя)',
    unit:     'л',
    // Расход: 0.11 л/м² × 2 слоя = 0.22 л/м²
    // Норма расхода акриловой краски: 100–120 мл/м²/слой
    ratePerM2: 0.22,
    pricePerUnit: 235,
    formula:  'S_стен × 0.22 л/м²',
    source:   'lemanapro.ru — Краска Luxens 10 л, арт. 84180905 / 84181003',
    sourceUrl:'https://lemanapro.ru/catalogue/kraski-dlya-sten-i-potolkov/matovye-kraski-dlya-sten-i-potolkov/',
  },
  {
    key:      'primer',
    label:    'Грунтовка (1 слой)',
    unit:     'л',
    // Расход грунтовки: 0.15 л/м² — стандартный расход по технической документации
    ratePerM2: 0.15,
    pricePerUnit: 100,
    formula:  'S_стен × 0.15 л/м²',
    source:   'lemanapro.ru — Грунтовка акриловая, средняя цена по каталогу',
    sourceUrl:'https://lemanapro.ru/catalogue/gruntovki/',
  },
  {
    key:      'laminate',
    label:    'Ламинат 32 класса (+10% запас)',
    unit:     'м²',
    // +10% запас на подрезку — стандарт при укладке
    ratePerM2: 1.10,
    pricePerUnit: 360,
    formula:  'S_пола × 1.10',
    source:   'lemanapro.ru — «Дуб современный» 32 кл. арт. 13850434 (418 ₽/м²), «Дуб Монолит» 32 кл. арт. 82008038 (306 ₽/м²). Среднее: 362 ₽/м²',
    sourceUrl:'https://lemanapro.ru/catalogue/laminat/klass-32/',
  },
  {
    key:      'underlay',
    label:    'Подложка под ламинат (+5% запас)',
    unit:     'м²',
    ratePerM2: 1.05,
    pricePerUnit: 60,
    formula:  'S_пола × 1.05',
    source:   'lemanapro.ru — Подложка вспененный полиэтилен 2 мм, от 588 ₽/10 м²',
    sourceUrl:'https://lemanapro.ru/catalogue/podlozhka-pod-napolnye-pokrytiya/pod-laminat/',
  },
  {
    key:      'baseboard',
    label:    'Плинтус напольный (+10% запас)',
    unit:     'пм',
    ratePerM2: null, // считается от периметра, не площади
    pricePerUnit: 235,
    formula:  'Периметр × 1.10',
    source:   'lemanapro.ru — Плинтус МДФ 2.4 м, 565 ₽/шт = 235 ₽/пм',
    sourceUrl:'https://lemanapro.ru/catalogue/napolnye-pokrytiya/napolnye-plintusy-porogi-i-aksessuary/napolnye-plintusy/',
  },
]

// ─── МЕБЕЛЬ — ориентировочные цены ───────────────────────────────
// Цены ориентировочные, основаны на средних розничных ценах 2024–2025 г.
const FURNITURE_PRICES = {
  'bed-kingsize': 85000, 'bed-floss': 95000,
  'bed-1': 45000, 'bed-2': 55000,
  'wardrobe-nordic': 72000, 'wardrobe-classic': 65000,
  'wardrobe-1': 60000, 'wardrobe-2': 75000,
  'commod-bristol': 35000, 'mirror': 12000,
  'wall-shelf': 8000, 'shelf': 18000,
  'computer-desk-apple': 42000,
  'sofa-leather': 110000, 'sofa-polly': 95000,
  'sofa-grey-fabric': 105000, 'sofa-kelly': 85000,
  'sofa-vivente': 90000, 'sofa-1': 65000,
  'tv-set': 45000, 'livingroom-cabinet': 28000,
  'carpet-beige': 18000, 'carpet-designer': 22000, 'carpet-designer2': 15000,
  'puff': 12000, 'chair-1': 9000, 'curtains': 22000,
  'kitchen-set': 120000, 'kitchen-set2': 180000, 'kitchen-set3': 160000,
  'fridge': 65000, 'table-dinner': 95000,
  'kitchen-table-wood': 32000, 'kitchen-chair-wood': 8500,
  'bath': 38000, 'bathtub': 55000,
  'toilet': 18000, 'toilet2': 22000, 'toilet3': 24000,
  'bath-kit': 45000, 'bath-kit2': 62000, 'bath-kit3': 38000, 'bath-kit4': 75000,
  'shower': 85000, 'toilet-brush': 1500, 'trash-can': 2500,
}

// ─── РАСЧЁТ ───────────────────────────────────────────────────────
function calculate(apt, items) {
  const area = apt.area
  const h    = apt.ceilingHeight || 2.7

  // Периметр через площадь (приближение для прямоугольной комнаты)
  // P = 4 × √S — формула для квадратной комнаты, используется как оценка
  const perimeter = Math.round(4 * Math.sqrt(area) * 10) / 10

  // Площадь стен за вычетом проёмов (коэффициент 0.85)
  // 0.85 — стандартный коэффициент в строительстве: ~15% площади стен занято дверями и окнами
  const wallArea = Math.round(perimeter * h * 0.85 * 10) / 10

  const furnitureArea = Math.round(
    items.reduce((sum, i) => sum + i.size[0] * i.size[2], 0) * 10
  ) / 10
  const freeArea = Math.round((area - furnitureArea) * 10) / 10

  // Расчёт материалов
  const mats = {}
  let materialsTotal = 0
  MATERIALS.forEach(m => {
    const qty = m.key === 'baseboard'
      ? Math.ceil(perimeter * 1.10 * 10) / 10
      : Math.ceil(
          (m.key === 'paint' || m.key === 'primer' ? wallArea : area)
          * m.ratePerM2 * 10
        ) / 10
    const cost = Math.round(qty * m.pricePerUnit)
    mats[m.key] = { qty, cost }
    materialsTotal += cost
  })

  const furnitureTotal = items.reduce(
    (sum, i) => sum + (FURNITURE_PRICES[i.catalogId] || 0), 0
  )

  return {
    area, h, perimeter, wallArea,
    furnitureArea, freeArea,
    mats, materialsTotal, furnitureTotal,
  }
}

// Транслитерация для PDF
function tr(text) {
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
    'с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh',
    'щ':'shch','ъ':"'",'ы':'y','ь':"'",'э':'e','ю':'yu','я':'ya',
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z',
    'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R',
    'С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh',
    'Щ':'Shch','Ъ':"'",'Ы':'Y','Ь':"'",'Э':'E','Ю':'Yu','Я':'Ya',
  }
  return String(text).split('').map(c => map[c] || c).join('')
}

function saveScreenshot(canvasRef) {
  const canvas = canvasRef?.current?.querySelector('canvas')
  if (!canvas) return
  const a = document.createElement('a')
  a.download = `interior-${Date.now()}.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}

async function exportPDF(apt, items, calc, canvasRef) {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210, M = 15
    let y = M

    // Шапка
    doc.setFillColor(18, 18, 28)
    doc.rect(0, 0, W, 36, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18); doc.setFont('helvetica', 'bold')
    doc.text('Interior Design Project', M, 15)
    doc.setFontSize(10); doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 190)
    doc.text(`${tr(apt.title)} ${tr(apt.subtitle || '')} · ${apt.area} m2 · Floor ${apt.floor}`, M, 24)
    doc.text('NIU MGSU · 2025 · lemanapro.ru', M, 32)
    y = 44

    // Скриншот
    const canvas = canvasRef?.current?.querySelector('canvas')
    if (canvas) {
      try {
        const img = canvas.toDataURL('image/jpeg', 0.85)
        const iw = W - M * 2
        const ih = Math.min(iw * canvas.height / canvas.width, 72)
        doc.addImage(img, 'JPEG', M, y, iw, ih)
        y += ih + 6
      } catch (e) {}
    }

    // Характеристики
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(18, 18, 28)
    doc.text('Apartment characteristics', M, y); y += 7
    doc.setFontSize(9); doc.setFont('helvetica', 'normal')
    const chars = [
      ['Total area', `${calc.area} m2`],
      ['Ceiling height', `${calc.h} m`],
      ['Wall area (approx.)', `${calc.wallArea} m2`],
      ['Perimeter (approx.)', `${calc.perimeter} lm`],
      ['Furniture area', `${calc.furnitureArea} m2`],
      ['Free area', `${calc.freeArea} m2`],
    ]
    chars.forEach(([l, v]) => {
      doc.setTextColor(100, 100, 130); doc.text(l, M, y)
      doc.setTextColor(18, 18, 28);   doc.text(v, 110, y)
      y += 5.5
    })

    // Зонирование
    if (apt.rooms_data) {
      y += 3
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(18, 18, 28)
      doc.text('Zoning', M, y); y += 7
      doc.setFontSize(9); doc.setFont('helvetica', 'normal')
      Object.values(apt.rooms_data).forEach(z => {
        doc.setTextColor(100, 100, 130); doc.text(tr(z.name), M, y)
        doc.setTextColor(18, 18, 28);   doc.text(`${z.area} m2`, 110, y)
        y += 5.5
      })
    }

    // Мебель
    if (y > 230) { doc.addPage(); y = M }
    y += 3
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(18, 18, 28)
    doc.text('Furniture list', M, y); y += 7
    doc.setFontSize(9); doc.setFont('helvetica', 'normal')
    let fTotal = 0
    items.forEach((item, i) => {
      if (y > 272) { doc.addPage(); y = M }
      const price = FURNITURE_PRICES[item.catalogId] || 0; fTotal += price
      doc.setTextColor(100, 100, 130); doc.text(`${i + 1}.`, M, y)
      doc.setTextColor(18, 18, 28);   doc.text(tr(item.title), M + 6, y)
      doc.text(`${item.size[0]}x${item.size[2]} m`, 110, y)
      if (price) { doc.setTextColor(80, 80, 200); doc.text(`~${price.toLocaleString()} RUB`, 145, y) }
      y += 5.5
    })
    y += 2
    doc.setDrawColor(200, 200, 220); doc.line(M, y, W - M, y); y += 5
    doc.setFont('helvetica', 'bold'); doc.setTextColor(80, 80, 200)
    doc.text('Furniture subtotal (approx.):', M, y)
    doc.text(`~${fTotal.toLocaleString()} RUB`, 145, y); y += 10

    // Материалы
    if (y > 240) { doc.addPage(); y = M }
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(18, 18, 28)
    doc.text('Materials estimate', M, y); y += 4
    doc.setFontSize(8); doc.setFont('helvetica', 'italic'); doc.setTextColor(130, 130, 160)
    doc.text('Prices as of May 2025. Source: lemanapro.ru', M, y); y += 6
    doc.setFontSize(9); doc.setFont('helvetica', 'normal')
    let mTotal = 0
    MATERIALS.forEach(mat => {
      if (y > 272) { doc.addPage(); y = M }
      const { qty, cost } = calc.mats[mat.key]
      mTotal += cost
      doc.setTextColor(100, 100, 130); doc.text(tr(mat.label), M, y)
      doc.setTextColor(18, 18, 28);   doc.text(`${qty} ${tr(mat.unit)}`, 110, y)
      doc.setTextColor(80, 80, 200);  doc.text(`~${cost.toLocaleString()} RUB`, 145, y)
      y += 5.5
    })
    y += 2
    doc.setDrawColor(200, 200, 220); doc.line(M, y, W - M, y); y += 5
    doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 150, 90)
    doc.text('TOTAL (furniture + materials, approx.):', M, y)
    doc.text(`~${(fTotal + mTotal).toLocaleString()} RUB`, 145, y)

    // Подвал
    const pages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i)
      doc.setFontSize(7); doc.setTextColor(160, 160, 180)
      doc.text(`Page ${i} of ${pages} · NIU MGSU · 2025 · All prices are approximate`, M, 290)
    }

    doc.save(`interior-${apt.id}-${Date.now()}.pdf`)
  } catch (e) {
    console.error('PDF export error:', e)
  }
}

// ─── КОМПОНЕНТ ────────────────────────────────────────────────────
function CalculationsModal({ isOpen, onClose, items, apt, canvasRef }) {
  const calc = useMemo(() => apt ? calculate(apt, items) : null, [apt, items])
  if (!apt || !calc) return null

  const isDark = true // всегда тёмная тема в редакторе

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-white font-bold text-lg">Расчёты</h2>
                <p className="text-zinc-500 text-xs mt-0.5">{apt.title} {apt.subtitle} · {apt.area} м²</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => saveScreenshot(canvasRef)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="1" y="2.5" width="11" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="6.5" cy="6.7" r="2" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4.5 2.5V2C4.5 1.4 5 1 5.5 1h2c.5 0 1 .4 1 1v.5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  PNG
                </button>
                <button onClick={() => exportPDF(apt, items, calc, canvasRef)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white bg-violet-600 hover:bg-violet-500 transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1v8M4 6l2.5 3 2.5-3M2 10.5v1a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  PDF
                </button>
                <button onClick={onClose} className="ml-1 text-zinc-500 hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Контент */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

              {/* ── Площадь ────────────────────────────────────── */}
              <section>
                <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Площадь</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <div className="text-xs text-zinc-500 mb-1">Общая площадь</div>
                    <div className="text-lg font-bold text-violet-400">{calc.area} <span className="text-sm font-normal text-zinc-500">м²</span></div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-xs text-zinc-500 mb-1">Занято мебелью</div>
                    <div className="text-lg font-bold text-white">{calc.furnitureArea} <span className="text-sm font-normal text-zinc-500">м²</span></div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-xs text-zinc-500 mb-1">Свободная площадь</div>
                    <div className="text-lg font-bold text-white">{calc.freeArea} <span className="text-sm font-normal text-zinc-500">м²</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Высота потолков', value: `${calc.h} м` },
                    { label: 'Периметр (прибл.)', value: `${calc.perimeter} пм` },
                    { label: 'Площадь стен (прибл.)', value: `${calc.wallArea} м²` },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="text-xs text-zinc-600 mb-1">{item.label}</div>
                      <div className="text-sm font-medium text-zinc-300">{item.value}</div>
                    </div>
                  ))}
                </div>
                {/* Формулы */}
                <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-zinc-600 mb-1.5 uppercase tracking-widest">Формулы расчёта</p>
                  <div className="space-y-1">
                    {[
                      ['Периметр', 'P = 4 × √S', 'приближение для прямоугольной комнаты'],
                      ['Площадь стен', 'S_стен = P × H × 0.85', '0.85 — коэффициент за вычетом проёмов (~15%)'],
                    ].map(([name, formula, note]) => (
                      <div key={name} className="flex items-start gap-2 text-xs">
                        <span className="text-zinc-500 w-28 shrink-0">{name}:</span>
                        <span className="font-mono text-violet-400">{formula}</span>
                        <span className="text-zinc-600">— {note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── Зонирование ────────────────────────────────── */}
              {apt.rooms_data && (
                <section>
                  <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Зонирование</h3>
                  <div className="space-y-2">
                    {Object.values(apt.rooms_data).map(zone => (
                      <div key={zone.name} className="flex items-center gap-3">
                        <span className="text-sm text-zinc-400 w-44 shrink-0">{zone.name}</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500/50"
                            style={{ width: `${Math.min((zone.area / apt.area) * 100, 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white w-14 text-right">{zone.area} м²</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Мебель ─────────────────────────────────────── */}
              {items.length > 0 && (
                <section>
                  <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                    Список мебели — {items.length} позиций
                  </h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 mb-3">
                    {items.map((item, i) => {
                      const price = FURNITURE_PRICES[item.catalogId]
                      return (
                        <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-xs text-zinc-600 w-5 text-center shrink-0">{i + 1}</span>
                          {item.icon && <img src={item.icon} alt="" className="w-9 h-9 rounded-lg object-contain bg-white/5 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-200 truncate">{item.title}</p>
                            <p className="text-xs text-zinc-600">{item.size[0]} × {item.size[2]} м</p>
                          </div>
                          {price
                            ? <span className="text-xs text-zinc-400 shrink-0">~{price.toLocaleString('ru-RU')} ₽</span>
                            : <span className="text-xs text-zinc-700 shrink-0">нет данных</span>
                          }
                        </div>
                      )
                    })}
                  </div>
                  {calc.furnitureTotal > 0 && (
                    <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/8">
                      <span className="text-sm text-zinc-400">Ориентировочная стоимость мебели</span>
                      <span className="text-base font-bold text-white">~{calc.furnitureTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  <p className="text-xs text-zinc-600 mt-1.5 px-1">
                    Цены ориентировочные, основаны на средних розничных ценах 2024–2025 г.
                  </p>
                </section>
              )}

              {/* ── Материалы ──────────────────────────────────── */}
              <section>
                <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Расход и стоимость материалов</h3>
                <div className="rounded-xl border border-white/5 overflow-hidden mb-3">
                  {/* Заголовок таблицы */}
                  <div className="grid grid-cols-12 px-3 py-2 bg-white/[0.03] border-b border-white/5">
                    <span className="col-span-5 text-xs text-zinc-600">Материал</span>
                    <span className="col-span-2 text-xs text-zinc-600 text-right">Формула</span>
                    <span className="col-span-2 text-xs text-zinc-600 text-right">Кол-во</span>
                    <span className="col-span-3 text-xs text-zinc-600 text-right">Стоимость</span>
                  </div>
                  {MATERIALS.map(mat => {
                    const { qty, cost } = calc.mats[mat.key]
                    return (
                      <div key={mat.key} className="grid grid-cols-12 px-3 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                        <div className="col-span-5">
                          <p className="text-sm text-zinc-300">{mat.label}</p>
                          <a href={mat.sourceUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-zinc-600 hover:text-violet-400 transition-colors truncate block"
                            title={mat.source}
                          >
                            {mat.source.split('—')[0].trim()} →
                          </a>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <span className="text-xs font-mono text-zinc-600">{mat.formula}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <span className="text-sm text-zinc-300">{qty} {mat.unit}</span>
                        </div>
                        <div className="col-span-3 flex items-center justify-end">
                          <span className="text-sm text-zinc-300">~{cost.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Итог */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/8">
                    <span className="text-sm text-zinc-400">Ориентировочная стоимость материалов</span>
                    <span className="text-base font-bold text-white">~{calc.materialsTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {calc.furnitureTotal > 0 && (
                    <div className="flex justify-between items-center px-3 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Итого (мебель + материалы)</p>
                        <p className="text-xs text-zinc-600 mt-0.5">ориентировочная сумма</p>
                      </div>
                      <span className="text-xl font-bold text-emerald-400">
                        ~{(calc.furnitureTotal + calc.materialsTotal).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  )}
                </div>

                {/* Дисклеймер */}
                <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Все расчёты ориентировочные. Цены на материалы актуальны на май 2025 г.,
                    источник — интернет-магазин Лемана ПРО (lemanapro.ru). Точные данные
                    уточняйте у поставщиков.
                  </p>
                </div>
              </section>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CalculationsModal