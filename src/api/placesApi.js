const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

// Cache for API responses (sessionStorage)
const cache = new Map()

export async function searchNearbyRestaurants(location, filters = {}) {
  // Check if API key is set
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'your_api_key_here') {
    throw new Error('Google Places API key is not set. Please check your .env file and restart the dev server.')
  }

  const { cuisine, price, rating, search } = filters
  const cacheKey = `${location.lat}_${location.lng}_${JSON.stringify(filters)}`

  // Check cache first
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  try {
    // First, search for nearby places
    const nearbyUrl = `${PLACES_BASE_URL}/nearbysearch/json?location=${location.lat},${location.lng}&radius=2000&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
    
    const response = await fetch(nearbyUrl)
    
    // Handle network errors
    if (!response.ok) {
      const errorText = await response.text()
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error_message || `HTTP ${response.status}: ${response.statusText}`)
      } catch (e) {
        throw new Error(`Failed to fetch restaurants: ${response.status} ${response.statusText}`)
      }
    }

    const data = await response.json()
    
    // Handle Google API errors
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      let errorMessage = data.error_message || 'API error'
      
      // Provide helpful error messages for common issues
      if (data.status === 'REQUEST_DENIED') {
        errorMessage = `API Request Denied: ${data.error_message || 'Check if Places API is enabled and API key is valid'}`
      } else if (data.status === 'INVALID_REQUEST') {
        errorMessage = `Invalid Request: ${data.error_message || 'Check your location coordinates'}`
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        errorMessage = `API Quota Exceeded: ${data.error_message || 'You have exceeded your API quota'}`
      }
      
      throw new Error(errorMessage)
    }

    let restaurants = (data.results || []).map(place => ({
      place_id: place.place_id,
      name: place.name,
      rating: place.rating || 0,
      price_level: place.price_level || 0,
      types: place.types || [],
      photos: place.photos || [],
      geometry: place.geometry,
      vicinity: place.vicinity,
      opening_hours: place.opening_hours,
      user_ratings_total: place.user_ratings_total || 0
    }))

    // Apply filters
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

    // Cache the results
    cache.set(cacheKey, restaurants)

    // Store in sessionStorage for persistence
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(restaurants))
    } catch (e) {
      // Ignore sessionStorage errors
    }

    return restaurants
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw error
  }
}

// Load cache from sessionStorage on init
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.includes('_')) {
        try {
          const value = JSON.parse(sessionStorage.getItem(key))
          cache.set(key, value)
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  } catch (e) {
    // Ignore sessionStorage errors
  }
}

