/**
 * Application Context and State Management
 * Provides global state using React Context and useReducer pattern
 * Manages user location, restaurants, favorites, filters, and app state
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

/**
 * Initial application state
 */
const initialState = {
  userLocation: null,        // { lat: number, lng: number } | null
  restaurants: [],          // Array of restaurant objects
  favorites: [],             // Array of favorited restaurant objects
  filters: {
    cuisine: '',            // Cuisine type filter
    price: '',               // Price level filter (1-4)
    rating: '',              // Minimum rating filter
    search: '',              // Search term filter
    radius: '5'              // Search radius in km (default: 5km)
  },
  selectedRestaurant: null, // Currently selected restaurant object
  loading: false,            // Loading state for API requests
  error: null                // Error message string or null
}

/**
 * Reducer function to manage application state updates
 * Handles all state mutations in a predictable way
 * 
 * @param {Object} state - Current application state
 * @param {Object} action - Action object with type and payload
 * @param {string} action.type - Action type identifier
 * @param {*} action.payload - Action payload data
 * @returns {Object} New application state
 */
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, userLocation: action.payload }
      
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
      
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        restaurants: action.payload, 
        loading: false, 
        error: null 
      }
      
    case 'FETCH_ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      }
      
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      }
      
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload]
      // Persist to localStorage for persistence across sessions
      try {
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
      return { ...state, favorites: newFavorites }
      
    case 'REMOVE_FAVORITE':
      const updatedFavorites = state.favorites.filter(
        fav => fav.place_id !== action.payload
      )
      // Update localStorage when removing favorites
      try {
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      } catch (error) {
        console.error('Error updating favorites in localStorage:', error)
      }
      return { ...state, favorites: updatedFavorites }
      
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload }
      
    case 'SET_SELECTED_RESTAURANT':
      return { ...state, selectedRestaurant: action.payload }
      
    default:
      console.warn(`Unknown action type: ${action.type}`)
      return state
  }
}

/**
 * AppProvider Component
 * Provides application state to all child components
 * Loads favorites from localStorage on mount
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context Provider component
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  /**
   * Load saved favorites from localStorage on component mount
   * Restores user's favorited restaurants from previous sessions
   */
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites)
        dispatch({ type: 'SET_FAVORITES', payload: parsed })
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    }
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Custom hook to access application context
 * Provides state and dispatch function to components
 * 
 * @returns {Object} Context value with state and dispatch
 * @returns {Object} return.state - Current application state
 * @returns {Function} return.dispatch - Dispatch function for state updates
 * @throws {Error} If used outside of AppProvider
 * 
 * @example
 * const { state, dispatch } = useApp()
 * dispatch({ type: 'SET_LOCATION', payload: { lat: 40.7128, lng: -74.0060 } })
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
