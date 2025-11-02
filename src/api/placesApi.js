const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

// Cache for API responses (sessionStorage)
const cache = new Map()

export async function searchNearbyRestaurants(location, filters = {}) {
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
    if (!response.ok) {
      throw new Error('Failed to fetch restaurants')
    }

    const data = await response.json()
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || 'API error')
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

