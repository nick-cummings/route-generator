'use client'

import { useLanguage } from '../contexts/LanguageContext'

interface ProcessingStatusProps {
  loading: boolean
  progress: number
  error: string | null
  onReset: () => void
}

export default function ProcessingStatus({
  loading,
  progress,
  error,
  onReset,
}: Readonly<ProcessingStatusProps>): React.JSX.Element | null {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600 mb-2">{t.extraction.processing}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${String(progress)}%` }}
          ></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={onReset}
          type="button"
          className="mt-3 text-sm text-red-600 hover:underline p-1"
        >
          {t.common.tryAgain}
        </button>
      </div>
    )
  }

  return null
}
