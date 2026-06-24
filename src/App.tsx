import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Ruolo from './pages/Ruolo'
import RuoloDetail from './pages/RuoloDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ruolo" element={<Ruolo />} />
        <Route path="/ruolo/:id" element={<RuoloDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
