import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useDebounce } from '../hooks/useDebounce'

export default function Filters() {
  const { state, dispatch } = useApp()
  const [searchValue, setSearchValue] = useState(state.filters.search || '')
  const debouncedSearch = useDebounce(searchValue, 500)

  useEffect(() => {
    dispatch({ type: 'SET_FILTERS', payload: { search: debouncedSearch } })
  }, [debouncedSearch, dispatch])

  const handleFilterChange = (key, value) => {
    dispatch({ type: 'SET_FILTERS', payload: { [key]: value } })
  }

  return (
    <div className="bg-brand-light p-4 rounded-xl shadow-soft mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

