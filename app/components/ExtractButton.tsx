'use client'

import { useLanguage } from '../contexts/LanguageContext'

interface ExtractButtonProps {
  onClick: () => void
}

export default function ExtractButton({
  onClick,
}: Readonly<ExtractButtonProps>): React.JSX.Element {
  const { t } = useLanguage()

  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full bg-green-500 text-white py-3 sm:py-3.5 rounded-lg font-medium hover:bg-green-600 transition-colors text-base sm:text-base shadow-sm"
    >
      {t.extraction.extractAddresses}
    </button>
  )
}
