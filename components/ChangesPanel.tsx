'use client'

import { CheckCircle, Plus, Minus, Edit } from 'lucide-react'

export default function ChangesPanel({ changes }: { changes: any[] }) {
  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'keyword_added':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'content_removed':
        return <Minus className="w-4 h-4 text-red-600" />
      case 'bullet_rewritten':
        return <Edit className="w-4 h-4 text-blue-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getChangeBg = (type: string) => {
    switch (type) {
      case 'keyword_added':
        return 'bg-green-50 border-green-200'
      case 'content_removed':
        return 'bg-red-50 border-red-200'
      case 'bullet_rewritten':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (!changes || changes.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6">What Changed? ({changes.length} improvements)</h3>
      
      <div className="space-y-4">
        {changes.map((change, idx) => (
          <div key={idx} className={`border-l-4 rounded-lg p-4 ${getChangeBg(change.type)}`}>
            <div className="flex items-start gap-3">
              <div className="mt-1">{getChangeIcon(change.type)}</div>
              <div className="flex-1">
                <div className="font-semibold mb-2 text-gray-800">
                  {change.type === 'keyword_added' && '✓ Keyword Added'}
                  {change.type === 'content_removed' && '✗ Content Removed'}
                  {change.type === 'bullet_rewritten' && '✎ Bullet Point Improved'}
                </div>
                
                {change.original && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Original:</span>
                    <p className="text-sm text-gray-600 line-through mt-1">{change.original}</p>
                  </div>
                )}
                
                {change.updated && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">Updated:</span>
                    <p className="text-sm text-gray-800 font-medium mt-1">{change.updated}</p>
                  </div>
                )}
                
                {change.reason && (
                  <div className="mt-2 p-2 bg-white/50 rounded text-sm text-gray-700">
                    <span className="font-medium">Why:</span> {change.reason}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>📊 Summary:</strong> We've optimized your resume by adding relevant keywords, 
          improving bullet points for impact, and removing content that doesn't match this specific job description.
        </p>
      </div>
    </div>
  )
}
