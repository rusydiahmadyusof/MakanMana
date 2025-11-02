import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function RestaurantCard({ restaurant }) {
  const { state, dispatch } = useApp()
  const isFavorite = state.favorites.some(fav => fav.place_id === restaurant.place_id)

  const toggleFavorite = (e) => {
    e.stopPropagation()
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: restaurant.place_id })
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: restaurant })
    }
  }

  const getPriceSymbols = (level) => {
    if (!level) return 'N/A'
    return '$'.repeat(level)
  }

  const getPhotoUrl = () => {
    if (restaurant.photos && restaurant.photos.length > 0) {
      const photoRef = restaurant.photos[0].photo_reference
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${apiKey}`
    }
    return 'https://via.placeholder.com/400x200?text=Restaurant'
  }

  const openInMaps = () => {
    const lat = restaurant.geometry.location.lat
    const lng = restaurant.geometry.location.lng
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-soft overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={openInMaps}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getPhotoUrl()}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <span className={`text-2xl ${isFavorite ? 'text-brand-accent' : 'text-gray-400'}`}>
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-manrope font-semibold text-lg text-brand-dark mb-2">
          {restaurant.name}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-gray-700">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
            {restaurant.user_ratings_total > 0 && (
              <span className="text-gray-400 text-sm">
                ({restaurant.user_ratings_total})
              </span>
            )}
          </div>
          <span className="text-brand-primary font-medium">
            {getPriceSymbols(restaurant.price_level)}
          </span>
        </div>

        {restaurant.vicinity && (
          <p className="text-sm text-gray-600 mb-2 truncate">
            📍 {restaurant.vicinity}
          </p>
        )}

        {restaurant.types && restaurant.types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.types.slice(0, 3).map((type, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-brand-light text-brand-dark text-xs rounded-full"
              >
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

