'use client'

import { useState, useMemo, ChangeEvent } from 'react'

import AddressList from './components/AddressList'
import ApiKeySetup from './components/ApiKeySetup'
import LoadingSpinner from './components/LoadingSpinner'
import MainContent from './components/MainContent'
import PageHeader from './components/PageHeader'
import { useAddressExtraction } from './hooks/useAddressExtraction'
import { useApiKey } from './hooks/useApiKey'

const MAX_STOPS_PER_ROUTE = 10

interface Address {
  text: string
  order: number
}

export interface RouteChunk {
  id: number
  url: string
  addresses: Address[]
  startingPoint: string
}

export default function Home(): React.JSX.Element {
  const [files, setFiles] = useState<File[]>([])
  const [fileInputKey, setFileInputKey] = useState(0)
  const [deletedChunks, setDeletedChunks] = useState<Set<number>>(new Set())

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

  const allChunks = useMemo(() => buildRouteChunks(extractedAddresses), [extractedAddresses])
  const routeChunks = allChunks.filter((chunk) => !deletedChunks.has(chunk.id))

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
    setDeletedChunks(new Set())
  }

  const handleDeleteChunk = (chunkId: number): void => {
    setDeletedChunks((prev) => {
      const next = new Set(prev)
      next.add(chunkId)
      return next
    })
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

        {routeChunks.length > 0 && (
          <AddressList
            routeChunks={routeChunks}
            onOpenRoute={openRoute}
            onCopyLink={copyRouteLink}
            onRemoveAddress={removeAddress}
            onDeleteChunk={handleDeleteChunk}
            onReset={resetApp}
          />
        )}
      </div>
    </div>
  )
}

function encodeAddress(address: string): string {
  return address.replaceAll(' ', '+')
}

function buildMapsUrl(addresses: Address[], origin: string): string {
  const lastAddress = addresses.at(-1)
  if (!lastAddress) return ''

  const destination = encodeAddress(lastAddress.text)
  const waypoints = addresses.slice(0, -1).map((addr) => encodeAddress(addr.text))

  let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`

  if (waypoints.length > 0) {
    mapsUrl += `&waypoints=${waypoints.join('|')}`
  }

  mapsUrl += '&travelmode=driving'
  return mapsUrl
}

function buildRouteChunks(addresses: Address[]): RouteChunk[] {
  if (addresses.length === 0) return []

  const yourLocation = 'Your Current Location'

  if (addresses.length <= MAX_STOPS_PER_ROUTE) {
    return [{ id: 0, url: buildMapsUrl(addresses, 'My+Location'), addresses, startingPoint: yourLocation }]
  }

  const chunks: RouteChunk[] = []
  let startIndex = 0
  let chunkId = 0
  let origin = 'My+Location'
  let startingPoint = yourLocation

  while (startIndex < addresses.length) {
    const endIndex = Math.min(startIndex + MAX_STOPS_PER_ROUTE, addresses.length)
    const chunkAddresses = addresses.slice(startIndex, endIndex)

    chunks.push({
      id: chunkId,
      url: buildMapsUrl(chunkAddresses, origin),
      addresses: chunkAddresses,
      startingPoint,
    })

    const lastAddress = chunkAddresses.at(-1)
    if (lastAddress) {
      origin = encodeAddress(lastAddress.text)
      startingPoint = lastAddress.text
    }

    startIndex = endIndex
    chunkId++
  }

  return chunks
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
