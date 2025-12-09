import type { Address } from '../types/address'

/**
 * Validates an address string using basic rules
 * @param text The address string to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateAddressBasic(text: string): string[] {
  const errors: string[] = []
  const trimmed = text.trim()

  // Check if empty or whitespace-only
  if (trimmed.length === 0) {
    errors.push('Address is empty')
    return errors
  }

  // Check minimum length
  if (trimmed.length < 5) {
    errors.push('Address too short')
  }

  // Check if contains numbers (street addresses have house numbers)
  if (!/\d/.test(trimmed)) {
    errors.push('Missing house number')
  }

  // Check if not only numbers (needs street name)
  if (/^\d+$/.test(trimmed)) {
    errors.push('Missing street name')
  }

  return errors
}

/**
 * Helper to check if an address has passed validation
 * @param address The address object to check
 * @returns true if address is valid
 */
export function isAddressValid(address: Address): boolean {
  return address.validation?.status === 'valid'
}
