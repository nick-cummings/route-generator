'use client'

import { useState } from 'react'

import { useLanguage } from '../contexts/LanguageContext'

interface RouteActionsProps {
  onGenerateRoute: () => void
  onCopyLink: () => void
  onReset: () => void
}

export default function RouteActions({
  onGenerateRoute,
  onCopyLink,
  onReset,
}: Readonly<RouteActionsProps>): React.JSX.Element {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = (): void => {
    onCopyLink()
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="fixed sm:sticky bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto flex-shrink-0 bg-white p-3 sm:p-0 sm:pt-4 border-t border-gray-200 sm:border-t-0 shadow-lg sm:shadow-none z-10">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
          onClick={handleCopyLink}
          type="button"
          className="flex-1 bg-blue-500 text-white py-3 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-base sm:text-base shadow-sm"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {copied ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            )}
          </svg>
          {copied ? t.actions.linkCopied : t.actions.copyLink}
        </button>
        <button
          onClick={onReset}
          type="button"
          className="px-6 sm:px-6 py-3 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base sm:text-base shadow-sm"
        >
          {t.common.reset}
        </button>
      </div>
    </div>
  )
}
