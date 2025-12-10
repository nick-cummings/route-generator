import type { Address } from '../types/address'

interface ApiResponse {
  addresses?: string[]
  error?: string
}

async function extractFromSingleImage(file: File, fileIndex: number): Promise<Address[]> {
  const formData = new FormData()
  formData.append('image', file)
  const storedKey = localStorage.getItem('ai_api_key')
  const storedProvider = localStorage.getItem('ai_provider')
  formData.append('apiKey', storedKey ?? '')
  formData.append('provider', storedProvider ?? 'anthropic')

  const response = await fetch('/api/extract-addresses', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const data = (await response.json()) as ApiResponse
    throw new Error(data.error ?? 'Failed to process image')
  }

  const data = (await response.json()) as ApiResponse
  if (!data.addresses) {
    return []
  }

  return data.addresses.map((addr: string, idx: number) => ({
    text: addr,
    order: fileIndex * 100 + idx,
    validation: {
      status: 'pending' as const,
      errors: [],
    },
  }))
}

export async function extractAddressesFromImages(
  files: File[],
  onProgress: (progress: number) => void
): Promise<Address[]> {
  const allAddresses: Address[] = []

  for (let i = 0; i < files.length; i++) {
    onProgress((i / files.length) * 100)
    const addresses = await extractFromSingleImage(files[i], i)
    allAddresses.push(...addresses)
  }

  onProgress(100)
  return allAddresses.sort((orderA, orderB) => orderA.order - orderB.order)
}
