const REQUEST_DELAY_MS = 1100 // Slightly over 1 second for safety

interface QueueItem {
  address: string
  resolve: (result: NominatimValidationResult) => void
}

export interface NominatimValidationResult {
  verified: boolean
  error?: string
}

/**
 * Queue-based validator for Nominatim API with rate limiting
 * Ensures 1 request per second to comply with Nominatim usage policy
 */
class NominatimValidator {
  private queue: QueueItem[] = []
  private processing = false
  private lastRequestTime = 0

  /**
   * Validate an address using Nominatim geocoding API
   * @param address The address string to validate
   * @returns Promise with validation result
   */
  async validateAddress(address: string): Promise<NominatimValidationResult> {
    return new Promise((resolve) => {
      this.queue.push({ address, resolve })
      if (!this.processing) {
        void this.processQueue()
      }
    })
  }

  /**
   * Process the validation queue with rate limiting
   */
  private async processQueue(): Promise<void> {
    this.processing = true

    while (this.queue.length > 0) {
      const item = this.queue.shift()!

      // Enforce rate limit: wait if needed
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime
      if (timeSinceLastRequest < REQUEST_DELAY_MS) {
        await this.delay(REQUEST_DELAY_MS - timeSinceLastRequest)
      }

      // Make API call
      try {
        const results = await this.searchAddress(item.address)
        this.lastRequestTime = Date.now()

        // Address is verified if Nominatim returns any results
        item.resolve({
          verified: results.length > 0,
          error: undefined,
        })
      } catch (error) {
        item.resolve({
          verified: false,
          error: error instanceof Error ? error.message : 'API error',
        })
      }
    }

    this.processing = false
  }

  /**
   * Search for an address using our API proxy to Nominatim
   * @param address The address string to search for
   * @returns Validation result from API
   */
  private async searchAddress(address: string): Promise<unknown[]> {
    const params = new URLSearchParams({
      address,
    })

    const response = await fetch(`/api/validate-address?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Validation API error: ${response.status}`)
    }

    const data = (await response.json()) as { verified: boolean; results: unknown[] }
    return data.results
  }

  /**
   * Delay helper for rate limiting
   * @param ms Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const nominatimValidator = new NominatimValidator()
