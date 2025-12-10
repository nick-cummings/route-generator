export interface ValidationResult {
  status: 'pending' | 'validating' | 'valid' | 'invalid' | 'error'
  errors: string[]
  nominatimVerified?: boolean
  lastValidated?: number
}

export interface Address {
  text: string
  order: number
  validation?: ValidationResult
  latitude?: number
  longitude?: number
  useGeocode?: boolean
}
