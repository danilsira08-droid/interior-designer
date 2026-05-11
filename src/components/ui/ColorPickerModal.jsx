import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WALL_PRESETS     = ['#F5F0EA','#E8DCC8','#D0CCC8','#C8D4E0','#C8DCD0','#E8D0D0','#F0E8D8','#DDD0C8','#C8C8D8','#D8E8D8','#F0F0F0','#E0D8C8']
const CEILING_PRESETS  = ['#FFFFFF','#FFF8F0','#F8F8F8','#FFFFF0','#F0F8FF','#FFF0F8']
const FLOOR_PRESETS    = ['#C4956A','#A0784A','#D4B896','#8B6340','#E8D4B8','#6B4423','#B8A898','#808080','#C8C0B8','#F0EDE8','#D4C4A8','#A89880']
const BATH_WALL_PRESETS = ['#E8E8E8','#F0F0F0','#D8E8F0','#F0E8D8','#E0D8E8','#DDEEDD','#FAFAFA','#E0E8F0','#F0D8D8','#D8F0E8']
const BATH_FLOOR_PRESETS = ['#C8C8C8','#D0C8C0','#B8C8C8','#C8B8A8','#E0D8D0','#A8B8A8','#D8C8B8','#B0B0B0','#C0C8B0','#D0B8A8']

const SECTIONS = [
  { id: 'living',   label: 'Квартира' },
  { id: 'bathroom', label: 'Санузел' },
]

function ColorGrid({ presets, value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {presets.map(color => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className="aspect-square rounded-xl transition-transform hover:scale-110 relative"
          style={{
            backgroundColor: color,
            border: value === color ? '2.5px solid #7c3aed' : '2px solid transparent',
            boxShadow: value === color ? '0 0 0 1px rgba(124,58,237,0.3)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function ColorPickerModal({
  onClose,
  wallColor, ceilingColor, floorColor,
  bathroomWallColor, bathroomFloorColor,
  onWallColor, onCeilingColor, onFloorColor,
  onBathroomWallColor, onBathroomFloorColor,
  hasBathroom = false,
}) {
  const [section, setSection] = useState('living')
  const [tab,     setTab]     = useState('walls')

  const livingTabs = [
    { id: 'walls',   label: 'Стены',   presets: WALL_PRESETS,    value: wallColor,    onChange: onWallColor },
    { id: 'ceiling', label: 'Потолок', presets: CEILING_PRESETS, value: ceilingColor, onChange: onCeilingColor },
    { id: 'floor',   label: 'Пол',     presets: FLOOR_PRESETS,   value: floorColor || '#C4956A', onChange: onFloorColor },
  ]

  const bathroomTabs = [
    { id: 'bwalls', label: 'Стены',   presets: BATH_WALL_PRESETS,  value: bathroomWallColor || '#E8E8E8',  onChange: onBathroomWallColor },
    { id: 'bfloor', label: 'Пол',     presets: BATH_FLOOR_PRESETS, value: bathroomFloorColor || '#D0C8C0', onChange: onBathroomFloorColor },
  ]

  const tabs   = section === 'living' ? livingTabs   : bathroomTabs
  const active = tabs.find(t => t.id === tab) || tabs[0]

  const handleSectionChange = (s) => {
    setSection(s)
    setTab(s === 'living' ? 'walls' : 'bwalls')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-14 right-4 w-76 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
          style={{ width: '300px' }}
        >
          {/* Шапка */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Цвет отделки</h3>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Секции — Квартира / Санузел */}
          {hasBathroom && (
            <div className="flex p-2 gap-1 border-b border-white/5">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => handleSectionChange(s.id)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    section === s.id ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >{s.label}</button>
              ))}
            </div>
          )}

          {/* Вкладки */}
          <div className="flex p-2 gap-1 border-b border-white/5">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tab === t.id ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-300'
                }`}
              >{t.label}</button>
            ))}
          </div>

          <div className="p-4">
            <ColorGrid presets={active.presets} value={active.value} onChange={active.onChange} />

            {/* Свой цвет */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <input
                type="color"
                value={active.value}
                onChange={e => active.onChange(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
              />
              <div>
                <p className="text-white text-xs font-medium">{active.value}</p>
                <p className="text-zinc-600 text-xs">свой цвет</p>
              </div>
              {/* Превью */}
              <div className="ml-auto w-10 h-10 rounded-xl border border-white/10"
                style={{ backgroundColor: active.value }} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ColorPickerModal