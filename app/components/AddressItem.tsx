import type { Address, ValidationResult } from '../types/address'

interface AddressItemProps {
  address: Address
  index: number
  onRemove: (order: number) => void
  removeTooltip: string
}

function ValidationIcon({
  validation,
}: Readonly<{ validation?: ValidationResult }>): React.JSX.Element | null {
  if (!validation || validation.status === 'pending') {
    return null
  }

  if (validation.status === 'validating') {
    return (
      <svg
        className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }

  if (validation.status === 'valid') {
    return (
      <svg
        className="w-4 h-4 text-green-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }

  // Invalid or error status
  const errorMessage = validation.errors.join(', ') || 'Address validation failed'
  return (
    <span title={errorMessage} className="flex-shrink-0">
      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </span>
  )
}

export default function AddressItem({
  address,
  index,
  onRemove,
  removeTooltip,
}: Readonly<AddressItemProps>): React.JSX.Element {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-500 w-4 flex-shrink-0">
          {String(index + 1)}.
        </span>
        <span className="text-sm text-gray-700 truncate">{address.text}</span>
        <ValidationIcon validation={address.validation} />
      </div>
      <button
        onClick={() => onRemove(address.order)}
        type="button"
        className="text-red-500 hover:text-red-700 transition-colors p-1 flex-shrink-0 ml-2"
        title={removeTooltip}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
