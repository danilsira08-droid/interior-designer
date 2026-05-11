import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

const MATERIAL_RATES = {
  paint:    { label: 'Краска для стен (2 слоя)',  unit: 'л',  ratePerM2: 0.25, pricePerUnit: 450  },
  primer:   { label: 'Грунтовка',                 unit: 'л',  ratePerM2: 0.15, pricePerUnit: 200  },
  laminate: { label: 'Ламинат (+10% запас)',       unit: 'м²', ratePerM2: 1.10, pricePerUnit: 1800 },
  underlay: { label: 'Подложка (+5% запас)',       unit: 'м²', ratePerM2: 1.05, pricePerUnit: 250  },
  baseboard:{ label: 'Плинтус (+10%)',             unit: 'пм', ratePerM2: null, pricePerUnit: 350  },
}

const FURNITURE_PRICES = {
  'bed-kingsize': 85000, 'bed-1': 45000, 'bed-2': 55000,
  'wardrobe-1': 60000, 'wardrobe-2': 75000, 'commod-bristol': 35000,
  'wall-shelf': 8000, 'shelf': 18000, 'computer-desk-apple': 42000,
  'sofa-1': 65000, 'livingroom-cabinet': 28000, 'puff': 12000,
  'chair-1': 9000, 'curtains': 22000, 'kitchen-set': 120000,
  'kitchen-table-wood': 32000, 'kitchen-chair-wood': 8500,
  'bath': 38000, 'toilet': 18000, 'bath-kit': 45000,
  'toilet-brush': 1500, 'trash-can': 2500,
}

// Транслитерация для PDF (jsPDF не поддерживает кириллицу без шрифта)
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

function calcAll(apt, items) {
  const area      = apt.area
  const h         = apt.ceilingHeight || 2.7
  const perimeter = Math.round(4 * Math.sqrt(area) * 10) / 10
  const wallArea  = Math.round(perimeter * h * 0.85 * 10) / 10

  const furnitureArea = Math.round(items.reduce((s, i) => s + i.size[0] * i.size[2], 0) * 10) / 10
  const freeArea      = Math.round((area - furnitureArea) * 10) / 10
  const occupancy     = Math.round((furnitureArea / area) * 100)

  const mats = {
    paint:     Math.ceil(wallArea  * 0.25  * 10) / 10,
    primer:    Math.ceil(wallArea  * 0.15  * 10) / 10,
    laminate:  Math.ceil(area      * 1.10  * 10) / 10,
    underlay:  Math.ceil(area      * 1.05  * 10) / 10,
    baseboard: Math.ceil(perimeter * 1.1   * 10) / 10,
  }

  const furnitureTotal  = items.reduce((s, i) => s + (FURNITURE_PRICES[i.catalogId] || 0), 0)
  const materialsTotal  = Math.round(
    mats.paint * 450 + mats.primer * 200 + mats.laminate * 1800 + mats.underlay * 250 + mats.baseboard * 350
  )

  return { area, h, perimeter, wallArea, furnitureArea, freeArea, occupancy, mats, furnitureTotal, materialsTotal }
}

// Скриншот текущей сцены
function saveScreenshot(canvasRef) {
  const canvas = canvasRef?.current?.querySelector('canvas')
  if (!canvas) return alert('Сцена не найдена')
  const link = document.createElement('a')
  link.download = `interior-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

async function exportPDF(apt, items, calc, canvasRef) {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210, m = 15
    let y = m

    // Шапка
    doc.setFillColor(20, 20, 35)
    doc.rect(0, 0, W, 38, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20); doc.setFont('helvetica', 'bold')
    doc.text('Interior Design Project', m, 16)
    doc.setFontSize(11); doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 200)
    doc.text(`${tr(apt.title)} · ${apt.area} m2 · Floor ${apt.floor}`, m, 26)
    doc.setTextColor(120, 100, 220)
    doc.text('interior. · NIU MGSU 2025', m, 34)
    y = 46

    // Скриншот сцены
    const canvas = canvasRef?.current?.querySelector('canvas')
    if (canvas) {
      try {
        const imgData = canvas.toDataURL('image/jpeg', 0.85)
        const imgW = W - m * 2
        const imgH = Math.min(imgW * (canvas.height / canvas.width), 75)
        doc.addImage(imgData, 'JPEG', m, y, imgW, imgH)
        y += imgH + 6
      } catch (e) {}
    }

    // Характеристики
    doc.setFontSize(13); doc.setFont('helvetica', 'bold')
    doc.setTextColor(20, 20, 35)
    doc.text('Characteristics', m, y); y += 7

    const chars = [
      ['Total area', `${calc.area} m2`],
      ['Ceiling height', `${calc.h} m`],
      ['Wall area', `${calc.wallArea} m2`],
      ['Furniture area', `${calc.furnitureArea} m2`],
      ['Free area', `${calc.freeArea} m2`],
      ['Occupancy', `${calc.occupancy}%`],
    ]
    doc.setFontSize(10); doc.setFont('helvetica', 'normal')
    chars.forEach(([label, val]) => {
      doc.setTextColor(100, 100, 130); doc.text(label, m, y)
      doc.setTextColor(20, 20, 35);   doc.text(val, 120, y)
      y += 6
    })

    // Зонирование
    if (apt.rooms_data) {
      if (y > 220) { doc.addPage(); y = m }
      y += 4
      doc.setFontSize(13); doc.setFont('helvetica', 'bold')
      doc.setTextColor(20, 20, 35)
      doc.text('Zoning', m, y); y += 7
      doc.setFontSize(10); doc.setFont('helvetica', 'normal')
      Object.values(apt.rooms_data).forEach(zone => {
        doc.setTextColor(100, 100, 130); doc.text(tr(zone.name), m, y)
        doc.setTextColor(20, 20, 35);   doc.text(`${zone.area} m2`, 120, y)
        y += 6
      })
    }

    // Мебель
    if (y > 230) { doc.addPage(); y = m }
    y += 4
    doc.setFontSize(13); doc.setFont('helvetica', 'bold')
    doc.setTextColor(20, 20, 35)
    doc.text('Furniture list', m, y); y += 7

    doc.setFontSize(10); doc.setFont('helvetica', 'normal')
    let fTotal = 0
    items.forEach((item, i) => {
      if (y > 270) { doc.addPage(); y = m }
      const price = FURNITURE_PRICES[item.catalogId] || 0
      fTotal += price
      doc.setTextColor(100, 100, 130); doc.text(`${i + 1}.`, m, y)
      doc.setTextColor(20, 20, 35);   doc.text(tr(item.title), m + 6, y)
      doc.text(`${item.size[0]}x${item.size[2]} m`, 110, y)
      if (price) { doc.setTextColor(80, 80, 200); doc.text(`~${price.toLocaleString('ru-RU')} RUB`, 145, y) }
      y += 6
    })

    y += 2
    doc.setDrawColor(200, 200, 220); doc.line(m, y, W - m, y); y += 5
    doc.setFont('helvetica', 'bold'); doc.setTextColor(80, 80, 200)
    doc.text('Furniture total (approx.):', m, y)
    doc.text(`~${fTotal.toLocaleString('ru-RU')} RUB`, 145, y); y += 10

    // Материалы
    if (y > 240) { doc.addPage(); y = m }
    doc.setFontSize(13); doc.setTextColor(20, 20, 35)
    doc.text('Materials', m, y); y += 7

    doc.setFontSize(10); doc.setFont('helvetica', 'normal')
    const matsRows = [
      ['Paint (2 layers)', `${calc.mats.paint} l`, calc.mats.paint * 450],
      ['Primer', `${calc.mats.primer} l`, calc.mats.primer * 200],
      ['Laminate', `${calc.mats.laminate} m2`, calc.mats.laminate * 1800],
      ['Underlay', `${calc.mats.underlay} m2`, calc.mats.underlay * 250],
      ['Baseboard', `${calc.mats.baseboard} lm`, calc.mats.baseboard * 350],
    ]
    let mTotal = 0
    matsRows.forEach(([label, qty, cost]) => {
      if (y > 270) { doc.addPage(); y = m }
      mTotal += cost
      doc.setTextColor(100, 100, 130); doc.text(label, m, y)
      doc.setTextColor(20, 20, 35);   doc.text(qty, 100, y)
      doc.setTextColor(80, 80, 200);  doc.text(`~${Math.round(cost).toLocaleString('ru-RU')} RUB`, 145, y)
      y += 6
    })

    y += 2
    doc.setDrawColor(200, 200, 220); doc.line(m, y, W - m, y); y += 5
    doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 160, 100)
    doc.text('TOTAL BUDGET (approx.):', m, y)
    doc.text(`~${(fTotal + Math.round(mTotal)).toLocaleString('ru-RU')} RUB`, 145, y)

    // Подвал
    const pages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i)
      doc.setFontSize(8); doc.setTextColor(160, 160, 180)
      doc.text(`Page ${i} of ${pages} · interior. · NIU MGSU 2025`, m, 290)
    }

    doc.save(`interior-${apt.id}-${Date.now()}.pdf`)
  } catch (e) {
    alert('Ошибка экспорта: ' + e.message)
  }
}

function Section({ title, icon, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{title}</p>
      </div>
      {children}
    </div>
  )
}

function CalculationsModal({ isOpen, onClose, items, apt, canvasRef }) {
  const calc = useMemo(() => apt ? calcAll(apt, items) : null, [apt, items])
  if (!apt || !calc) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-white font-bold text-xl">Расчёты и смета</h2>
                <p className="text-zinc-500 text-sm mt-0.5">{apt.title} · {apt.area} м²</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Скриншот */}
                <button onClick={() => saveScreenshot(canvasRef)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/8"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="7" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 3V2.5C5 2 5.5 1.5 6 1.5h2c.5 0 1 .5 1 .5V3" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                  PNG
                </button>
                {/* PDF */}
                <button onClick={() => exportPDF(apt, items, calc, canvasRef)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  PDF
                </button>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Контент */}
            <div className="overflow-y-auto flex-1 px-6 py-5">

              {/* Площадь */}
              <Section title="Площадь" icon="📏">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Общая площадь', value: calc.area,          unit: 'м²', accent: true },
                    { label: 'Стены',          value: calc.wallArea,      unit: 'м²' },
                    { label: 'Периметр',       value: calc.perimeter,     unit: 'пм' },
                    { label: 'Мебель',         value: calc.furnitureArea, unit: 'м²' },
                    { label: 'Свободно',       value: calc.freeArea,      unit: 'м²' },
                    { label: 'Высота',         value: calc.h,             unit: 'м'  },
                  ].map(item => (
                    <div key={item.label} className={`p-3 rounded-xl border ${item.accent ? 'bg-violet-500/10 border-violet-500/20' : 'bg-white/[0.03] border-white/5'}`}>
                      <div className="text-xs text-zinc-500 mb-1">{item.label}</div>
                      <div className={`font-bold text-base ${item.accent ? 'text-violet-400' : 'text-white'}`}>
                        {item.value} <span className="text-xs font-normal text-zinc-500">{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Заполненность */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Заполненность</span>
                    <span className={`font-bold ${calc.occupancy > 50 ? 'text-orange-400' : 'text-emerald-400'}`}>{calc.occupancy}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(calc.occupancy, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full"
                      style={{ background: calc.occupancy > 50 ? 'linear-gradient(90deg,#f97316,#ef4444)' : 'linear-gradient(90deg,#7c3aed,#10b981)' }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1.5">
                    {calc.occupancy <= 20 && 'Комната почти пустая'}
                    {calc.occupancy > 20 && calc.occupancy <= 40 && '✅ Оптимальное заполнение'}
                    {calc.occupancy > 40 && calc.occupancy <= 55 && 'Комната хорошо заполнена'}
                    {calc.occupancy > 55 && '⚠️ Много мебели — рекомендуем убрать часть'}
                  </p>
                </div>
              </Section>

              {/* Зонирование */}
              {apt.rooms_data && (
                <Section title="Зонирование" icon="🏠">
                  <div className="space-y-2">
                    {Object.values(apt.rooms_data).map(zone => (
                      <div key={zone.name} className="flex items-center gap-3">
                        <span className="text-sm text-zinc-400 w-40 shrink-0">{zone.name}</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500/50"
                            style={{ width: `${(zone.area / apt.area * 100).toFixed(0)}%` }} />
                        </div>
                        <span className="text-sm font-medium text-white w-14 text-right">{zone.area} м²</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Мебель */}
              {items.length > 0 && (
                <Section title="Список мебели" icon="🛋">
                  <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
                    {items.map((item, i) => {
                      const price = FURNITURE_PRICES[item.catalogId]
                      return (
                        <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-xs text-zinc-600 w-5 shrink-0 text-center">{i + 1}</span>
                          {item.icon && <img src={item.icon} alt="" className="w-10 h-10 rounded-lg object-contain bg-white/5 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-200 font-medium truncate">{item.title}</p>
                            <p className="text-xs text-zinc-600">{item.size[0]}×{item.size[2]} м</p>
                          </div>
                          {price && <span className="text-xs text-violet-400 shrink-0">~{price.toLocaleString('ru-RU')} ₽</span>}
                        </div>
                      )
                    })}
                  </div>
                  {calc.furnitureTotal > 0 && (
                    <div className="flex justify-between items-center p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <span className="text-sm font-medium text-zinc-300">Итого мебель</span>
                      <span className="text-base font-bold text-violet-400">~{calc.furnitureTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                </Section>
              )}

              {/* Материалы */}
              <Section title="Расход материалов" icon="🎨">
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-2.5 mb-3">
                  <p className="text-xs text-amber-400/80">Расчёт ориентировочный</p>
                </div>
                {Object.entries(MATERIAL_RATES).map(([key, info]) => {
                  const qty  = calc.mats[key]
                  const cost = Math.round(qty * info.pricePerUnit)
                  return (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-sm text-zinc-500">{info.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-300">{qty} {info.unit}</span>
                        <span className="text-xs text-zinc-600">~{cost.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  )
                })}
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">Общий бюджет</p>
                    <p className="text-xs text-zinc-600">мебель + материалы</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">~{(calc.furnitureTotal + calc.materialsTotal).toLocaleString('ru-RU')} ₽</p>
                </div>
              </Section>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CalculationsModal