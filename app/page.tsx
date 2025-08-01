'use client'

import { useState, useEffect, ChangeEvent } from 'react'

interface Address {
  text: string
  order: number
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('')
  const [isApiKeySet, setIsApiKeySet] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [extractedAddresses, setExtractedAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim() && typeof window !== 'undefined') {
      localStorage.setItem('claude_api_key', apiKey)
      setIsApiKeySet(true)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setError(null)
    }
  }

  const processImages = async () => {
    if (files.length === 0) return

    setLoading(true)
    setError(null)
    setExtractedAddresses([])
    setProgress(0)

    const addresses: Address[] = []
    
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress((i / files.length) * 100)
        
        const formData = new FormData()
        formData.append('image', files[i])
        const storedKey = typeof window !== 'undefined' ? localStorage.getItem('claude_api_key') : null
        formData.append('apiKey', storedKey || '')

        const response = await fetch('/api/extract-addresses', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to process image')
        }

        const data = await response.json()
        addresses.push(...data.addresses.map((addr: string, idx: number) => ({
          text: addr,
          order: i * 100 + idx
        })))
      }

      setProgress(100)
      setExtractedAddresses(addresses.sort((a, b) => a.order - b.order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const removeAddress = (orderToRemove: number) => {
    setExtractedAddresses(extractedAddresses.filter(addr => addr.order !== orderToRemove))
  }

  const generateRoute = () => {
    if (extractedAddresses.length === 0) return

    // Start from current location (Google Maps uses 'My+Location' or empty string)
    const stops = ['My+Location', ...extractedAddresses.map(addr => encodeURIComponent(addr.text))]
    const mapsUrl = 'https://www.google.com/maps/dir/' + stops.join('/')
    
    window.open(mapsUrl, '_blank')
  }

  const resetApp = () => {
    setFiles([])
    setExtractedAddresses([])
    setError(null)
    setProgress(0)
  }

  const changeApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('claude_api_key')
    }
    setApiKey('')
    setIsApiKeySet(false)
    resetApp()
  }

  // Check for saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('claude_api_key')
    if (savedKey) {
      setApiKey(savedKey)
      setIsApiKeySet(true)
    } else if (process.env.NEXT_PUBLIC_HAS_ENV_KEY === 'true') {
      // If env key is set on server, skip API key input
      setIsApiKeySet(true)
    }
  }, [])

  if (!isApiKeySet) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Route Generator</h1>
            <p className="text-gray-600">Extract addresses from screenshots and create routes</p>
          </header>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Setup Claude API</h2>
            <p className="text-gray-600 mb-6">
              Enter your Claude API key to extract addresses from images. Your key is stored locally and never sent to our servers.
            </p>
            
            <form onSubmit={handleApiKeySubmit}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none mb-4"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Save API Key
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              Get your API key from{' '}
              <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                console.anthropic.com
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Route Generator</h1>
          <p className="text-gray-600">Extract addresses from screenshots and create routes</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">API Key: Configured</span>
            <button
              onClick={changeApiKey}
              className="text-sm text-blue-600 hover:underline"
            >
              Change
            </button>
          </div>

          <div className="mb-6">
            <label className="block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600">
                  {files.length > 0 
                    ? `${files.length} image${files.length > 1 ? 's' : ''} selected`
                    : 'Click to select screenshots'
                  }
                </p>
              </div>
            </label>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {files.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {files.length > 0 && !loading && extractedAddresses.length === 0 && (
            <button
              onClick={processImages}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Extract Addresses
            </button>
          )}

          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-600 mb-2">Processing images...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={resetApp}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {extractedAddresses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Route Plan ({extractedAddresses.length} stops)</h2>
              <div className="space-y-2 mb-6">
                {/* Starting location */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-600">📍</span>
                    <span className="text-blue-700 font-medium">Your Current Location</span>
                  </div>
                  <span className="text-xs text-blue-600 uppercase tracking-wide">Start</span>
                </div>
                {extractedAddresses.map((addr, idx) => (
                  <div key={addr.order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{idx + 1}.</span>
                      <span className="text-gray-700">{addr.text}</span>
                    </div>
                    <button
                      onClick={() => removeAddress(addr.order)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remove this address"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {extractedAddresses.length > 0 ? (
                <div className="flex gap-4">
                  <button
                    onClick={generateRoute}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Open in Google Maps
                  </button>
                  <button
                    onClick={resetApp}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">All addresses have been removed</p>
                  <button
                    onClick={resetApp}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}