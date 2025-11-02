/**
 * Navbar Component
 * Top navigation bar with logo, favorites link, surprise me button, and dashboard link
 * Logo click reloads the app and resets filters
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

/**
 * Navbar Component
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSurpriseMe - Callback function to open surprise modal
 * @returns {JSX.Element} Navigation bar component
 */
export default function Navbar({ onSurpriseMe }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useApp();

  /**
   * Handles logo click - reloads app and resets to initial state
   * Resets filters, clears restaurants, navigates home, and reloads page
   *
   * @param {Event} e - Click event
   */
  const handleLogoClick = (e) => {
    e.preventDefault();

    // Reset filters to defaults
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        cuisine: '',
        price: '',
        rating: '',
        search: '',
        radius: '5',
      },
    });

    // Clear restaurants to force reload
    dispatch({ type: 'FETCH_SUCCESS', payload: [] });

    // Navigate to home
    navigate('/');

    // Reload the page to fully reset the app
    window.location.reload();
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='bg-brand-light/80 backdrop-blur-md sticky top-0 z-50 shadow-soft'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo - Click to reload app */}
          <Link
            to='/'
            onClick={handleLogoClick}
            className='flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity'
          >
            <span className='text-2xl'>🍽️</span>
            <span className='font-manrope font-bold text-brand-dark text-xl'>
              Makan Dekat Mana Oi!!!
            </span>
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center space-x-4'>
            <Link
              to='/favorites'
              className='flex items-center space-x-1 px-3 py-2 rounded-xl hover:bg-amber-200 transition-colors'
            >
              <span>Favorites</span>
              <span className='text-brand-accent'>❤️</span>
            </Link>

            <button
              onClick={onSurpriseMe}
              className='flex items-center space-x-1 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-amber-600 hover:scale-105 transition-all shadow-soft'
            >
              <span>🎲</span>
              <span>Surprise Me</span>
            </button>

            <Link
              to='/dashboard'
              className='flex items-center space-x-1 px-3 py-2 rounded-xl hover:bg-amber-200 transition-colors'
            >
              <span>Dashboard</span>
              <span>📊</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
