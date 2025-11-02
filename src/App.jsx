import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import SurpriseModal from './components/SurpriseModal'
import HomePage from './pages/HomePage'
import FavoritesPage from './pages/FavoritesPage'
import DashboardPage from './pages/DashboardPage'
import { useState } from 'react'

function App() {
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false)

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-brand-neutral">
          <Navbar onSurpriseMe={() => setIsSurpriseModalOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <SurpriseModal
            isOpen={isSurpriseModalOpen}
            onClose={() => setIsSurpriseModalOpen(false)}
          />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

