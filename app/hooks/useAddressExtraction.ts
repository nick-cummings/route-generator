import { useState } from 'react'

import { extractAddressesFromImages } from '../services/addressExtraction'
import { nominatimValidator } from '../services/nominatimValidation'
import type { Address } from '../types/address'
import { validateAddressBasic } from '../utils/addressValidation'

function applyBasicValidation(addr: Address): Address {
  const errors = validateAddressBasic(addr.text)

  if (errors.length > 0) {
    return {
      ...addr,
      validation: {
        status: 'invalid' as const,
        errors,
        nominatimVerified: false,
      },
    }
  }

  return {
    ...addr,
    validation: {
      status: 'validating' as const,
      errors: [],
    },
  }
}

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

function createUpdatedAddress(
  address: Address,
  order: number,
  status: 'valid' | 'error',
  verified: boolean
): Address {
  if (address.order !== order) {
    return address
  }

  return {
    ...address,
    validation: {
      status,
      errors: verified ? [] : ['Could not verify address'],
      nominatimVerified: verified,
      lastValidated: Date.now(),
    },
  }
}

async function validateSingleAddress(
  addr: Address,
  updateFn: (order: number, status: 'valid' | 'error', verified: boolean) => void
): Promise<void> {
  if (addr.validation?.status === 'invalid') {
    return
  }

  try {
    const result = await nominatimValidator.validateAddress(addr.text)
    updateFn(addr.order, result.verified ? 'valid' : 'error', result.verified)
  } catch {
    updateFn(addr.order, 'error', false)
  }
}

type SetAddressesFn = React.Dispatch<React.SetStateAction<Address[]>>

async function runValidation(
  addresses: Address[],
  setAddresses: SetAddressesFn,
  setValidating: (value: boolean) => void,
  updateFn: (order: number, status: 'valid' | 'error', verified: boolean) => void
): Promise<void> {
  setValidating(true)
  const validated = addresses.map((addr) => applyBasicValidation(addr))
  setAddresses(validated)

  for (const addr of validated) {
    await validateSingleAddress(addr, updateFn)
  }

  setValidating(false)
}

export function useAddressExtraction(): UseAddressExtractionReturn {
  const [extractedAddresses, setExtractedAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [validating, setValidating] = useState(false)

  const updateValidation = (order: number, status: 'valid' | 'error', verified: boolean): void => {
    setExtractedAddresses((prev) => prev.map((addr) => createUpdatedAddress(addr, order, status, verified)))
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
      void runValidation(addresses, setExtractedAddresses, setValidating, updateValidation)
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
