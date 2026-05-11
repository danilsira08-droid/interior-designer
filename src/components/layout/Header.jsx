import { Link, useLocation } from 'react-router-dom'
import { useSiteTheme } from '../../context/ThemeContext'

const navLinks = [
  { path: '/', label: 'Главная' },
  { path: '/catalog', label: 'Каталог' },
]

function Header() {
  const location = useLocation()
  const { isDark, toggleTheme } = useSiteTheme()

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between backdrop-blur-md border-b transition-colors duration-300 ${
      isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-zinc-200'
    }`}>

      {/* Логотип */}
      <Link to="/" className={`font-bold text-xl tracking-tight transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        interior
        <span style={{ color: isDark ? '#a78bfa' : '#f97316' }}>.</span>
      </Link>

      {/* Навигация */}
      <nav className="flex items-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm transition-colors duration-200 ${
              location.pathname === link.path
                ? isDark ? 'text-white' : 'text-zinc-900'
                : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Правая часть */}
      <div className="flex items-center gap-3">
        {/* Переключатель темы */}
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isDark
              ? 'bg-white/8 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/8'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
          }`}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1.1 1.1M11.8 11.8l1.1 1.1M3.1 12.9l1.1-1.1M11.8 4.2l1.1-1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 9.5A6 6 0 016.5 2.5a6.5 6.5 0 100 11 6 6 0 007-4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <Link
          to="/catalog"
          className="text-sm px-4 py-2 rounded-xl text-white transition-colors duration-200"
          style={{ backgroundColor: isDark ? '#7c3aed' : '#f97316' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#6d28d9' : '#ea6e0e'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = isDark ? '#7c3aed' : '#f97316'}
        >
          Начать проект
        </Link>
      </div>
    </header>
  )
}

export default Header