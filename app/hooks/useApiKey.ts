import { useState, useEffect } from 'react'

export type ApiProvider = 'anthropic' | 'openai'

interface UseApiKeyReturn {
  apiKey: string
  provider: ApiProvider
  isApiKeySet: boolean
  isInitialized: boolean
  setApiKey: (key: string) => void
  setProvider: (provider: ApiProvider) => void
  saveApiKey: (key: string, provider: ApiProvider) => void
  clearApiKey: () => void
}

export function useApiKey(): UseApiKeyReturn {
  const [apiKey, setApiKey] = useState<string>('')
  const [provider, setProvider] = useState<ApiProvider>('anthropic')
  const [isApiKeySet, setIsApiKeySet] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('ai_api_key')
    const savedProvider = (localStorage.getItem('ai_provider') as ApiProvider) || 'anthropic'

    if (savedKey) {
      setApiKey(savedKey)
      setProvider(savedProvider)
      setIsApiKeySet(true)
    } else if (
      process.env.NEXT_PUBLIC_HAS_ANTHROPIC_KEY === 'true' ||
      process.env.NEXT_PUBLIC_HAS_OPENAI_KEY === 'true'
    ) {
      // Check which env key is available and set provider accordingly
      if (process.env.NEXT_PUBLIC_HAS_OPENAI_KEY === 'true') {
        setProvider('openai')
      }
      setIsApiKeySet(true)
    }
    setIsInitialized(true)
  }, [])

  const saveApiKey = (key: string, selectedProvider: ApiProvider): void => {
    if (key.trim().length > 0) {
      localStorage.setItem('ai_api_key', key)
      localStorage.setItem('ai_provider', selectedProvider)
      setApiKey(key)
      setProvider(selectedProvider)
      setIsApiKeySet(true)
    }
  }

  const clearApiKey = (): void => {
    localStorage.removeItem('ai_api_key')
    localStorage.removeItem('ai_provider')
    setApiKey('')
    setProvider('anthropic')
    setIsApiKeySet(false)
  }

  return {
    apiKey,
    provider,
    isApiKeySet,
    isInitialized,
    setApiKey,
    setProvider,
    saveApiKey,
    clearApiKey,
  }
}
