import { useState, useRef, useEffect } from 'react'

import { useLanguage } from '../contexts/LanguageContext'
import type { Address, ValidationResult } from '../types/address'

interface AddressItemProps {
  address: Address
  index: number
  onRemove: (order: number) => void
  onEdit: (order: number) => void
  onToggleGeocode: (order: number) => void
  onCopy: (text: string) => void
  onOpen: (text: string) => void
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
  onEdit,
  onToggleGeocode,
  onCopy,
  onOpen,
}: Readonly<AddressItemProps>): React.JSX.Element {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuAbove, setMenuAbove] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [menuOpen])

  // Check if menu should open above to avoid going off-screen
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const menuHeight = 280 // Approximate height of menu with 5 items
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top

      // If not enough space below and more space above, show menu above
      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        setMenuAbove(true)
      } else {
        setMenuAbove(false)
      }
    }
  }, [menuOpen])

  const handleMenuAction = (action: () => void): void => {
    action()
    setMenuOpen(false)
  }

  const geocodeText =
    address.latitude !== undefined && address.longitude !== undefined
      ? `${String(address.latitude)},${String(address.longitude)}`
      : address.text

  const textToCopy = address.useGeocode ? geocodeText : address.text

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-500 w-4 flex-shrink-0">
          {String(index + 1)}.
        </span>
        <span className="text-sm text-gray-700 truncate">{address.text}</span>
        <ValidationIcon validation={address.validation} />
        {address.useGeocode && (
          <span className="flex-shrink-0" title="Using geocode coordinates">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </span>
        )}
      </div>
      <div className="relative flex-shrink-0 ml-2" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          title="More options"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
        {menuOpen && (
          <div
            className={`absolute right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 ${
              menuAbove ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            <div className="py-1">
              <MenuButton
                icon={<OpenIcon />}
                label={t.addressList.open}
                onClick={() => handleMenuAction(() => onOpen(address.text))}
              />
              <MenuButton
                icon={<CopyIcon />}
                label={t.addressList.copy}
                onClick={() => handleMenuAction(() => onCopy(textToCopy))}
              />
              <MenuButton
                icon={<GeocodeIcon />}
                label={address.useGeocode ? t.addressList.useAddress : t.addressList.useGeocode}
                onClick={() => handleMenuAction(() => onToggleGeocode(address.order))}
              />
              <MenuButton
                icon={<EditIcon />}
                label={t.addressList.edit}
                onClick={() => handleMenuAction(() => onEdit(address.order))}
              />
              <div className="border-t border-gray-200" />
              <MenuButton
                icon={<RemoveIcon />}
                label={t.addressList.remove}
                onClick={() => handleMenuAction(() => onRemove(address.order))}
                className="text-red-600 hover:bg-red-50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface MenuButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}

function MenuButton({ icon, label, onClick, className = '' }: Readonly<MenuButtonProps>): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function OpenIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}

function CopyIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function GeocodeIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EditIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}

function RemoveIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}
