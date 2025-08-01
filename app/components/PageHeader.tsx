'use client'

import { useLanguage } from '../contexts/LanguageContext'

import LanguageSwitcher from './LanguageSwitcher'

interface PageHeaderProps {
  onChangeApiKey: () => void
}

export default function PageHeader({
  onChangeApiKey,
}: Readonly<PageHeaderProps>): React.JSX.Element {
  const { t } = useLanguage()

  return (
    <>
      <header className="text-center mb-4 sm:mb-8 pt-4 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            {t.common.routeGenerator}
          </h1>
          <LanguageSwitcher />
        </div>
        <p className="text-sm sm:text-base text-gray-600">{t.common.extractAddresses}</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-3 sm:mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">{t.apiKey.configured}</span>
          <button
            onClick={onChangeApiKey}
            type="button"
            className="text-xs sm:text-sm text-blue-600 hover:underline"
          >
            {t.common.change}
          </button>
        </div>
      </div>
    </>
  )
}
