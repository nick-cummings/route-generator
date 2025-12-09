'use client'

import { useState } from 'react'

import { useLanguage } from '../contexts/LanguageContext'

import AddressItem from './AddressItem'

interface Address {
  text: string
  order: number
}

interface RouteChunkCardProps {
  chunkIndex: number
  totalChunks: number
  addresses: Address[]
  startingPoint: string
  onOpenRoute: () => void
  onCopyLink: () => void
  onRemoveAddress: (order: number) => void
  onDeleteChunk: () => void
}

export default function RouteChunkCard({
  chunkIndex,
  totalChunks,
  addresses,
  startingPoint,
  onOpenRoute,
  onCopyLink,
  onRemoveAddress,
  onDeleteChunk,
}: Readonly<RouteChunkCardProps>): React.JSX.Element {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const handleCopyLink = (): void => {
    onCopyLink()
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const showChunkLabel = totalChunks > 1
  const routeLabel = showChunkLabel
    ? `${t.actions.route} ${String(chunkIndex + 1)} of ${String(totalChunks)}`
    : t.actions.route

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-3 py-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{routeLabel}</span>
          <span className="text-xs text-gray-500">({String(addresses.length)} stops)</span>
        </button>
        <button
          type="button"
          onClick={onDeleteChunk}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title={t.actions.deleteRoute}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {expanded && (
        <>
          <div className="p-3 space-y-2">
            <StartingPointRow startingPoint={startingPoint} label={t.addressList.start} />
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
          <ActionButtons
            onOpenRoute={onOpenRoute}
            onCopyLink={handleCopyLink}
            copied={copied}
            openLabel={t.actions.openInGoogleMaps}
            copyLabel={t.actions.copyLink}
            copiedLabel={t.actions.linkCopied}
          />
        </>
      )}
    </div>
  )
}

function StartingPointRow({
  startingPoint,
  label,
}: Readonly<{ startingPoint: string; label: string }>): React.JSX.Element {
  return (
    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-blue-600">📍</span>
        <span className="text-sm text-blue-700 font-medium truncate">{startingPoint}</span>
      </div>
      <span className="text-xs text-blue-600 uppercase tracking-wide flex-shrink-0">{label}</span>
    </div>
  )
}

interface ActionButtonsProps {
  onOpenRoute: () => void
  onCopyLink: () => void
  copied: boolean
  openLabel: string
  copyLabel: string
  copiedLabel: string
}

function ActionButtons({
  onOpenRoute,
  onCopyLink,
  copied,
  openLabel,
  copyLabel,
  copiedLabel,
}: Readonly<ActionButtonsProps>): React.JSX.Element {
  return (
    <div className="flex gap-2 p-3 pt-0">
      <button
        onClick={onOpenRoute}
        type="button"
        className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {openLabel}
      </button>
      <button
        onClick={onCopyLink}
        type="button"
        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          )}
        </svg>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}
