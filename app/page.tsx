'use client'

import { useRef, useState } from 'react'
import UploadSection from '@/components/UploadSection'
import ResultsDashboard from '@/components/ResultsDashboard'

export default function Home() {
  const [step, setStep] = useState<'upload' | 'results'>('upload')
  const [optimizationResult, setOptimizationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const workspaceRef = useRef<HTMLDivElement | null>(null)

  const handleOptimize = async (
    masterResume: string,
    jobDescription: string,
    resumeFile: File | null
  ) => {
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
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-10 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-purple text-white">
            <span className="material-symbols-outlined text-[20px]">description</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            ResumeTailor AI
          </h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-8">
            <button
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={scrollToWorkspace}
            >
              How it works
            </button>
            <a
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              href="#workspace"
            >
              Workspace
            </a>
          </div>
          <button
            className="flex h-9 cursor-pointer items-center justify-center rounded-lg bg-primary hover:bg-blue-600 px-5 text-white text-sm font-semibold transition-all"
            onClick={scrollToWorkspace}
          >
            <span>Get Started</span>
          </button>
        </div>
        {/* Mobile Menu Icon */}
        <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {step === 'upload' && (
        <>
          {/* Hero Section */}
          <section className="relative px-4 py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col items-center text-center gap-8">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    ATS-Friendly Algorithm
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 max-w-4xl">
                  Beat the Bots. <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-primary via-blue-400 to-accent-purple bg-clip-text text-transparent">
                    Get Hired Faster.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Stop getting rejected by machines. Our AI optimizes your resume
                  keywords to match job descriptions instantly, ensuring you pass
                  Applicant Tracking Systems (ATS) every time.
                </p>
                {/* Upload CTA style block */}
                <div className="w-full max-w-2xl mt-8">
                  <div
                    className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-surface-light/50 dark:bg-surface-dark/50 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer shadow-lg dark:shadow-none"
                    onClick={scrollToWorkspace}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-primary text-4xl">
                          cloud_upload
                        </span>
                      </div>
                      <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
                        <span className="text-primary">Click to upload</span> or drag
                        and drop
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        PDF, DOCX (Max 5MB)
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-4 ring-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-green-500">
                        check_circle
                      </span>
                      100% Secure
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-green-500">
                        check_circle
                      </span>
                      ATS Parsable
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-green-500">
                        check_circle
                      </span>
                      No Signup Required
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-white dark:bg-[#0b1120] border-t border-slate-100 dark:border-slate-800/50">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex flex-col gap-4 mb-16 md:text-center md:items-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  How It Works
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  Three simple steps to transform your generic resume into a
                  job-winning application.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent z-0" />
                <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm mb-6 group-hover:border-primary/50 group-hover:shadow-primary/20 group-hover:shadow-lg transition-all duration-300">
                    <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">
                      upload_file
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    1. Upload Resume
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                    Drag and drop your current resume. We support all major
                    ATS-friendly formats like PDF and Word.
                  </p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm mb-6 group-hover:border-accent-purple/50 group-hover:shadow-accent-purple/20 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 group-hover:text-accent-purple transition-colors relative z-10">
                      auto_fix_high
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    2. AI Analysis
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                    Our AI engine scans your content, identifies gaps, and injects
                    high-ranking keywords.
                  </p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm mb-6 group-hover:border-green-500/50 group-hover:shadow-green-500/20 group-hover:shadow-lg transition-all duration-300">
                    <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 group-hover:text-green-500 transition-colors">
                      download_done
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    3. Download Optimized
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                    Receive a perfectly formatted, ATS-compliant version ready for
                    submission.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats & Benefits */}
          <section className="py-20 px-4 bg-background-light dark:bg-background-dark">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent-purple rounded-2xl opacity-20 blur-xl" />
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl bg-surface-dark">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-900">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="p-6 bg-[#1e293b]">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-white font-medium">Resume Score</h4>
                          <p className="text-slate-400 text-sm">
                            Based on job description match
                          </p>
                        </div>
                        <div className="text-3xl font-bold text-green-400">
                          94/100
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Keyword Match</span>
                            <span className="text-primary">High</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-1.5 rounded-full w-[92%]" />
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Formatting</span>
                            <span className="text-accent-purple">Perfect</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-accent-purple h-1.5 rounded-full w-[98%]" />
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Brevity</span>
                            <span className="text-green-500">Good</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-green-500 h-1.5 rounded-full w-[85%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 flex flex-col gap-6">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Why choose ResumeTailor AI?
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    We've analyzed thousands of job descriptions to understand
                    exactly what recruiters and bots are looking for.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Success Rate
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        95%
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        Interviews landed
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Optimized
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        10k+
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        Resumes processed
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Time Saved
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        5hrs
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        Average per user
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Privacy
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        AES-256
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        Bank-level security
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Workspace */}
          <section
            id="workspace"
            ref={workspaceRef}
            className="py-16 px-4 bg-background-light dark:bg-background-dark border-t border-slate-200/60 dark:border-slate-800/60"
          >
            <div className="container mx-auto max-w-7xl">
              <UploadSection onOptimize={handleOptimize} isLoading={isLoading} />
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="bg-gradient-to-b from-surface-dark to-background-dark border border-slate-800 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Ready to land your dream job?
                  </h2>
                  <p className="text-lg text-slate-400 max-w-xl">
                    Join job seekers who are getting hired faster with
                    AI-optimized resumes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                    <button
                      className="flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-900/20 transition-all w-full sm:w-auto"
                      onClick={scrollToWorkspace}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        upload_file
                      </span>
                      <span>Upload Resume Now</span>
                    </button>
                    <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all w-full sm:w-auto">
                      <span>View Sample</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    No credit card required for first scan.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {step === 'results' && optimizationResult && (
        <section className="flex-1 py-8 px-4 md:px-6 lg:px-10 bg-background-light dark:bg-background-dark">
          <ResultsDashboard result={optimizationResult} onReset={handleReset} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </div>
                <span className="text-base font-bold dark:text-white">Resume AI</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Empowering job seekers with AI technology to beat the ATS and get
                hired.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Resume Templates
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add navigation logic later
                    }}
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} Resume AI Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  // Add social links later
                }}
                aria-label="Twitter"
              >
                <span className="sr-only">Twitter</span>
                <div className="w-5 h-5 bg-current rounded-sm opacity-50" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  // Add social links later
                }}
                aria-label="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <div className="w-5 h-5 bg-current rounded-sm opacity-50" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
