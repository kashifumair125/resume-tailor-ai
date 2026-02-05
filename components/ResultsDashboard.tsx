'use client'

import { useState } from 'react'
import { Download, RefreshCw, AlertTriangle, CheckCircle, TrendingUp, FileText } from 'lucide-react'
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
    <div className="max-w-7xl mx-auto">
      {/* Header with Score */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Resume Optimization Complete!</h2>
            <p className="text-gray-600">Review your tailored resumes below</p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            New Resume
          </button>
        </div>

        {/* ATS Score */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${getScoreBg(result.atsScore)} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">ATS Match Score</span>
              <TrendingUp className={`w-5 h-5 ${getScoreColor(result.atsScore)}`} />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}>
              {result.atsScore}/100
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {result.atsScore >= 80 ? 'Excellent match!' : result.atsScore >= 60 ? 'Good, but can improve' : 'Needs improvement'}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Keywords Added</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {result.keywordsAdded?.length || 0}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {result.keywordsAdded?.slice(0, 3).join(', ') || 'None'}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Total Changes</span>
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-4xl font-bold text-purple-600">
              {result.changes?.length || 0}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Optimizations made
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      {result.insights && result.insights.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Why You Might Get Rejected (and How to Fix It)
          </h3>
          <ul className="space-y-2">
            {result.insights.map((insight: any, idx: number) => (
              <li key={idx} className="text-sm text-amber-800">
                <span className="font-medium">• {insight.message}</span>
                {insight.action && (
                  <span className="text-amber-700"> → {insight.action}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Version Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveVersion('atsSafe')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeVersion === 'atsSafe'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🎯 ATS-Safe Resume
            </button>
            <button
              onClick={() => setActiveVersion('impact')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeVersion === 'impact'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              💪 Impact Resume
            </button>
            <button
              onClick={() => setActiveVersion('recruiterFriendly')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeVersion === 'recruiterFriendly'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              👔 Recruiter-Friendly
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600">
            {activeVersion === 'atsSafe' && '✅ Optimized for applicant tracking systems with maximum keyword density'}
            {activeVersion === 'impact' && '✅ Emphasizes achievements and measurable outcomes'}
            {activeVersion === 'recruiterFriendly' && '✅ Balanced and readable for human reviewers'}
          </div>

          <ResumePreview resume={result.versions[activeVersion]} />

          {/* Template Selector */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Choose Resume Template</h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate === template.id
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow'
                  }`}
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="font-semibold text-sm text-gray-800 mb-1">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
              <strong>Selected:</strong> {TEMPLATES.find(t => t.id === selectedTemplate)?.name} - 
              {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download as {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
            </button>
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <BeforeAfterComparison 
        original={result.originalResume}
        optimized={result.versions[activeVersion]}
      />

      {/* Changes Panel */}
      <ChangesPanel changes={result.changes} />
    </div>
  )
}
