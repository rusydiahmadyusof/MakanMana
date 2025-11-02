/**
 * App Component
 * Main application component with routing and global providers
 * Sets up React Router and manages surprise modal state
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import SurpriseModal from './components/SurpriseModal'
import HomePage from './pages/HomePage'
import FavoritesPage from './pages/FavoritesPage'
import DashboardPage from './pages/DashboardPage'
import { useState } from 'react'

/**
 * App Component
 * Root component that provides routing and global context
 * 
 * @returns {JSX.Element} Main application component
 */
function App() {
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false)

  /**
   * Opens the surprise modal
   */
  const handleOpenSurpriseModal = () => {
    setIsSurpriseModalOpen(true)
  }

  /**
   * Closes the surprise modal
   */
  const handleCloseSurpriseModal = () => {
    setIsSurpriseModalOpen(false)
  }

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-brand-neutral">
          {/* Navigation Bar */}
          <Navbar onSurpriseMe={handleOpenSurpriseModal} />
          
          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          
          {/* Surprise Modal */}
          <SurpriseModal
            isOpen={isSurpriseModalOpen}
            onClose={handleCloseSurpriseModal}
          />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
