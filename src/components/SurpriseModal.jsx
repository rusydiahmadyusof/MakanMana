import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function SurpriseModal({ isOpen, onClose }) {
  const { state } = useApp()
  const restaurants = state.restaurants

  const getRandomRestaurant = () => {
    if (restaurants.length === 0) return null
    const randomIndex = Math.floor(Math.random() * restaurants.length)
    return restaurants[randomIndex]
  }

  const restaurant = getRandomRestaurant()

  const getPhotoUrl = () => {
    if (restaurant?.photos && restaurant.photos.length > 0) {
      const photoRef = restaurant.photos[0].photo_reference
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoRef}&key=${apiKey}`
    }
    return 'https://via.placeholder.com/600x300?text=Restaurant'
  }

  const openInMaps = () => {
    if (restaurant?.geometry?.location) {
      const lat = restaurant.geometry.location.lat
      const lng = restaurant.geometry.location.lng
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
      onClose()
    }
  }

  if (!restaurant) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
            >
              <p className="text-xl mb-4">🍕</p>
              <p className="text-gray-700">No restaurants found! Try searching first.</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-xl hover:bg-amber-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={getPhotoUrl()}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <motion.h2
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-manrope font-bold text-2xl text-brand-dark mb-4"
              >
                🎉 {restaurant.name}
              </motion.h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-gray-700">
                    {restaurant.rating?.toFixed(1) || 'N/A'}
                    {restaurant.user_ratings_total > 0 && (
                      <span className="text-gray-400 text-sm ml-2">
                        ({restaurant.user_ratings_total} reviews)
                      </span>
                    )}
                  </span>
                </div>
                
                {restaurant.vicinity && (
                  <p className="text-gray-600">📍 {restaurant.vicinity}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={openInMaps}
                  className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-amber-600 transition-all hover:scale-105 font-medium"
                >
                  Let's Go! 🚀
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

