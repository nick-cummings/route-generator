'use client'

import { useState, useEffect } from 'react'

import ExtractButton from './ExtractButton'
import FileUpload, { FileThumbnails } from './FileUpload'
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
  const [thumbnailsExpanded, setThumbnailsExpanded] = useState(true)

  useEffect(() => {
    if (hasAddresses) {
      setThumbnailsExpanded(false)
    }
  }, [hasAddresses])

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-3 sm:mb-4">
      <FileUpload files={files} fileInputKey={fileInputKey} onFileSelect={onFileSelect} />

      {files.length > 0 && !loading && !hasAddresses && <ExtractButton onClick={onProcessImages} />}

      <ProcessingStatus loading={loading} progress={progress} error={error} onReset={onReset} />

      <FileThumbnails
        files={files}
        thumbnailsExpanded={thumbnailsExpanded}
        onToggleThumbnails={() => setThumbnailsExpanded(!thumbnailsExpanded)}
        onClearFiles={onClearFiles}
      />
    </div>
  )
}
