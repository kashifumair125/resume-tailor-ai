'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Briefcase, ArrowRight } from 'lucide-react'

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
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Transform Your Resume for Every Job
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          AI-powered optimization that beats ATS systems
        </p>
        <p className="text-sm text-gray-500">
          Get 3 tailored resume versions + detailed insights in under 2 minutes
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Resume Upload Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Your Master Resume</h3>
          </div>

          {/* Upload Method Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadMethod('paste')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                uploadMethod === 'paste'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setUploadMethod('upload')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                uploadMethod === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
          </div>

          {uploadMethod === 'paste' ? (
            <textarea
              value={masterResume}
              onChange={(e) => setMasterResume(e.target.value)}
              placeholder="Paste your resume text here...

Example:
John Doe
Software Engineer

EXPERIENCE
- Led development of web applications
- Managed team of 5 developers
..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
            />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-all cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX, or TXT (Max 5MB)</p>
            </div>
          )}
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-200 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Target Job Description</h3>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here...

Example:
We're looking for a Senior Software Engineer with:
- 5+ years experience in Python
- Strong knowledge of SQL and databases
- Experience with AWS cloud services
- Proven leadership abilities
..."
            className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
          />
        </div>
      </div>

      {/* Optimize Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !masterResume.trim() || !jobDescription.trim()}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Optimizing Your Resume...
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              Optimize Resume Now
            </>
          )}
        </button>
      </div>

      {/* Features Preview */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <h4 className="font-semibold mb-2">ATS-Optimized</h4>
          <p className="text-sm text-gray-600">Beat applicant tracking systems with keyword optimization</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="font-semibold mb-2">3 Resume Versions</h4>
          <p className="text-sm text-gray-600">Get ATS-Safe, Impact, and Recruiter-Friendly versions</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💡</span>
          </div>
          <h4 className="font-semibold mb-2">Detailed Insights</h4>
          <p className="text-sm text-gray-600">See exactly what changed and why it matters</p>
        </div>
      </div>
    </div>
  )
}
