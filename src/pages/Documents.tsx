import { useRef, useState } from 'react'
import {
  CheckCircle2,
  FileSearch,
  FileText,
  LoaderCircle,
  Trash2,
  UploadCloud,
} from 'lucide-react'

import GlassPanel from '../components/GlassPanel'
import { scanDocument } from '../api/athsApi'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ACCEPTED_TYPES = ['.pdf', '.docx', '.txt']

function Documents() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const validateFile = (selectedFile: File) => {
    const extension =
      `.${selectedFile.name.split('.').pop()?.toLowerCase() || ''}`

    if (!ACCEPTED_TYPES.includes(extension)) {
      setError('Please select a PDF, DOCX, or TXT file.')
      return false
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('The selected file must be smaller than 20 MB.')
      return false
    }

    return true
  }

  const selectFile = (selectedFile: File) => {
    setError('')
    setMessage('')

    if (!validateFile(selectedFile)) {
      return
    }

    setFile(selectedFile)
  }

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      selectFile(selectedFile)
    }

    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const droppedFile = event.dataTransfer.files?.[0]

    if (droppedFile) {
      selectFile(droppedFile)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setError('')
    setMessage('')
  }

  const handleScan = async () => {
    if (!file) {
      setError('Choose a document before scanning.')
      return
    }

    setError('')
    setMessage('')
    setIsScanning(true)

    try {
      await scanDocument(file)
    } catch (error) {
      const errorMessage =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Document scanning is currently unavailable.'

      setError(errorMessage)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Document intelligence
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Scan a document.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
          Upload a supported document for extraction and document-level
          threat analysis when the document scanning API is available.
        </p>
      </div>

      <GlassPanel className="p-6 sm:p-10">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileInput}
          className="hidden"
        />

        {!file ? (
          <div
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-[360px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed px-6 text-center transition ${
              isDragging
                ? 'border-slate-500 bg-white/50'
                : 'border-slate-300/70 bg-white/25'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/60 shadow-sm">
              <UploadCloud className="h-7 w-7 text-slate-600" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Drop your document here
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Supported formats: PDF, DOCX, and TXT.
              <br />
              Maximum file size: 20 MB.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 rounded-full bg-[#111318] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Choose File
            </button>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/70 bg-white/35 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/60">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isScanning}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white/50 px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-white/75 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111318] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isScanning ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FileSearch className="h-4 w-4" />
                    Scan Document
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="rounded-full border border-white/80 bg-white/45 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-white/70 disabled:opacity-50"
              >
                Choose Another
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/40 p-4 text-sm text-slate-600">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/50 p-4 text-sm text-slate-600">
            {error}
          </div>
        )}
      </GlassPanel>

      <GlassPanel className="mt-5 p-8">
        <div className="flex items-center gap-3">
          <FileSearch className="h-5 w-5 text-slate-400" />

          <div>
            <h2 className="font-semibold">
              Document scanning API
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              The current FastAPI backend does not expose a document
              scanning endpoint yet. File selection and validation are
              available, but no document result is fabricated.
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default Documents