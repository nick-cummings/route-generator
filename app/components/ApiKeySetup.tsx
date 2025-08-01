'use client'

import { FormEvent } from 'react'

import { useLanguage } from '../contexts/LanguageContext'

import LanguageSwitcher from './LanguageSwitcher'

interface ApiKeySetupProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
  onSubmit: (e: FormEvent) => void
}

export default function ApiKeySetup({
  apiKey,
  onApiKeyChange,
  onSubmit,
}: Readonly<ApiKeySetupProps>): React.JSX.Element {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6 pt-4 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t.common.routeGenerator}
            </h1>
            <LanguageSwitcher />
          </div>
          <p className="text-sm sm:text-base text-gray-600">{t.common.extractAddresses}</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">{t.apiKey.title}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{t.apiKey.description}</p>

          <form onSubmit={onSubmit}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                onApiKeyChange(e.target.value)
              }}
              placeholder={t.apiKey.placeholder}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              {t.apiKey.save}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            {t.apiKey.getKey}{' '}
            <a
              href="https://console.anthropic.com/account/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              console.anthropic.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
