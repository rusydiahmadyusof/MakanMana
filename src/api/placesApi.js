/**
 * Google Places API Integration
 * Handles restaurant search, caching, and data transformation
 */

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// In-memory cache for API responses
const cache = new Map()

/**
 * Initializes and returns Google Places Service instance
 * Creates a dummy map element required by PlacesService
 * @returns {google.maps.places.PlacesService} - Google Places Service instance
 * @throws {Error} If Google Maps API is not loaded
 */
function getPlacesService() {
  if (!window.google?.maps?.places) {
    throw new Error('Google Maps Places API is not loaded. Please wait for it to initialize.')
  }

  // Create a dummy map (required for PlacesService initialization)
  if (!window.placesMap) {
    const dummyDiv = document.createElement('div')
    window.placesMap = new window.google.maps.Map(dummyDiv)
  }

  return new window.google.maps.places.PlacesService(window.placesMap)
}

/**
 * Searches for nearby restaurants using Google Places API
 * Applies filters and caches results for performance
 * 
 * @param {Object} location - User's location coordinates
 * @param {number} location.lat - Latitude
 * @param {number} location.lng - Longitude
 * @param {Object} filters - Filter options for restaurants
 * @param {string} filters.cuisine - Cuisine type filter
 * @param {string} filters.price - Price level filter (1-4)
 * @param {string} filters.rating - Minimum rating filter
 * @param {string} filters.search - Search term filter
 * @param {string} filters.radius - Search radius in kilometers (default: 5km)
 * @returns {Promise<Array>} Array of restaurant objects
 * @throws {Error} If API key is missing or API request fails
 */
export function searchNearbyRestaurants(location, filters = {}) {
  return new Promise((resolve, reject) => {
    // Validate API key
    if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'your_api_key_here') {
      reject(new Error('Google Maps API key is not set. Please check your .env file and restart the dev server.'))
      return
    }

    // Validate Google Maps API is loaded
    if (!window.google?.maps?.places) {
      reject(new Error('Google Maps Places API is not loaded yet. Please wait a moment and try again.'))
      return
    }

    const { cuisine, price, rating, search, radius } = filters
    
    // Convert radius from km to meters (default: 5km = 5000m)
    const radiusInMeters = radius ? parseFloat(radius) * 1000 : 5000
    
    // Generate cache key based on location and filters
    const cacheKey = `${location.lat}_${location.lng}_${JSON.stringify(filters)}`

    // Check cache first for performance
    if (cache.has(cacheKey)) {
      console.log('📦 Using cached results')
      resolve(cache.get(cacheKey))
      return
    }

    try {
      const placesService = getPlacesService()
      
      // Create Places API request
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: radiusInMeters,
        type: 'restaurant'
      }

      console.log('🔍 Searching for restaurants near:', location.lat, location.lng, `(radius: ${radiusInMeters}m)`)

      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Transform Google Places results to our application format
          let restaurants = (results || []).map(place => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating || 0,
            price_level: place.price_level || 0,
            types: place.types || [],
            // Extract photo URLs immediately (Photo objects aren't serializable)
            photos: (place.photos || []).map(photo => {
              try {
                // Try to get URL using getUrl() method
                if (photo.getUrl && typeof photo.getUrl === 'function') {
                  return photo.getUrl({ maxWidth: 800 })
                }
                // Fallback: if photo has photo_reference property directly
                if (photo.photo_reference) {
                  return {
                    photo_reference: photo.photo_reference,
                    url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
                  }
                }
              } catch (e) {
                console.warn('Error processing photo:', e, photo)
              }
              return null
            }).filter(url => url !== null).map(photo => {
              // Normalize to always return URL string
              if (typeof photo === 'string') {
                return photo
              }
              if (typeof photo === 'object' && photo.url) {
                return photo.url
              }
              return photo
            }),
            geometry: place.geometry ? {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            } : null,
            vicinity: place.vicinity,
            opening_hours: place.opening_hours,
            user_ratings_total: place.user_ratings_total || 0
          }))

          // Apply client-side filters
          if (cuisine) {
            restaurants = restaurants.filter(r => 
              r.types.some(type => type.toLowerCase().includes(cuisine.toLowerCase()))
            )
          }

          if (price) {
            const priceLevel = parseInt(price)
            restaurants = restaurants.filter(r => r.price_level === priceLevel)
          }

          if (rating) {
            const minRating = parseFloat(rating)
            restaurants = restaurants.filter(r => r.rating >= minRating)
          }

          if (search) {
            const searchLower = search.toLowerCase()
            restaurants = restaurants.filter(r => 
              r.name.toLowerCase().includes(searchLower) ||
              r.types.some(type => type.toLowerCase().includes(searchLower))
            )
          }

          // Cache the results for future use
          cache.set(cacheKey, restaurants)

          // Persist cache to sessionStorage
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(restaurants))
          } catch (e) {
            // Ignore sessionStorage errors (quota exceeded, private mode, etc.)
            console.warn('Could not save to sessionStorage:', e)
          }

          console.log(`✅ Found ${restaurants.length} restaurants`)
          resolve(restaurants)
          
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log('ℹ️ No restaurants found')
          resolve([])
          
        } else {
          // Handle API errors with user-friendly messages
          let errorMessage = `Places API Error: ${status}`
          
          if (status === window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
            errorMessage = 'API Request Denied: Check if Places API is enabled and API key is valid. Make sure billing is enabled.'
          } else if (status === window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
            errorMessage = 'Invalid Request: Check your location coordinates'
          } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            errorMessage = 'API Quota Exceeded: You have exceeded your API quota'
          }
          
          console.error('❌ Places API Error:', status)
          reject(new Error(errorMessage))
        }
      })
      
    } catch (error) {
      console.error('❌ Error in searchNearbyRestaurants:', error)
      reject(error)
    }
  })
}

// Load cache from sessionStorage on initialization
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.includes('_')) {
        try {
          const value = JSON.parse(sessionStorage.getItem(key))
          cache.set(key, value)
        } catch (e) {
          // Ignore parse errors for corrupted cache entries
          console.warn('Failed to parse cached data:', key)
        }
      }
    }
  } catch (e) {
    // Ignore sessionStorage access errors
    console.warn('Could not load cache from sessionStorage:', e)
  }
}
