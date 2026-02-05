'use client'

export default function BeforeAfterComparison({ original, optimized }: { original: string, optimized: any }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold mb-6">Before vs After Comparison</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Before */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-700">Original Resume</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Before</span>
          </div>
          <div className="h-96 overflow-y-auto bg-gray-50 rounded p-4">
            <pre className="text-xs font-mono whitespace-pre-wrap text-gray-600">
              {original}
            </pre>
          </div>
        </div>

        {/* After */}
        <div className="border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-green-700">Optimized Resume</span>
            <span className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">After</span>
          </div>
          <div className="h-96 overflow-y-auto bg-green-50 rounded p-4">
            <pre className="text-xs font-mono whitespace-pre-wrap text-gray-800">
              {typeof optimized === 'string' ? optimized : JSON.stringify(optimized, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Pro Tip:</strong> The optimized version includes targeted keywords from the job description 
          while maintaining your authentic voice and experience.
        </p>
      </div>
    </div>
  )
}
