interface AddressItemProps {
  text: string
  order: number
  index: number
  onRemove: (order: number) => void
  removeTooltip: string
}

export default function AddressItem({
  text,
  order,
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
        <span className="text-sm text-gray-700 truncate">{text}</span>
      </div>
      <button
        onClick={() => onRemove(order)}
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
