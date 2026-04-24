import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Apartment from './pages/Apartment'
import Editor from './pages/Editor'
 
function Layout() {
  const location = useLocation()
  const isEditor = location.pathname.startsWith('/editor')
 
  return (
    <>
      {!isEditor && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/apartment/:id" element={<Apartment />} />
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </>
  )
}
 
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
 
export default App
 