interface PageHeaderProps {
  onChangeApiKey: () => void
}

export default function PageHeader({
  onChangeApiKey,
}: Readonly<PageHeaderProps>): React.JSX.Element {
  return (
    <>
      <header className="text-center mb-4 sm:mb-8 pt-4 sm:pt-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
          Route Generator
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Extract addresses from screenshots and create routes
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm text-gray-600">API Key: Configured</span>
          <button
            onClick={onChangeApiKey}
            type="button"
            className="text-xs sm:text-sm text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>
      </div>
    </>
  )
}
