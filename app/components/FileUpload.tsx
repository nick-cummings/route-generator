'use client'

import { ChangeEvent } from 'react'

interface FileUploadProps {
  files: File[]
  fileInputKey: number
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
  onClearFiles: () => void
}

export default function FileUpload({
  files,
  fileInputKey,
  onFileSelect,
  onClearFiles,
}: Readonly<FileUploadProps>): React.JSX.Element {
  const fileCount = files.length

  return (
    <>
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
                    const plural = fileCount > 1 ? 's' : ''
                    return `${count} image${plural} selected`
                  })()
                : 'Click to select screenshots'}
            </p>
            {fileCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">Click again to add more screenshots</p>
            )}
          </div>
        </label>
      </div>

      {fileCount > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              {String(fileCount)} screenshot{fileCount > 1 ? 's' : ''} ready to process
            </span>
            <button
              onClick={onClearFiles}
              type="button"
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file, idx) => (
              <div key={idx} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${String(idx + 1)}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
