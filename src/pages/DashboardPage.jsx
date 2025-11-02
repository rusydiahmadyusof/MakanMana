/**
 * DashboardPage Component
 * Displays analytics and statistics about restaurants and favorites
 * Shows insights including ratings, price distribution, and top cuisines
 */

import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'

/**
 * DashboardPage Component
 * Renders analytics dashboard with restaurant statistics
 * 
 * @returns {JSX.Element} Dashboard page component
 */
export default function DashboardPage() {
  const { state } = useApp()

  /**
   * Calculates average rating from all restaurants
   * 
   * @returns {string} Average rating formatted to 2 decimal places
   */
  const calculateAverageRating = () => {
    if (state.restaurants.length === 0) return '0.00'
    const sum = state.restaurants.reduce((acc, r) => acc + (r.rating || 0), 0)
    return (sum / state.restaurants.length).toFixed(2)
  }

  /**
   * Calculates price level distribution
   * Counts restaurants by price level (1-4)
   * 
   * @returns {Object} Object with price level as keys and counts as values
   */
  const calculatePriceDistribution = () => {
    return state.restaurants.reduce((acc, r) => {
      const level = r.price_level || 0
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {})
  }

  /**
   * Calculates top cuisines from restaurant types
   * Filters out generic types and counts occurrences
   * 
   * @returns {Array<[string, number]>} Array of [cuisine, count] tuples, sorted by count
   */
  const calculateTopCuisines = () => {
    const genericTypes = ['restaurant', 'food', 'point_of_interest', 'establishment']
    
    const cuisineCounts = state.restaurants.reduce((acc, r) => {
      r.types?.forEach(type => {
        if (!genericTypes.includes(type)) {
          const cleanType = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          acc[cleanType] = (acc[cleanType] || 0) + 1
        }
      })
      return acc
    }, {})

    return Object.entries(cuisineCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  // Calculate statistics
  const totalRestaurants = state.restaurants.length
  const totalFavorites = state.favorites.length
  const avgRating = calculateAverageRating()
  const priceDistribution = calculatePriceDistribution()
  const topCuisinesList = calculateTopCuisines()

  /**
   * Formats price level description
   * 
   * @param {number} level - Price level (1-4)
   * @returns {string} Formatted price description
   */
  const getPriceDescription = (level) => {
    const descriptions = {
      1: 'Budget',
      2: 'Moderate',
      3: 'Expensive',
      4: 'Very Expensive'
    }
    return descriptions[level] || ''
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-manrope font-bold text-3xl text-brand-dark mb-2">
          Dashboard 📊
        </h1>
        <p className="text-gray-600">Your dining insights and statistics</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Restaurants Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <div className="text-3xl mb-2">🍽️</div>
          <div className="text-3xl font-bold text-brand-primary mb-1">{totalRestaurants}</div>
          <div className="text-gray-600 text-sm">Total Restaurants</div>
        </motion.div>

        {/* Favorites Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-3xl font-bold text-brand-accent mb-1">{totalFavorites}</div>
          <div className="text-gray-600 text-sm">Favorites</div>
        </motion.div>

        {/* Average Rating Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-yellow-500 mb-1">{avgRating}</div>
          <div className="text-gray-600 text-sm">Avg Rating</div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <div className="text-3xl mb-2">📍</div>
          <div className="text-lg font-semibold text-brand-dark mb-1">
            {state.userLocation ? 'Location Set' : 'Not Set'}
          </div>
          <div className="text-gray-600 text-sm">
            {state.userLocation
              ? `${state.userLocation.lat.toFixed(4)}, ${state.userLocation.lng.toFixed(4)}`
              : 'Set location to explore'}
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cuisines Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <h2 className="font-manrope font-semibold text-xl text-brand-dark mb-4">
            Top Cuisines 🍜
          </h2>
          {topCuisinesList.length > 0 ? (
            <div className="space-y-3">
              {topCuisinesList.map(([cuisine, count], idx) => {
                const maxCount = topCuisinesList[0][1]
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{cuisine}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-brand-primary font-semibold w-8 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No data available. Start exploring restaurants!</p>
          )}
        </motion.div>

        {/* Price Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <h2 className="font-manrope font-semibold text-xl text-brand-dark mb-4">
            Price Distribution 💰
          </h2>
          {Object.keys(priceDistribution).length > 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((level) => {
                const count = priceDistribution[level] || 0
                const total = Object.values(priceDistribution).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                
                return (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {'$'.repeat(level)} {getPriceDescription(level)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-brand-primary font-semibold w-12 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">No data available. Start exploring restaurants!</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
