import { useApp } from '../context/AppContext'
import RestaurantCard from '../components/RestaurantCard'
import EmptyState from '../components/EmptyState'
import { motion } from 'framer-motion'

export default function FavoritesPage() {
  const { state } = useApp()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-manrope font-bold text-3xl text-brand-dark mb-2">
          Your Favorites ❤️
        </h1>
        <p className="text-gray-600">
          {state.favorites.length === 0
            ? 'Save restaurants you love to find them here later.'
            : `You have ${state.favorites.length} favorite restaurant${state.favorites.length !== 1 ? 's' : ''}.`}
        </p>
      </motion.div>

      {state.favorites.length === 0 ? (
        <EmptyState
          emoji="🍕"
          message="No favorites yet. Start exploring and add restaurants you love!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.favorites.map((restaurant) => (
            <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  )
}

