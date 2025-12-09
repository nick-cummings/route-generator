import { useState } from 'react'

import { extractAddressesFromImages } from '../services/addressExtraction'
import { nominatimValidator } from '../services/nominatimValidation'
import type { Address } from '../types/address'
import { validateAddressBasic } from '../utils/addressValidation'

interface UseAddressExtractionReturn {
  extractedAddresses: Address[]
  loading: boolean
  error: string | null
  progress: number
  validating: boolean
  processImages: (files: File[]) => Promise<void>
  removeAddress: (order: number) => void
  resetExtraction: () => void
}

export function useAddressExtraction(): UseAddressExtractionReturn {
  const [extractedAddresses, setExtractedAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [validating, setValidating] = useState(false)

  const validateAddresses = async (addresses: Address[]): Promise<void> => {
    setValidating(true)

    // Step 1: Run basic validation synchronously
    const addressesWithBasicValidation = addresses.map((addr) => {
      const errors = validateAddressBasic(addr.text)

      if (errors.length > 0) {
        // Failed basic validation - mark as invalid
        return {
          ...addr,
          validation: {
            status: 'invalid' as const,
            errors,
            nominatimVerified: false,
          },
        }
      }

      // Passed basic validation - mark as validating (will check Nominatim next)
      return {
        ...addr,
        validation: {
          status: 'validating' as const,
          errors: [],
        },
      }
    })

    setExtractedAddresses(addressesWithBasicValidation)

    // Step 2: Run Nominatim validation asynchronously for addresses that passed basic validation
    for (let i = 0; i < addressesWithBasicValidation.length; i++) {
      const addr = addressesWithBasicValidation[i]

      // Skip addresses that already failed basic validation
      if (addr.validation?.status === 'invalid') {
        continue
      }

      try {
        const result = await nominatimValidator.validateAddress(addr.text)

        // Update this specific address with Nominatim result
        setExtractedAddresses((prev) =>
          prev.map((a) =>
            a.order === addr.order
              ? {
                  ...a,
                  validation: {
                    status: result.verified ? ('valid' as const) : ('error' as const),
                    errors: result.verified ? [] : ['Could not verify address'],
                    nominatimVerified: result.verified,
                    lastValidated: Date.now(),
                  },
                }
              : a
          )
        )
      } catch (error) {
        // Network or API error
        setExtractedAddresses((prev) =>
          prev.map((a) =>
            a.order === addr.order
              ? {
                  ...a,
                  validation: {
                    status: 'error' as const,
                    errors: ['Could not verify address'],
                    nominatimVerified: false,
                  },
                }
              : a
          )
        )
      }
    }

    setValidating(false)
  }

  const processImages = async (files: File[]): Promise<void> => {
    if (files.length === 0) return

    setLoading(true)
    setError(null)
    setExtractedAddresses([])
    setProgress(0)

    try {
      const addresses = await extractAddressesFromImages(files, setProgress)
      setExtractedAddresses(addresses)

      // Start async validation (don't await - runs in background)
      void validateAddresses(addresses)
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
    validating,
    processImages,
    removeAddress,
    resetExtraction,
  }
}
