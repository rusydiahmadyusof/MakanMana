import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar({ onSurpriseMe }) {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-brand-light/80 backdrop-blur-md sticky top-0 z-50 shadow-soft"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍴</span>
            <span className="font-manrope font-bold text-brand-dark text-xl">Where to Eat</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/favorites"
              className="flex items-center space-x-1 px-3 py-2 rounded-xl hover:bg-amber-200 transition-colors"
            >
              <span>Favorites</span>
              <span className="text-brand-accent">❤️</span>
            </Link>
            
            <button
              onClick={onSurpriseMe}
              className="flex items-center space-x-1 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-amber-600 hover:scale-105 transition-all shadow-soft"
            >
              <span>🎲</span>
              <span>Surprise Me</span>
            </button>
            
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 px-3 py-2 rounded-xl hover:bg-amber-200 transition-colors"
            >
              <span>Dashboard</span>
              <span>📊</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

