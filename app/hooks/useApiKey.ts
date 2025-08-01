import { useState, useEffect } from 'react'

interface UseApiKeyReturn {
  apiKey: string
  isApiKeySet: boolean
  isInitialized: boolean
  setApiKey: (key: string) => void
  saveApiKey: (key: string) => void
  clearApiKey: () => void
}

export function useApiKey(): UseApiKeyReturn {
  const [apiKey, setApiKey] = useState<string>('')
  const [isApiKeySet, setIsApiKeySet] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('claude_api_key')
    if (savedKey) {
      setApiKey(savedKey)
      setIsApiKeySet(true)
    } else if (process.env.NEXT_PUBLIC_HAS_ENV_KEY === 'true') {
      setIsApiKeySet(true)
    }
    setIsInitialized(true)
  }, [])

  const saveApiKey = (key: string): void => {
    if (key.trim().length > 0) {
      localStorage.setItem('claude_api_key', key)
      setApiKey(key)
      setIsApiKeySet(true)
    }
  }

  const clearApiKey = (): void => {
    localStorage.removeItem('claude_api_key')
    setApiKey('')
    setIsApiKeySet(false)
  }

  return {
    apiKey,
    isApiKeySet,
    isInitialized,
    setApiKey,
    saveApiKey,
    clearApiKey,
  }
}
