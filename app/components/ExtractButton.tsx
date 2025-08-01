interface ExtractButtonProps {
  onClick: () => void
}

export default function ExtractButton({
  onClick,
}: Readonly<ExtractButtonProps>): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full bg-green-500 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm sm:text-base"
    >
      Extract Addresses
    </button>
  )
}
