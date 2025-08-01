interface RouteActionsProps {
  onGenerateRoute: () => void
  onReset: () => void
}

export default function RouteActions({
  onGenerateRoute,
  onReset,
}: Readonly<RouteActionsProps>): React.JSX.Element {
  return (
    <div className="fixed sm:sticky bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto flex flex-col sm:flex-row gap-3 sm:gap-4 flex-shrink-0 bg-white p-4 sm:p-0 sm:pt-4 border-t border-gray-200 sm:border-gray-100 shadow-lg sm:shadow-none z-10">
      <button
        onClick={onGenerateRoute}
        type="button"
        className="flex-1 bg-green-500 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Open in Google Maps
      </button>
      <button
        onClick={onReset}
        type="button"
        className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base shadow-sm"
      >
        Reset
      </button>
    </div>
  )
}
