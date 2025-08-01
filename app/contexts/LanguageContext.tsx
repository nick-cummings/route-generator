'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import { en } from '../translations/en'
import { es } from '../translations/es'
import { Language, Translations } from '../translations/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
  en,
  es,
}

export function LanguageProvider({
  children,
}: Readonly<{ children: ReactNode }>): React.JSX.Element {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null
    if (savedLang === 'en' || savedLang === 'es') {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language): void => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
