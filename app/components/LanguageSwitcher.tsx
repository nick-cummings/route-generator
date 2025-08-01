'use client'

import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher(): React.JSX.Element {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          setLanguage('en')
        }}
        type="button"
        className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => {
          setLanguage('es')
        }}
        type="button"
        className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
          language === 'es'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ES
      </button>
    </div>
  )
}
