import { createContext, useContext, useState, useEffect } from 'react'
 
const ThemeContext = createContext()
 
export function ThemeProvider({ children }) {
  const [siteTheme, setSiteTheme] = useState(() => {
    return localStorage.getItem('site-theme') || 'dark'
  })
 
  useEffect(() => {
    localStorage.setItem('site-theme', siteTheme)
  }, [siteTheme])
 
  const toggleTheme = () => setSiteTheme(t => t === 'dark' ? 'light' : 'dark')
  const isDark = siteTheme === 'dark'
 
  return (
    <ThemeContext.Provider value={{ siteTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
 
export function useSiteTheme() {
  return useContext(ThemeContext)
}