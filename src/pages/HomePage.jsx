/**
 * HomePage Component
 * Main page displaying restaurant listings with filters
 * Handles location prompt, restaurant fetching, and error states
 */

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { searchNearbyRestaurants } from '../api/placesApi'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import Filters from '../components/Filters'
import RestaurantCard from '../components/RestaurantCard'
import EmptyState from '../components/EmptyState'
import LocationPrompt from '../components/LocationPrompt'

/**
 * HomePage Component
 * Main landing page with restaurant search and filtering
 * 
 * @returns {JSX.Element} Home page component
 */
export default function HomePage() {
  const { state, dispatch } = useApp()
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps()
  const [showLocationPrompt, setShowLocationPrompt] = useState(!state.userLocation)

  /**
   * Fetches nearby restaurants based on user location and filters
   * Uses Google Places API to search for restaurants
   * Handles errors and updates loading state
   */
  const fetchRestaurants = useCallback(async () => {
    if (!state.userLocation) return

    dispatch({ type: 'FETCH_START' })
    try {
      const restaurants = await searchNearbyRestaurants(state.userLocation, state.filters)
      dispatch({ type: 'FETCH_SUCCESS', payload: restaurants })
    } catch (error) {
      console.error('❌ Error fetching restaurants:', error)
      
      // Provide more detailed error message
      let errorMessage = error.message || 'Failed to fetch restaurants'
      
      // Check for CORS or network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network Error: The Google Places API may not support direct browser requests due to CORS restrictions. Consider using a CORS proxy or the Places API JavaScript library.'
      }
      
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage })
    }
  }, [state.userLocation, state.filters, dispatch])

  /**
   * Fetches restaurants when location, filters, or Maps API loading state changes
   * Only fetches if location is set and Maps API is loaded
   */
  useEffect(() => {
    if (state.userLocation && mapsLoaded && !mapsError) {
      fetchRestaurants()
    }
  }, [state.userLocation, state.filters, mapsLoaded, mapsError, fetchRestaurants])

  /**
   * Handles location being set by LocationPrompt
   * Hides location prompt when location is successfully set
   */
  const handleLocationSet = () => {
    setShowLocationPrompt(false)
  }

  // Show location prompt if no location is set
  if (showLocationPrompt || !state.userLocation) {
    return <LocationPrompt onLocationSet={handleLocationSet} />
  }

  /**
   * Filters restaurants to exclude those without images or with placeholder images
   * Ensures only restaurants with valid photos are displayed
   * 
   * @param {Object} restaurant - Restaurant object to check
   * @returns {boolean} Whether restaurant should be displayed
   */
  const filteredRestaurants = state.restaurants.filter(restaurant => {
    // Must have photos
    if (!restaurant.photos || restaurant.photos.length === 0) {
      return false
    }
    
    // Check if photo is a valid URL (not placeholder)
    const photo = restaurant.photos[0]
    if (typeof photo === 'string') {
      // Reject if it's a placeholder URL
      if (photo.includes('placeholder') || photo.includes('via.placeholder')) {
        return false
      }
      // Must be a valid HTTP(S) URL
      return photo.startsWith('http')
    }
    
    // If photo is an object, it should have a valid URL or photo_reference
    if (typeof photo === 'object') {
      if (photo.url && photo.url.startsWith('http') && !photo.url.includes('placeholder')) {
        return true
      }
      if (photo.photo_reference) {
        return true
      }
    }
    
    return false
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filter Controls */}
      <Filters />

      {/* Google Maps API Loading State */}
      {!mapsLoaded && !mapsError && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🗺️</div>
          <p className="text-gray-600">Loading Google Maps API...</p>
        </div>
      )}

      {/* Google Maps API Error */}
      {mapsError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700">
          <p className="font-semibold mb-2">⚠️ {mapsError}</p>
        </div>
      )}

      {/* Restaurants Loading State */}
      {state.loading && mapsLoaded && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🍽️</div>
          <p className="text-gray-600">Finding delicious restaurants...</p>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p className="font-semibold mb-2">⚠️ {state.error}</p>
          <div className="text-sm mt-2 space-y-1">
            <p className="font-medium mb-2">📋 Check your browser console (F12) for detailed error logs</p>
            <p className="font-medium mb-1">Possible solutions:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Restart the dev server: Stop and run <code className="bg-red-100 px-1 rounded">npm run dev</code> again</li>
              <li>Verify your API key is correct in the <code className="bg-red-100 px-1 rounded">.env</code> file</li>
              <li>Ensure <strong>Places API (New)</strong> or <strong>Places API</strong> is enabled in Google Cloud Console</li>
              <li>Check if billing is enabled on your Google Cloud project (required for Places API)</li>
              <li>If API key has HTTP referrer restrictions, allow <code className="bg-red-100 px-1 rounded">localhost:5173</code> and <code className="bg-red-100 px-1 rounded">http://localhost:5173/*</code></li>
              <li>If you see CORS errors, the Places API Nearby Search may require a backend proxy (not supported in browser directly)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Restaurant Grid */}
      {!state.loading && !state.error && (
        <>
          {filteredRestaurants.length === 0 ? (
            <EmptyState
              emoji="🍕"
              message="No restaurants found. Try adjusting your filters or location."
            />
          ) : (
            <>
              <h2 className="font-manrope font-semibold text-xl text-brand-dark mb-4">
                Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
