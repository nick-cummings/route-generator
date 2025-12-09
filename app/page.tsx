'use client'

import { useState, useMemo, ChangeEvent } from 'react'

import AddressList from './components/AddressList'
import ApiKeySetup from './components/ApiKeySetup'
import LoadingSpinner from './components/LoadingSpinner'
import MainContent from './components/MainContent'
import PageHeader from './components/PageHeader'
import { useAddressExtraction } from './hooks/useAddressExtraction'
import { useApiKey } from './hooks/useApiKey'

interface Address {
  text: string
  order: number
}

export default function Home(): React.JSX.Element {
  const [files, setFiles] = useState<File[]>([])
  const [fileInputKey, setFileInputKey] = useState(0)

  const { apiKey, isApiKeySet, isInitialized, setApiKey, saveApiKey, clearApiKey } = useApiKey()
  const {
    extractedAddresses,
    loading,
    error,
    progress,
    processImages,
    removeAddress,
    resetExtraction,
  } = useAddressExtraction()

  const routeUrl = useMemo(() => buildMapsUrl(extractedAddresses), [extractedAddresses])

  const handleApiKeySubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    saveApiKey(apiKey)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const fileList = e.target.files
      const newFiles: File[] = []
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i)
        if (file) {
          newFiles.push(file)
        }
      }
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      setFileInputKey((prev) => prev + 1)
    }
  }

  const resetApp = (): void => {
    setFiles([])
    resetExtraction()
    setFileInputKey((prev) => prev + 1)
  }

  if (!isInitialized) return <LoadingSpinner />

  if (!isApiKeySet) {
    return <ApiKeySetup apiKey={apiKey} onApiKeyChange={setApiKey} onSubmit={handleApiKeySubmit} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          onChangeApiKey={() => {
            clearApiKey()
            resetApp()
          }}
        />

        <MainContent
          files={files}
          fileInputKey={fileInputKey}
          loading={loading}
          error={error}
          progress={progress}
          hasAddresses={extractedAddresses.length > 0}
          onFileSelect={handleFileSelect}
          onClearFiles={() => {
            setFiles([])
          }}
          onProcessImages={() => void processImages(files)}
          onReset={resetApp}
        />

        {extractedAddresses.length > 0 && (
          <AddressList
            addresses={extractedAddresses}
            onRemoveAddress={removeAddress}
            onGenerateRoute={() => routeUrl && openRoute(routeUrl)}
            onCopyLink={() => routeUrl && copyRouteLink(routeUrl)}
            onReset={resetApp}
          />
        )}
      </div>
    </div>
  )
}

function buildMapsUrl(addresses: Address[]): string | null {
  const lastAddress = addresses.at(-1)
  if (!lastAddress) return null

  const origin = 'My+Location'
  const destination = encodeURIComponent(lastAddress.text)
  const waypoints = addresses.slice(0, -1).map((addr) => encodeURIComponent(addr.text))

  let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`

  if (waypoints.length > 0) {
    mapsUrl += `&waypoints=${waypoints.join('|')}`
  }

  mapsUrl += '&travelmode=driving'
  return mapsUrl
}

function openRoute(url: string): void {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    globalThis.location.href = url
  } else {
    window.open(url, '_blank')
  }
}

function copyRouteLink(url: string): void {
  void navigator.clipboard.writeText(url)
}
