'use client'

import ExtractButton from './ExtractButton'
import FileUpload from './FileUpload'
import ProcessingStatus from './ProcessingStatus'

interface MainContentProps {
  files: File[]
  fileInputKey: number
  loading: boolean
  error: string | null
  progress: number
  hasAddresses: boolean
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearFiles: () => void
  onProcessImages: () => void
  onReset: () => void
}

export default function MainContent({
  files,
  fileInputKey,
  loading,
  error,
  progress,
  hasAddresses,
  onFileSelect,
  onClearFiles,
  onProcessImages,
  onReset,
}: Readonly<MainContentProps>): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-3 sm:mb-4">
      <FileUpload
        files={files}
        fileInputKey={fileInputKey}
        onFileSelect={onFileSelect}
        onClearFiles={onClearFiles}
      />

      {files.length > 0 && !loading && !hasAddresses && <ExtractButton onClick={onProcessImages} />}

      <ProcessingStatus loading={loading} progress={progress} error={error} onReset={onReset} />
    </div>
  )
}
