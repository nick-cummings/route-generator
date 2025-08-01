'use client'

import { FormEvent } from 'react'

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
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6 pt-4 sm:pt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Route Generator</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Extract addresses from screenshots and create routes
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Setup Claude API</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Enter your Claude API key to extract addresses from images. Your key is stored locally
            and never sent to our servers.
          </p>

          <form onSubmit={onSubmit}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                onApiKeyChange(e.target.value)
              }}
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
