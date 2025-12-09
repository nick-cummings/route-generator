'use client'

import { ChangeEvent } from 'react'

import { useLanguage } from '../contexts/LanguageContext'

interface FileUploadProps {
  files: File[]
  fileInputKey: number
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FileUpload({
  files,
  fileInputKey,
  onFileSelect,
}: Readonly<FileUploadProps>): React.JSX.Element {
  const { t } = useLanguage()
  const fileCount = files.length

  return (
    <div className="mb-6">
      <label className="block">
        <input
          key={fileInputKey}
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm sm:text-base text-gray-600">
            {fileCount > 0
              ? (() => {
                  const count = String(fileCount)
                  const imageText =
                    fileCount > 1 ? t.fileUpload.imagesSelected : t.fileUpload.imageSelected
                  return `${count} ${imageText}`
                })()
              : t.fileUpload.clickToSelect}
          </p>
          {fileCount > 0 && (
            <p className="text-xs text-gray-500 mt-1">{t.fileUpload.clickAgain}</p>
          )}
        </div>
      </label>
    </div>
  )
}

interface FileThumbnailsProps {
  files: File[]
  thumbnailsExpanded: boolean
  onToggleThumbnails: () => void
  onClearFiles: () => void
}

export function FileThumbnails({
  files,
  thumbnailsExpanded,
  onToggleThumbnails,
  onClearFiles,
}: Readonly<FileThumbnailsProps>): React.JSX.Element {
  const { t } = useLanguage()
  const fileCount = files.length

  if (fileCount === 0) {
    return <></>
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <button
          type="button"
          onClick={onToggleThumbnails}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <svg
            className={`w-4 h-4 transition-transform ${thumbnailsExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {String(fileCount)}{' '}
          {fileCount > 1 ? t.fileUpload.screenshotsReady : t.fileUpload.readyToProcess}
        </button>
        <button
          onClick={onClearFiles}
          type="button"
          className="text-sm text-red-600 hover:text-red-700 p-1"
        >
          {t.common.clearAll}
        </button>
      </div>
      {thumbnailsExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {files.map((file, idx) => (
            <div key={idx} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${String(idx + 1)}`}
                className="w-full h-48 sm:h-32 object-cover rounded-lg shadow-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                {String(idx + 1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
