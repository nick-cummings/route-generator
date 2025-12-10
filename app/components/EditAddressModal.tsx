'use client'

import { useState, useEffect } from 'react'

interface EditAddressModalProps {
  isOpen: boolean
  address: string
  onClose: () => void
  onSave: (newAddress: string) => void
}

export default function EditAddressModal({
  isOpen,
  address,
  onClose,
  onSave,
}: Readonly<EditAddressModalProps>): React.JSX.Element | null {
  const [editedAddress, setEditedAddress] = useState(address)

  useEffect(() => {
    setEditedAddress(address)
  }, [address, isOpen])

  const handleSave = (): void => {
    if (editedAddress.trim()) {
      onSave(editedAddress.trim())
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Address</h2>
        </div>
        <div className="p-4">
          <textarea
            value={editedAddress}
            onChange={(e) => setEditedAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            autoFocus
          />
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!editedAddress.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
