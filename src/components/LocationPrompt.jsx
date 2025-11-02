/**
 * LocationPrompt Component
 * Prompts user for location - either via geolocation API or manual area/town input
 * Uses geocoding to convert location names to coordinates
 */

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { geocodeAddress } from '../api/geocodingApi'

/**
 * LocationPrompt Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLocationSet - Callback when location is successfully set
 * @returns {JSX.Element} Location prompt component
 */
export default function LocationPrompt({ onLocationSet }) {
  const { dispatch } = useApp()
  const [locationName, setLocationName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  /**
   * Requests user's current location using browser geolocation API
   * On success, sets location in context and calls callback
   */
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        dispatch({ type: 'SET_LOCATION', payload: location })
        onLocationSet?.(location)
        setError(null)
      },
      (err) => {
        setError('Location access denied. Please enter an area or town name.')
        console.error('Geolocation error:', err)
      }
    )
  }

  /**
   * Handles location name submission form
   * Geocodes the location name to coordinates using Google Geocoding API
   * 
   * @param {Event} e - Form submit event
   */
  const handleLocationSubmit = async (e) => {
    e.preventDefault()
    
    if (!locationName.trim()) {
      setError('Please enter an area or town name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await geocodeAddress(locationName.trim())
      const location = {
        lat: result.lat,
        lng: result.lng
      }
      dispatch({ type: 'SET_LOCATION', payload: location })
      onLocationSet?.(location)
      setLocationName('')
    } catch (err) {
      setError(err.message || 'Failed to find location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-soft p-8">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">📍</div>
        <h2 className="font-manrope font-bold text-2xl text-brand-dark mb-2">
          Let's Find Great Food!
        </h2>
        <p className="text-gray-600">We need your location to find nearby restaurants.</p>
      </div>

      <div className="space-y-4">
        {/* Use My Location Button */}
        <button
          onClick={requestLocation}
          className="w-full px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-amber-600 transition-all hover:scale-105 font-medium shadow-soft"
        >
          Use My Location 📍
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Manual Location Input Form */}
        <form onSubmit={handleLocationSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Enter Area or Town
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g., New York, Kuala Lumpur, Tokyo"
              className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a city, area, or address
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-brand-dark text-white rounded-xl hover:bg-amber-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">🔍</span>
                Finding location...
              </span>
            ) : (
              'Find Restaurants'
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
