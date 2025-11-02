/**
 * Custom React Hook: useDebounce
 * Delays value updates until after a specified delay period
 * Useful for reducing API calls when user is typing
 * 
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} The debounced value
 * 
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500)
 * // searchTerm changes immediately, but debouncedSearch updates after 500ms of no changes
 */
import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: clear timer if value changes before delay completes
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
