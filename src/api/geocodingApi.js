/**
 * Google Geocoding API Integration
 * Converts location names/addresses to coordinates
 */

/**
 * Geocodes an address or location name to geographic coordinates
 * Uses Google Maps Geocoding API to convert text to lat/lng
 * 
 * @param {string} address - Location name or address (e.g., "New York", "Kuala Lumpur")
 * @returns {Promise<Object>} Geocoded location data
 * @returns {number} return.lat - Latitude coordinate
 * @returns {number} return.lng - Longitude coordinate
 * @returns {string} return.formatted_address - Formatted address from Google
 * @throws {Error} If Google Maps API is not loaded or geocoding fails
 */
export function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    // Validate Google Maps API is loaded
    if (!window.google?.maps?.Geocoder) {
      reject(new Error('Google Maps API is not loaded yet. Please wait a moment and try again.'))
      return
    }

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results?.length > 0) {
        const location = results[0].geometry.location
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address
        })
      } else if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
        reject(new Error('Location not found. Please try a different area or town name.'))
      } else if (status === window.google.maps.GeocoderStatus.REQUEST_DENIED) {
        reject(new Error('Geocoding request denied. Please check your API key settings.'))
      } else {
        reject(new Error(`Geocoding failed: ${status}`))
      }
    })
  })
}
