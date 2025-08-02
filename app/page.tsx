'use client'

import { useState, ChangeEvent } from 'react'

import AddressList from './components/AddressList'
import ApiKeySetup from './components/ApiKeySetup'
import LoadingSpinner from './components/LoadingSpinner'
import MainContent from './components/MainContent'
import PageHeader from './components/PageHeader'
import { useAddressExtraction } from './hooks/useAddressExtraction'
import { useApiKey } from './hooks/useApiKey'

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

  const generateRoute = (avoidHighways: boolean): void => {
    if (extractedAddresses.length === 0) return

    // For Google Maps directions with avoid highways, we need to use a different URL structure
    const origin = 'My+Location'
    const destination = encodeURIComponent(extractedAddresses[extractedAddresses.length - 1].text)
    
    // Build waypoints for intermediate stops
    const waypoints = extractedAddresses.slice(0, -1).map(addr => encodeURIComponent(addr.text))
    
    // Build the URL
    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
    
    // Add waypoints if any
    if (waypoints.length > 0) {
      mapsUrl += `&waypoints=${waypoints.join('|')}`
    }
    
    // Add travel mode and avoid highways parameter
    mapsUrl += '&travelmode=driving'
    if (avoidHighways) {
      mapsUrl += '&avoid=highways'
    }
    
    // Use location.href for mobile to avoid empty tab
    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      window.location.href = mapsUrl
    } else {
      window.open(mapsUrl, '_blank')
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
            onGenerateRoute={generateRoute}
            onReset={resetApp}
          />
        )}
      </div>
    </div>
  )
}
