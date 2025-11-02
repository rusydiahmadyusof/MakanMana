/**
 * EmptyState Component
 * Displays a message when there are no results or empty states
 * Used across different pages for consistent empty state UI
 */

/**
 * EmptyState Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.emoji - Emoji to display (default: '🍕')
 * @param {string} props.message - Message text to display (default: 'No results found')
 * @returns {JSX.Element} Empty state component
 */
export default function EmptyState({ emoji = '🍕', message = 'No results found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}
