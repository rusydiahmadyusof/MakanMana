/**
 * Custom React Hook: useGoogleMaps
 * Dynamically loads Google Maps JavaScript API and tracks loading state
 * Ensures Places library is available before making API calls
 */

import { useEffect, useState } from 'react'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

/**
 * Hook to load and manage Google Maps JavaScript API
 * Automatically loads the script if not already present
 * 
 * @returns {Object} Hook return value
 * @returns {boolean} return.isLoaded - Whether Google Maps API is fully loaded
 * @returns {Error|null} return.error - Error message if loading failed
 * @returns {Object|null} return.google - Google Maps API object (when loaded)
 */
export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      return
    }

    // Check if script is already being loaded by another component
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for existing script to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsLoaded(true)
          clearInterval(checkInterval)
        }
      }, 100)
      
      return () => clearInterval(checkInterval)
    }

    // Validate API key exists
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is not set')
      return
    }

    // Create and load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (window.google?.maps?.places) {
        setIsLoaded(true)
      } else {
        setError('Google Maps API failed to load')
      }
    }
    
    script.onerror = () => {
      setError('Failed to load Google Maps script')
    }

    document.head.appendChild(script)

    // Cleanup function (script removal is optional)
    return () => {
      // Script remains in DOM for other components to use
    }
  }, [])

  return { isLoaded, error, google: window.google || null }
}
