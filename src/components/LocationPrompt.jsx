import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function LocationPrompt({ onLocationSet }) {
  const { dispatch } = useApp()
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [error, setError] = useState(null)

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
        setError('Location access denied. Please enter coordinates manually.')
      }
    )
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Invalid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.')
      return
    }

    const location = { lat, lng }
    dispatch({ type: 'SET_LOCATION', payload: location })
    onLocationSet?.(location)
    setError(null)
    setManualLat('')
    setManualLng('')
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
        <button
          onClick={requestLocation}
          className="w-full px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-amber-600 transition-all hover:scale-105 font-medium shadow-soft"
        >
          Use My Location 📍
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="e.g., 40.7128"
              className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="e.g., -74.0060"
              className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-brand-dark text-white rounded-xl hover:bg-amber-800 transition-colors font-medium"
          >
            Set Location
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

