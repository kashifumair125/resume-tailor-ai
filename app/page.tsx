'use client'

import { useState } from 'react'
import { Upload, FileText, Sparkles, ArrowRight } from 'lucide-react'
import UploadSection from '@/components/UploadSection'
import ResultsDashboard from '@/components/ResultsDashboard'

export default function Home() {
  const [step, setStep] = useState<'upload' | 'results'>('upload')
  const [optimizationResult, setOptimizationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOptimize = async (masterResume: string, jobDescription: string, resumeFile: File | null) => {
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('masterResume', masterResume)
      formData.append('jobDescription', jobDescription)
      if (resumeFile) {
        formData.append('resumeFile', resumeFile)
      }

      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Optimization failed')
      }

      const result = await response.json()
      setOptimizationResult(result)
      setStep('results')
    } catch (error) {
      console.error('Error optimizing resume:', error)
      alert('Failed to optimize resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setOptimizationResult(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResumeTailor AI
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Optimize resumes in under 2 minutes
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {step === 'upload' && (
          <UploadSection onOptimize={handleOptimize} isLoading={isLoading} />
        )}

        {step === 'results' && optimizationResult && (
          <ResultsDashboard result={optimizationResult} onReset={handleReset} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Built with AI to help you land your dream job 🚀</p>
        </div>
      </footer>
    </main>
  )
}
