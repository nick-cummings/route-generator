import { useState } from 'react'

import { extractAddressesFromImages } from '../services/addressExtraction'

interface Address {
  text: string
  order: number
}

interface UseAddressExtractionReturn {
  extractedAddresses: Address[]
  loading: boolean
  error: string | null
  progress: number
  processImages: (files: File[]) => Promise<void>
  removeAddress: (order: number) => void
  resetExtraction: () => void
}

export function useAddressExtraction(): UseAddressExtractionReturn {
  const [extractedAddresses, setExtractedAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const processImages = async (files: File[]): Promise<void> => {
    if (files.length === 0) return

    setLoading(true)
    setError(null)
    setExtractedAddresses([])
    setProgress(0)

    try {
      const addresses = await extractAddressesFromImages(files, setProgress)
      setExtractedAddresses(addresses)
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const removeAddress = (orderToRemove: number): void => {
    setExtractedAddresses((prev) => prev.filter((addr) => addr.order !== orderToRemove))
  }

  const resetExtraction = (): void => {
    setExtractedAddresses([])
    setError(null)
    setProgress(0)
  }

  return {
    extractedAddresses,
    loading,
    error,
    progress,
    processImages,
    removeAddress,
    resetExtraction,
  }
}
