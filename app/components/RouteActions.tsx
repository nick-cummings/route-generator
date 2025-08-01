'use client'

import { useLanguage } from '../contexts/LanguageContext'

interface RouteActionsProps {
  onGenerateRoute: () => void
  onReset: () => void
}

export default function RouteActions({
  onGenerateRoute,
  onReset,
}: Readonly<RouteActionsProps>): React.JSX.Element {
  const { t } = useLanguage()

  return (
    <div className="fixed sm:sticky bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto flex flex-col sm:flex-row gap-2 sm:gap-4 flex-shrink-0 bg-white p-3 sm:p-0 sm:pt-4 border-t border-gray-200 sm:border-t-0 shadow-lg sm:shadow-none z-10">
      <button
        onClick={onGenerateRoute}
        type="button"
        className="flex-1 bg-green-500 text-white py-3 sm:py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-base sm:text-base shadow-sm"
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
        {t.actions.openInGoogleMaps}
      </button>
      <button
        onClick={onReset}
        type="button"
        className="px-6 sm:px-6 py-3 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base sm:text-base shadow-sm"
      >
        {t.common.reset}
      </button>
    </div>
  )
}
