'use client'

import { useState, useRef } from 'react'

interface UploadSectionProps {
  onOptimize: (masterResume: string, jobDescription: string, resumeFile: File | null) => void
  isLoading: boolean
}

export default function UploadSection({ onOptimize, isLoading }: UploadSectionProps) {
  const [masterResume, setMasterResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'upload'>('paste')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResumeFile(file)
    
    // Extract text from file
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { text } = await response.json()
        setMasterResume(text)
      }
    } catch (error) {
      console.error('Error parsing resume:', error)
      alert('Failed to parse resume file. Please try pasting the text instead.')
    }
  }

  const handleSubmit = () => {
    if (!masterResume.trim() || !jobDescription.trim()) {
      alert('Please provide both your resume and job description')
      return
    }
    onOptimize(masterResume, jobDescription, resumeFile)
  }

  return (
    <div className="flex flex-col items-center justify-start gap-8 w-full">
      {/* Header Text */}
      <div className="flex flex-col gap-2 w-full text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
          Let&apos;s beat the ATS
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-normal max-w-2xl">
          Upload your resume and the job description below to generate a tailored,
          keyword-optimized version in seconds.
        </p>
      </div>

      {/* Workspace Split View */}
      <div className="flex flex-col lg:flex-row w-full gap-6 flex-1 min-h-[500px]">
        {/* Left: Upload Section */}
        <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-border-dark flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">upload_file</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Resume
            </h3>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center">
            {uploadMethod === 'upload' ? (
              <div
                className="h-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary bg-slate-50 dark:bg-[#151b23] rounded-xl flex flex-col items-center justify-center p-8 gap-6 transition-colors group cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-center bg-repeat" />
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    cloud_upload
                  </span>
                </div>
                <div className="text-center space-y-2 relative z-10">
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    Drag &amp; drop your resume here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    or{' '}
                    <span className="text-primary font-bold hover:underline">
                      browse files
                    </span>{' '}
                    from your computer
                  </p>
                  {resumeFile && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 relative z-10">
                  <span className="px-3 py-1 rounded text-xs font-semibold bg-slate-200 dark:bg-border-dark text-slate-600 dark:text-slate-400">
                    PDF
                  </span>
                  <span className="px-3 py-1 rounded text-xs font-semibold bg-slate-200 dark:bg-border-dark text-slate-600 dark:text-slate-400">
                    DOCX
                  </span>
                  <span className="px-3 py-1 rounded text-xs font-semibold bg-slate-200 dark:bg-border-dark text-slate-600 dark:text-slate-400">
                    TXT
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload resume file"
                />
              </div>
            ) : (
              <textarea
                value={masterResume}
                onChange={(e) => setMasterResume(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-64 p-4 border-2 border-slate-200 dark:border-border-dark rounded-xl bg-transparent focus:border-primary focus:outline-none resize-none font-mono text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            )}

            {/* Upload method toggle */}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setUploadMethod('paste')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  uploadMethod === 'paste'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-[#151b23] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('upload')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  uploadMethod === 'upload'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-[#151b23] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>
        </div>

        {/* Right: Job Description */}
        <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-border-dark flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                description
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Job Description
              </h3>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
              onClick={() => setJobDescription('')}
            >
              Clear text
            </button>
          </div>
          <div className="flex-1 p-0 relative">
            <textarea
              className="w-full h-full min-h-[300px] bg-transparent border-0 p-6 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 resize-none text-base leading-relaxed"
              placeholder="Paste the full job description text here. We'll analyze the keywords and requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="absolute bottom-4 right-6 pointer-events-none">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-600 bg-white/80 dark:bg-surface-dark/80 px-2 py-1 rounded backdrop-blur-sm">
                {jobDescription.length} characters
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="w-full flex flex-col items-center justify-center py-6 gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !masterResume.trim() || !jobDescription.trim()}
          className="group relative flex items-center justify-center gap-3 bg-primary hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto min-w-[280px] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="material-symbols-outlined group-hover:animate-pulse">
            auto_awesome
          </span>
          <span>{isLoading ? 'Optimizing Resume…' : 'Optimize Resume'}</span>
        </button>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          By clicking &quot;Optimize Resume&quot;, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  )
}
