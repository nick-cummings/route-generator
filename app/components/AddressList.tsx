'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { RouteChunk } from '../page'

import RouteChunkCard from './RouteChunkCard'

interface AddressListProps {
  routeChunks: RouteChunk[]
  onOpenRoute: (url: string) => void
  onCopyLink: (url: string) => void
  onRemoveAddress: (order: number) => void
  onEditAddress: (order: number) => void
  onToggleGeocode: (order: number) => void
  onCopyAddress: (text: string) => void
  onOpenAddress: (text: string) => void
  onDeleteChunk: (chunkIndex: number) => void
  onReset: () => void
}

export default function AddressList({
  routeChunks,
  onOpenRoute,
  onCopyLink,
  onRemoveAddress,
  onEditAddress,
  onToggleGeocode,
  onCopyAddress,
  onOpenAddress,
  onDeleteChunk,
  onReset,
}: Readonly<AddressListProps>): React.JSX.Element {
  const { t } = useLanguage()

  const totalAddresses = routeChunks.reduce((sum, chunk) => sum + chunk.addresses.length, 0)

  if (totalAddresses === 0) {
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

  const stopsText = totalAddresses === 1 ? t.addressList.stop : t.addressList.stops

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {t.addressList.routePlan} ({String(totalAddresses)} {stopsText})
          </h2>
          <button
            onClick={onReset}
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t.common.reset}
          </button>
        </div>
        <div className="space-y-4">
          {routeChunks.map((chunk, idx) => (
            <RouteChunkCard
              key={chunk.id}
              chunkIndex={idx}
              totalChunks={routeChunks.length}
              addresses={chunk.addresses}
              startingPoint={chunk.startingPoint}
              onOpenRoute={() => onOpenRoute(chunk.url)}
              onCopyLink={() => onCopyLink(chunk.url)}
              onRemoveAddress={onRemoveAddress}
              onEditAddress={onEditAddress}
              onToggleGeocode={onToggleGeocode}
              onCopyAddress={onCopyAddress}
              onOpenAddress={onOpenAddress}
              onDeleteChunk={() => onDeleteChunk(chunk.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
