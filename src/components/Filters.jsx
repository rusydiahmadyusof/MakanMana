/**
 * Filters Component
 * Provides filter controls for searching restaurants
 * Includes search, price, rating, cuisine, and distance filters
 */

import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useDebounce } from '../hooks/useDebounce'

/**
 * Filters Component
 * Renders filter controls with debounced search input
 * 
 * @returns {JSX.Element} Filter controls component
 */
export default function Filters() {
  const { state, dispatch } = useApp()
  
  // Local state for search input (separate from debounced value)
  const [searchValue, setSearchValue] = useState(state.filters.search || '')
  
  // Debounce search input to reduce API calls
  const debouncedSearch = useDebounce(searchValue, 500)

  /**
   * Updates search filter when debounced value changes
   * Dispatches SET_FILTERS action with debounced search term
   */
  useEffect(() => {
    dispatch({ type: 'SET_FILTERS', payload: { search: debouncedSearch } })
  }, [debouncedSearch, dispatch])

  /**
   * Handles filter changes for select inputs
   * Updates filter state via dispatch
   * 
   * @param {string} key - Filter key (price, rating, cuisine, radius)
   * @param {string} value - Filter value
   */
  const handleFilterChange = (key, value) => {
    dispatch({ type: 'SET_FILTERS', payload: { [key]: value } })
  }

  return (
    <div className="bg-brand-light p-4 rounded-xl shadow-soft mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Search
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search name or cuisine..."
            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none bg-white"
          />
        </div>

        {/* Price Level Filter */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Price Level
          </label>
          <select
            value={state.filters.price || ''}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none bg-white"
          >
            <option value="">All Prices</option>
            <option value="1">$ - Budget</option>
            <option value="2">$$ - Moderate</option>
            <option value="3">$$$ - Expensive</option>
            <option value="4">$$$$ - Very Expensive</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Min Rating
          </label>
          <select
            value={state.filters.rating || ''}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none bg-white"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ ⭐</option>
            <option value="4.0">4.0+ ⭐</option>
            <option value="3.5">3.5+ ⭐</option>
            <option value="3.0">3.0+ ⭐</option>
          </select>
        </div>

        {/* Cuisine Filter */}
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Cuisine
          </label>
          <input
            type="text"
            value={state.filters.cuisine || ''}
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            placeholder="e.g., Italian, Asian..."
            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-300 focus:outline-none bg-white"
          />
        </div>
      </div>
    </div>
  )
}
