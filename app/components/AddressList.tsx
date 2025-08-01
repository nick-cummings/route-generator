'use client'

import { useState } from 'react'

import { useLanguage } from '../contexts/LanguageContext'

import AddressItem from './AddressItem'
import RouteActions from './RouteActions'

interface Address {
  text: string
  order: number
}

interface AddressListProps {
  addresses: Address[]
  onRemoveAddress: (order: number) => void
  onGenerateRoute: (avoidHighways: boolean) => void
  onReset: () => void
}

export default function AddressList({
  addresses,
  onRemoveAddress,
  onGenerateRoute,
  onReset,
}: Readonly<AddressListProps>): React.JSX.Element {
  const { t } = useLanguage()
  const [avoidHighways, setAvoidHighways] = useState(false)
  const addressCount = addresses.length

  if (addressCount === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{t.addressList.allRemoved}</p>
        <button
          onClick={onReset}
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t.common.startOver}
        </button>
      </div>
    )
  }

  const stopsText = addressCount === 1 ? t.addressList.stop : t.addressList.stops

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
      <div className="flex flex-col h-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex-shrink-0">
          {t.addressList.routePlan} ({String(addressCount)} {stopsText})
        </h2>
      <div className="space-y-2 pb-36 sm:pb-0 sm:mb-4 sm:max-h-[400px] sm:overflow-y-auto sm:pr-2 flex-grow sm:custom-scrollbar">
        <div className="flex items-center justify-between p-3 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-blue-600">📍</span>
            <span className="text-sm sm:text-base text-blue-700 font-medium">
              {t.addressList.yourLocation}
            </span>
          </div>
          <span className="text-xs text-blue-600 uppercase tracking-wide">
            {t.addressList.start}
          </span>
        </div>
        {addresses.map((addr, idx) => (
          <AddressItem
            key={addr.order}
            text={addr.text}
            order={addr.order}
            index={idx}
            onRemove={onRemoveAddress}
            removeTooltip={t.addressList.removeAddress}
          />
        ))}
      </div>
        <RouteActions 
          onGenerateRoute={() => onGenerateRoute(avoidHighways)} 
          onReset={onReset}
          avoidHighways={avoidHighways}
          onAvoidHighwaysChange={setAvoidHighways}
        />
      </div>
    </div>
  )
}
