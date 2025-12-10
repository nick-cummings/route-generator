'use client'

import { useState, useMemo, ChangeEvent } from 'react'

import AddressList from './components/AddressList'
import ApiKeySetup from './components/ApiKeySetup'
import EditAddressModal from './components/EditAddressModal'
import LoadingSpinner from './components/LoadingSpinner'
import MainContent from './components/MainContent'
import PageHeader from './components/PageHeader'
import { useAddressExtraction } from './hooks/useAddressExtraction'
import { ApiProvider, useApiKey } from './hooks/useApiKey'
import { useGeolocation } from './hooks/useGeolocation'
import type { Address } from './types/address'

const MAX_STOPS_PER_ROUTE = 10

export interface RouteChunk {
  id: number
  url: string
  addresses: Address[]
  startingPoint: string
}

// eslint-disable-next-line max-lines-per-function
export default function Home(): React.JSX.Element {
  const [files, setFiles] = useState<File[]>([])
  const [fileInputKey, setFileInputKey] = useState(0)
  const [deletedChunks, setDeletedChunks] = useState<Set<number>>(new Set())
  const [editingAddress, setEditingAddress] = useState<{ order: number; text: string } | null>(null)

  const { apiKey, provider, isApiKeySet, isInitialized, setApiKey, setProvider, saveApiKey, clearApiKey } =
    useApiKey()
  const {
    extractedAddresses,
    loading,
    error,
    progress,
    processImages,
    removeAddress,
    updateAddress,
    resetExtraction,
  } = useAddressExtraction()
  const { latitude, longitude } = useGeolocation()

  const allChunks = useMemo(
    () => buildRouteChunks(extractedAddresses, latitude, longitude),
    [extractedAddresses, latitude, longitude]
  )
  const routeChunks = allChunks.filter((chunk) => !deletedChunks.has(chunk.id))

  const handleApiKeySubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    saveApiKey(apiKey, provider)
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

  const handleEditAddress = (order: number): void => {
    const address = extractedAddresses.find((addr) => addr.order === order)
    if (address) {
      setEditingAddress({ order, text: address.text })
    }
  }

  const handleSaveEdit = (newText: string): void => {
    if (editingAddress) {
      updateAddress(editingAddress.order, { text: newText })
    }
    setEditingAddress(null)
  }

  const handleToggleGeocode = (order: number): void => {
    const address = extractedAddresses.find((addr) => addr.order === order)
    if (address) {
      updateAddress(order, { useGeocode: !address.useGeocode })
    }
  }


  if (!isInitialized) return <LoadingSpinner />

  if (!isApiKeySet) {
    return (
      <ApiKeySetup
        apiKey={apiKey}
        provider={provider}
        onApiKeyChange={(key: string) => setApiKey(key)}
        onProviderChange={(provider: ApiProvider) => setProvider(provider)}
        onSubmit={handleApiKeySubmit}
      />
    )
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
          <>
            <AddressList
              routeChunks={routeChunks}
              onOpenRoute={openRoute}
              onCopyLink={copyRouteLink}
              onRemoveAddress={removeAddress}
              onEditAddress={handleEditAddress}
              onToggleGeocode={handleToggleGeocode}
              onCopyAddress={copyAddressToClipboard}
              onOpenAddress={openAddressInMaps}
              onDeleteChunk={handleDeleteChunk}
              onReset={resetApp}
            />
            <EditAddressModal
              isOpen={editingAddress !== null}
              address={editingAddress?.text ?? ''}
              onClose={() => setEditingAddress(null)}
              onSave={handleSaveEdit}
            />
          </>
        )}
      </div>
    </div>
  )
}

function encodeAddress(address: string): string {
  return address.replaceAll(' ', '+')
}

function getAddressForUrl(addr: Address): string {
  if (addr.useGeocode && addr.latitude !== undefined && addr.longitude !== undefined) {
    return `${String(addr.latitude)},${String(addr.longitude)}`
  }
  return encodeAddress(addr.text)
}

function buildMapsUrl(addresses: Address[], origin: string): string {
  const lastAddress = addresses.at(-1)
  if (!lastAddress) return ''

  const destination = getAddressForUrl(lastAddress)
  const waypoints = addresses.slice(0, -1).map((addr) => getAddressForUrl(addr))

  let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`

  if (waypoints.length > 0) {
    mapsUrl += `&waypoints=${waypoints.join('|')}`
  }

  mapsUrl += '&travelmode=driving'
  return mapsUrl
}

function buildRouteChunks(
  addresses: Address[],
  latitude: number | null,
  longitude: number | null
): RouteChunk[] {
  if (addresses.length === 0) return []

  const yourLocation = 'Your Current Location'
  const firstOrigin =
    latitude !== null && longitude !== null
      ? `${String(latitude)},${String(longitude)}`
      : 'My+Location'

  if (addresses.length <= MAX_STOPS_PER_ROUTE) {
    return [{ id: 0, url: buildMapsUrl(addresses, firstOrigin), addresses, startingPoint: yourLocation }]
  }

  const chunks: RouteChunk[] = []
  let startIndex = 0
  let chunkId = 0
  let origin = firstOrigin
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
      origin = getAddressForUrl(lastAddress)
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

function copyAddressToClipboard(text: string): void {
  void navigator.clipboard.writeText(text)
}

function openAddressInMaps(text: string): void {
  const encodedAddress = text.replaceAll(' ', '+')
  const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    globalThis.location.href = url
  } else {
    window.open(url, '_blank')
  }
}
