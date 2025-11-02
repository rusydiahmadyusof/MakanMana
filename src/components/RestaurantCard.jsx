/**
 * RestaurantCard Component
 * Displays a single restaurant with image, details, and favorite toggle
 * Clicking the card opens the restaurant in Google Maps
 */

import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

/**
 * RestaurantCard Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.restaurant - Restaurant data object
 * @param {string} props.restaurant.place_id - Unique place identifier
 * @param {string} props.restaurant.name - Restaurant name
 * @param {number} props.restaurant.rating - Rating (0-5)
 * @param {number} props.restaurant.price_level - Price level (1-4)
 * @param {Array} props.restaurant.photos - Array of photo URLs
 * @param {Object} props.restaurant.geometry - Location geometry data
 * @returns {JSX.Element} Restaurant card component
 */
export default function RestaurantCard({ restaurant }) {
  const { state, dispatch } = useApp()
  const isFavorite = state.favorites.some(fav => fav.place_id === restaurant.place_id)

  /**
   * Toggles favorite status for this restaurant
   * Adds or removes restaurant from favorites list
   * 
   * @param {Event} e - Click event
   */
  const toggleFavorite = (e) => {
    e.stopPropagation()
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: restaurant.place_id })
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: restaurant })
    }
  }

  /**
   * Converts price level number to dollar signs
   * 
   * @param {number} level - Price level (1-4)
   * @returns {string} Dollar signs representing price level or 'N/A'
   */
  const getPriceSymbols = (level) => {
    if (!level) return 'N/A'
    return '$'.repeat(level)
  }

  /**
   * Gets the photo URL for the restaurant
   * Handles different photo formats (string URLs, objects with photo_reference)
   * 
   * @returns {string} Photo URL or placeholder URL
   */
  const getPhotoUrl = () => {
    if (!restaurant.photos || restaurant.photos.length === 0) {
      return 'https://via.placeholder.com/400x200/E5E7EB/6B7280?text=No+Image'
    }

    const photo = restaurant.photos[0]
    
    // Photo should be a URL string (extracted from Photo object in placesApi)
    if (typeof photo === 'string') {
      if (photo.startsWith('http')) {
        return photo
      }
      // If somehow it's not a full URL, try to use it with the photo API
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (apiKey) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo}&key=${apiKey}`
      }
    }
    
    // If photo is an object with photo_reference, build URL manually
    if (typeof photo === 'object') {
      if (photo.url && photo.url.startsWith('http')) {
        return photo.url
      }
      if (photo.photo_reference) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        if (apiKey) {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiKey}`
        }
      }
    }
    
    return 'https://via.placeholder.com/400x200/E5E7EB/6B7280?text=No+Image'
  }

  /**
   * Opens restaurant location in Google Maps
   * Opens in new tab/window
   */
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
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getPhotoUrl()}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.warn('Failed to load image for:', restaurant.name)
            // Hide the card if image fails to load
            e.target.closest('.bg-white').style.display = 'none'
          }}
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className={`text-2xl ${isFavorite ? 'text-brand-accent' : 'text-gray-400'}`}>
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
      </div>
      
      {/* Restaurant Details */}
      <div className="p-4">
        <h3 className="font-manrope font-semibold text-lg text-brand-dark mb-2">
          {restaurant.name}
        </h3>
        
        {/* Rating and Price */}
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

        {/* Location */}
        {restaurant.vicinity && (
          <p className="text-sm text-gray-600 mb-2 truncate">
            📍 {restaurant.vicinity}
          </p>
        )}

        {/* Restaurant Types */}
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
