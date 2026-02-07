'use client'

import { useState } from 'react'
import {
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Copy,
} from 'lucide-react'
import BeforeAfterComparison from './BeforeAfterComparison'
import ChangesPanel from './ChangesPanel'
import ResumePreview from './ResumePreview'

interface ResultsDashboardProps {
  result: any
  onReset: () => void
}

const TEMPLATES = [
  {
    id: 'jakes',
    name: "Jake's Resume",
    description: 'Extremely popular, one-column format',
    icon: '📄'
  },
  {
    id: 'harvard',
    name: 'Harvard',
    description: 'Classic, single-column with elegant serif',
    icon: '🎓'
  },
  {
    id: 'venables',
    name: 'Venables',
    description: 'Professional executive-style',
    icon: '💼'
  },
  {
    id: 'moderncv',
    name: 'ModernCV',
    description: 'Classic LaTeX with sidebar',
    icon: '🔷'
  }
]

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const [activeVersion, setActiveVersion] = useState<'atsSafe' | 'impact' | 'recruiterFriendly'>('atsSafe')
  const [selectedTemplate, setSelectedTemplate] = useState('jakes')

  const activeResumeText = result.versions?.[activeVersion] ?? ''

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: result.versions[activeVersion],
          version: activeVersion,
          template: selectedTemplate,
        }),
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume-${selectedTemplate}-${activeVersion}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(activeResumeText || '')
      // Silent success – UI already communicates intent
    } catch (error) {
      console.error('Copy error:', error)
      alert('Failed to copy text. Please copy manually.')
    }
  }

  const handleDownloadLaTeX = async () => {
    try {
      const response = await fetch('/api/download-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: activeResumeText,
        }),
      })

      if (!response.ok) throw new Error('LaTeX download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume-jakes-${Date.now()}.tex`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('LaTeX download error:', error)
      alert('Failed to download LaTeX file. Please try again.')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Score Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Title & actions */}
        <div className="lg:col-span-8 flex flex-col gap-4 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                Analysis Complete
              </span>
              {result.targetRole && (
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  Target Role: {result.targetRole}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight mb-2 text-slate-900 dark:text-white">
              Optimization Results
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Your resume has been analyzed against the job description. We&apos;ve
              optimized the content to improve ATS ranking and recruiter readability.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleDownloadLaTeX}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
            >
              <Download className="w-4 h-4" />
              <span>Download LaTeX</span>
            </button>
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#283039] hover:bg-slate-50 dark:hover:bg-surface-lighter border border-slate-200 dark:border-transparent text-slate-700 dark:text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Text</span>
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-[#283039] text-slate-500 dark:text-slate-400 rounded-lg text-sm font-medium transition-colors ml-auto sm:ml-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Scan</span>
            </button>
          </div>
        </div>

        {/* Score Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm w-full max-w-sm flex items-center justify-between gap-6">
            <div className="relative w-24 h-24 shrink-0">
              {/* Circular gauge using stroke-dasharray-like effect via SVG */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(result.atsScore ?? 0, 100)}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black ${getScoreColor(result.atsScore ?? 0)}`}>
                  {result.atsScore ?? 0}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  ATS
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ATS Compatibility
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">
                  Improved vs. original
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {result.atsScore >= 80
                  ? 'Excellent match potential.'
                  : result.atsScore >= 60
                  ? 'Good match; room for improvement.'
                  : 'Low match; consider further edits.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace: Tabs + Diff + Sidebar */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Left / Center: versions, preview, diff, changes */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Version Tabs */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
              <div className="flex min-w-max">
                <button
                  onClick={() => setActiveVersion('atsSafe')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors ${
                    activeVersion === 'atsSafe'
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>ATS-Safe</span>
                </button>
                <button
                  onClick={() => setActiveVersion('impact')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors ${
                    activeVersion === 'impact'
                      ? 'text-accent-purple border-b-2 border-accent-purple bg-accent-purple/5'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">rocket_launch</span>
                  <span>Impact Mode</span>
                </button>
                <button
                  onClick={() => setActiveVersion('recruiterFriendly')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors ${
                    activeVersion === 'recruiterFriendly'
                      ? 'text-green-500 border-b-2 border-green-500 bg-green-500/5'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">face</span>
                  <span>Recruiter-Friendly</span>
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {activeVersion === 'atsSafe' &&
                  'Optimized for applicant tracking systems with maximum keyword density and clean formatting.'}
                {activeVersion === 'impact' &&
                  'Highlights your most impressive, quantifiable achievements to stand out to hiring managers.'}
                {activeVersion === 'recruiterFriendly' &&
                  'Balances keywords and readability for a polished, human-friendly narrative.'}
              </p>

              {/* Text Preview */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] p-4 max-h-[320px] overflow-y-auto">
                <ResumePreview resume={activeResumeText} />
              </div>

              {/* Template Selector + Download */}
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                      Choose Resume Template
                    </h4>
                    <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ATS Optimized
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-primary/60'
                        }`}
                      >
                        <div className="text-xl mb-1">{template.icon}</div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {template.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-3 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-800 dark:text-slate-50 mb-1">
                      Export settings
                    </p>
                    <p>
                      <span className="font-semibold">Selected template:</span>{' '}
                      {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Version:</span> {activeVersion}
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/25 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Diff & Changes (stacked like lower section of dashboard) */}
          <div className="space-y-4">
            <BeforeAfterComparison
              original={result.originalResume}
              optimized={activeResumeText}
            />
            <ChangesPanel changes={result.changes} />
          </div>
        </div>

        {/* Right Sidebar: Keywords, risks, insights */}
        <aside className="flex flex-col gap-4">
          {/* Keywords Card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-orange-400">warning</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Missing / Added Keywords
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              These high-value keywords appear in the job description and are now
              emphasized in your optimized resume.
            </p>
            <div className="flex flex-wrap gap-2">
              {(result.keywordsAdded ?? []).slice(0, 10).map((kw: string, idx: number) => (
                <span
                  key={`${kw}-${idx}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {kw}
                </span>
              ))}
              {(!result.keywordsAdded || result.keywordsAdded.length === 0) && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  No specific keywords highlighted.
                </span>
              )}
            </div>
          </div>

          {/* Risk / Insight Card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">policy</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Risk Analysis
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {result.insights && result.insights.length > 0 ? (
                result.insights.map((insight: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {insight.message}
                      </p>
                      {insight.action && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {insight.action}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No major risks detected for this job match.
                </p>
              )}
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-5 overflow-hidden">
            <div className="absolute right-0 top-0 -mt-4 -mr-4 w-20 h-20 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Pro Tip
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-100 font-medium">
                Use strong, action-oriented verbs and quantify your impact wherever
                possible (e.g. &quot;Increased revenue by 30%&quot; instead of
                &quot;Helped with sales&quot;).
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
