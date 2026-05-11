import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FURNITURE_CATALOG, SANITARY_IDS } from '../../modules/editor/useEditorStore'

const APARTMENT_CONTEXTS = {
  'apt-1room-2': {
    name: '1-комнатная квартира, 38 м²',
    description: 'Квартира с объединённой кухней-гостиной и санузлом.',
    zonesText: `- Гостиная/кухня: центр X:-2.4 Z:-0.25 (X:-6.85..2.0, Z:-1.8..1.3)
- Санузел: X:2.0..6.7 — только сантехника`,
    tips: `Диван у стены Z:-1.8, ТВ-тумба у Z:1.3, кровать у стены X:-6.85.
Шкаф рядом с кроватью. Кухонный гарнитур у стены X:-6.85 или X:2.0.`,
  },
  'apt-3room': {
    name: '3-комнатная квартира, 76 м²',
    description: 'Две спальни, гостиная, кухня, три санузла, гардероб.',
    zonesText: `- Спальня 1 (правая): центр X:4.13 Z:2.48 (X:2.08..6.18, Z:1.11..3.84)
- Спальня 2 (левая): центр X:-4.70 Z:2.48 (X:-7.19..-2.21, Z:1.11..3.84)
- Гостиная: центр X:-5.05 Z:-0.68 (X:-7.18..-2.92, Z:-2.18..0.83)
- Кухня: центр X:-5.15 Z:-3.75 (X:-7.19..-3.11, Z:-5.16..-2.33)
- Гардероб: центр X:-0.84 Z:-0.36 (X:-1.03..-0.64, Z:-1.67..0.96)
- Санузлы — только сантехника, мебель туда НЕ ставить`,
    tips: `Спальня 1: кровать у Z:3.84, шкаф у X:6.18.
Спальня 2: кровать у Z:3.84, шкаф у X:-7.19.
Гостиная: диван у Z:-2.18, ТВ-тумба у Z:0.83.
Кухня: гарнитур у стены X:-7.19, стол в центре.
НЕ ставь мебель в прихожую (X:-2.92..2.08, Z:-2.18..1.11).`,
  },
  'apt-3room2': {
  name: '3-комнатная квартира (вар. 2), 106 м²',
  description: 'Просторная квартира с открытой кухней-гостиной, двумя спальнями, двумя санузлами и двумя гардеробными.',
  zonesText: `- Кухня-гостиная (23 м²): основное открытое пространство — диван, ТВ-зона, обеденный стол
- Спальня 1 (16.6 м²): большая спальня — кровать, шкаф, рабочее место
- Спальня 2 (15.3 м²): спальня — кровать, шкаф
- Гардеробные (4+4.8 м²): компактные шкафы
- Санузлы — только сантехника, мебель не ставить
- Холл и прихожая — не заполнять мебелью`,
  tips: `Квартира просторная 106 м², размещай мебель свободно.
Кухня-гостиная — открытое пространство: диван в центре или у стены, ТВ-тумба напротив, обеденный стол с креслами у кухонной зоны.
Спальни: кровать у дальней стены, шкаф вдоль боковой стены.
После замера инструментом уточни координаты и сообщи разработчику.`,
},
  'apt-1room': {
    name: '1-комнатная квартира, 42 м²',
    description: 'Просторная однокомнатная квартира.',
    zonesText: '- Основная зона: центр X:-1.0 Z:0.0',
    tips: 'Кровать у дальней стены, диван и ТВ в гостиной зоне, кухонный гарнитур у стены.',
  },
  'apt-2room': {
    name: '2-комнатная квартира, 67 м²',
    description: 'Гостиная с кухней и спальня.',
    zonesText: `- Гостиная/кухня: центр X:-3.5 Z:0
- Спальня: центр X:3.5 Z:0`,
    tips: 'Спальня — правая часть: кровать, шкаф. Гостиная — левая: диван, ТВ-тумба, кухонный гарнитур.',
  },
  'apt-studroom': {
    name: 'Студия, 28 м²',
    description: 'Компактная студия.',
    zonesText: '- Основная зона: центр X:0 Z:0',
    tips: 'Кровать у стены, диван отдельно, кухня у стены.',
  },
}

const QUICK_PROMPTS = {
  'apt-3room': [
    'Расставь обе спальни — кровати и шкафы',
    'Гостиную с диваном, ковром и ТВ-зоной',
    'Кухню с гарнитуром и обеденным столом',
    'Полная расстановка всей квартиры',
  ],
  default: [
    'Уютная гостиная с диваном и ковром',
    'Спальня для двоих',
    'Кухня с обеденной зоной',
    'Расставь всю мебель',
  ],
  'apt-3room2': [
  'Гостиную с диваном, ковром и ТВ-зоной',
  'Обе спальни — кровати и шкафы',
  'Кухню с гарнитуром и обеденным столом',
  'Полная расстановка всей квартиры',
],
}

async function callClaude(prompt, apartmentId) {
  const ctx = APARTMENT_CONTEXTS[apartmentId] || APARTMENT_CONTEXTS['apt-1room-2']

  const furnitureList = FURNITURE_CATALOG
    .filter(f => !SANITARY_IDS.has(f.id))
    .map(f => `id:"${f.id}" | "${f.title}" | ${f.size[0]}×${f.size[2]}м | ${f.category} | ${f.description}`)
    .join('\n')

  const system = `Ты опытный AI-дизайнер интерьера. Квартира: ${ctx.name}. ${ctx.description}

ЗОНЫ ДЛЯ РАЗМЕЩЕНИЯ:
${ctx.zonesText}

ПОДСКАЗКИ:
${ctx.tips}

ДОСТУПНАЯ МЕБЕЛЬ (только из этого списка, ID строго как указан):
${furnitureList}

ПРАВИЛА РАЗМЕЩЕНИЯ:
1. Координаты СТРОГО внутри границ комнаты
2. Кровать — изголовьем к стене (отступ 0.1м от края)
3. Диван — у стены или лицом к ТВ-тумбе
4. Шкаф — вплотную к стене (отступ 0.05м)
5. Ковёр — под диваном и столиком (rotation:0)
6. Гарнитур — вдоль стены кухни
7. Между предметами минимум 0.6м прохода
8. Санузлы и прихожую НЕ заполнять

Ответь ТОЛЬКО валидным JSON:
{
  "items": [{"catalogId":"id","x":0.0,"z":0.0,"rotation":0}],
  "explanation": "2-3 предложения на русском"
}`

const response = await fetch('/api/claude', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    system,
    messages: [{ role: 'user', content: prompt }],
  }),
})

  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    // Дополнительная защита — убираем сантехнику если AI всё-таки добавил
    if (parsed.items) {
      parsed.items = parsed.items.filter(item => {
        const exists = FURNITURE_CATALOG.find(f => f.id === item.catalogId)
        return exists && !SANITARY_IDS.has(item.catalogId)
      })
    }
    return parsed
  } catch (e) {
    console.error('AI parse error:', e, text)
    return null
  }
}

function AIDesigner({ apartmentId, onApply, isOpen, onClose, hasItems }) {
  const [prompt,      setPrompt]      = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState(null)
  const [error,       setError]       = useState(null)
  const [replaceMode, setReplaceMode] = useState(false)

  const ctx          = APARTMENT_CONTEXTS[apartmentId] || APARTMENT_CONTEXTS['apt-1room-2']
  const quickPrompts = QUICK_PROMPTS[apartmentId] || QUICK_PROMPTS.default

  const handleSend = async (text) => {
    const query = (text || prompt).trim()
    if (!query) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await callClaude(query, apartmentId)
      if (res) setResult(res)
      else setError('Не удалось распознать ответ. Попробуй ещё раз.')
    } catch (e) {
      setError('Ошибка: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!result?.items) return
    onApply(result.items, replaceMode)
    setResult(null); setPrompt('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-80 h-full bg-zinc-950 border-l border-white/5 flex flex-col"
          style={{ boxShadow: '-8px 0 30px rgba(0,0,0,0.3)' }}
        >
          {/* Шапка */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1.2 3.2H10L7.4 6.2l1 3L6 7.5 3.6 9.2l1-3L2 4.2h2.8z" fill="white"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI-дизайнер</p>
                <p className="text-zinc-600 text-xs truncate max-w-[180px]">{ctx.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Контент */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <p className="text-xs text-zinc-600 uppercase tracking-widest">Быстрые варианты</p>
            {quickPrompts.map(q => (
              <button key={q} onClick={() => handleSend(q)} disabled={loading}
                className="text-left text-sm px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-violet-500/30 text-zinc-400 hover:text-zinc-200 transition-all disabled:opacity-40"
              >{q}</button>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 mt-1">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500"
                      animate={{ y: [0,-4,0] }} transition={{ duration:0.6, delay:i*0.1, repeat:Infinity }}/>
                  ))}
                </div>
                <p className="text-zinc-500 text-xs">AI расставляет мебель...</p>
              </div>
            )}

            {result && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-1"
              >
                <p className="text-emerald-400 text-xs font-medium mb-1">✓ Готово — {result.items?.length} предметов</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{result.explanation}</p>
              </motion.div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-1">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
          </div>

          {/* Подвал */}
          <div className="p-4 border-t border-white/5 shrink-0 flex flex-col gap-2">
            {result && (
              <>
                {hasItems && (
                  <div className="flex gap-1.5 mb-1">
                    <button onClick={() => setReplaceMode(false)}
                      className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${!replaceMode ? 'bg-violet-600 text-white' : 'bg-white/5 text-zinc-500'}`}
                    >Добавить</button>
                    <button onClick={() => setReplaceMode(true)}
                      className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${replaceMode ? 'bg-orange-600 text-white' : 'bg-white/5 text-zinc-500'}`}
                    >Заменить всё</button>
                  </div>
                )}
                <button onClick={handleApply}
                  className="w-full py-2.5 rounded-xl text-white font-medium text-sm hover:scale-[1.02] transition-all"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                >Применить расстановку</button>
              </>
            )}

            <div className="flex gap-2 mt-1">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Опиши желаемый интерьер..."
                className="flex-1 bg-white/[0.05] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none resize-none focus:border-violet-500/50 transition-colors"
                rows={2}
              />
              <button onClick={() => handleSend()} disabled={loading || !prompt.trim()}
                className="w-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105"
                style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 2L7 9M14 2L9 14l-2-5-5-2 12-5z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AIDesigner