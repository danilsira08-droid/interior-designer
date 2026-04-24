import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { path: '/', label: 'Главная' },
  { path: '/catalog', label: 'Каталог' },
]

function Header() {
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      
      {/* Логотип */}
      <Link to="/" className="text-white font-bold text-xl tracking-tight">
        interior<span className="text-violet-400">.</span>
      </Link>

      {/* Навигация */}
      <nav className="flex items-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm transition-colors duration-200 ${
              location.pathname === link.path
                ? 'text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Кнопка */}
      <Link
        to="/catalog"
        className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors duration-200"
      >
        Начать проект
      </Link>

    </header>
  )
}

export default Header