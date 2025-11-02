import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  userLocation: null,
  restaurants: [],
  favorites: [],
  filters: { cuisine: '', price: '', rating: '', search: '' },
  selectedRestaurant: null,
  loading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, userLocation: action.payload }
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, restaurants: action.payload, loading: false, error: null }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload]
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      return { ...state, favorites: newFavorites }
    case 'REMOVE_FAVORITE':
      const updatedFavorites = state.favorites.filter(fav => fav.place_id !== action.payload)
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      return { ...state, favorites: updatedFavorites }
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload }
    case 'SET_SELECTED_RESTAURANT':
      return { ...state, selectedRestaurant: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites)
        dispatch({ type: 'SET_FAVORITES', payload: parsed })
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

