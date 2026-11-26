function RatingPicker({ value, onChange, labels }) {
  return (
    <div className="flex justify-between space-x-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`flex-1 py-3 rounded-lg font-semibold border transition-colors ${
            value === rating
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          <div className="text-lg">{rating}</div>
          {labels && (
            <div className={`text-xs mt-1 ${value === rating ? 'text-white' : 'text-gray-600'}`}>
              {labels[rating]}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default RatingPicker
