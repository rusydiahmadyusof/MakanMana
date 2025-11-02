import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { searchNearbyRestaurants } from '../api/placesApi'
import Filters from '../components/Filters'
import RestaurantCard from '../components/RestaurantCard'
import EmptyState from '../components/EmptyState'
import LocationPrompt from '../components/LocationPrompt'

export default function HomePage() {
  const { state, dispatch } = useApp()
  const [showLocationPrompt, setShowLocationPrompt] = useState(!state.userLocation)

  const fetchRestaurants = useCallback(async () => {
    if (!state.userLocation) return

    dispatch({ type: 'FETCH_START' })
    try {
      const restaurants = await searchNearbyRestaurants(state.userLocation, state.filters)
      dispatch({ type: 'FETCH_SUCCESS', payload: restaurants })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
    }
  }, [state.userLocation, state.filters, dispatch])

  useEffect(() => {
    if (state.userLocation) {
      fetchRestaurants()
    }
  }, [state.userLocation, state.filters, fetchRestaurants])

  const handleLocationSet = () => {
    setShowLocationPrompt(false)
  }

  if (showLocationPrompt || !state.userLocation) {
    return <LocationPrompt onLocationSet={handleLocationSet} />
  }

  const filteredRestaurants = state.restaurants

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Filters />

      {state.loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🍽️</div>
          <p className="text-gray-600">Finding delicious restaurants...</p>
        </div>
      )}

      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p className="font-semibold mb-2">⚠️ {state.error}</p>
          <div className="text-sm mt-2 space-y-1">
            <p>Possible solutions:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Restart the dev server: Stop and run <code className="bg-red-100 px-1 rounded">npm run dev</code> again</li>
              <li>Verify your API key is correct in the <code className="bg-red-100 px-1 rounded">.env</code> file</li>
              <li>Ensure Places API is enabled in Google Cloud Console</li>
              <li>Check if billing is enabled on your Google Cloud project</li>
              <li>If API key has restrictions, allow <code className="bg-red-100 px-1 rounded">localhost:5173</code></li>
            </ul>
          </div>
        </div>
      )}

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

