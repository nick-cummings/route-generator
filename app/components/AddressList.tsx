'use client'

import AddressItem from './AddressItem'
import RouteActions from './RouteActions'

interface Address {
  text: string
  order: number
}

interface AddressListProps {
  addresses: Address[]
  onRemoveAddress: (order: number) => void
  onGenerateRoute: () => void
  onReset: () => void
}

export default function AddressList({
  addresses,
  onRemoveAddress,
  onGenerateRoute,
  onReset,
}: Readonly<AddressListProps>): React.JSX.Element {
  const addressCount = addresses.length

  if (addressCount === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">All addresses have been removed</p>
        <button
          onClick={onReset}
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex-shrink-0">
        Route Plan ({String(addressCount)} stops)
      </h2>
      <div className="space-y-2 mb-20 sm:mb-4 sm:max-h-[400px] sm:overflow-y-auto sm:pr-2 flex-grow sm:custom-scrollbar">
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-blue-600">📍</span>
            <span className="text-sm sm:text-base text-blue-700 font-medium">
              Your Current Location
            </span>
          </div>
          <span className="text-xs text-blue-600 uppercase tracking-wide">Start</span>
        </div>
        {addresses.map((addr, idx) => (
          <AddressItem
            key={addr.order}
            text={addr.text}
            order={addr.order}
            index={idx}
            onRemove={onRemoveAddress}
          />
        ))}
      </div>
      <RouteActions onGenerateRoute={onGenerateRoute} onReset={onReset} />
    </div>
  )
}
