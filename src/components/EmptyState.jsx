export default function EmptyState({ emoji = '🍕', message = 'No results found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}

