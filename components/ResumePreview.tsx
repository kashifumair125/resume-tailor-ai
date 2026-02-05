'use client'

export default function ResumePreview({ resume }: { resume: any }) {
  // Handle both string and object formats
  const resumeText = typeof resume === 'string' ? resume : JSON.stringify(resume, null, 2)

  return (
    <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
          {resumeText}
        </pre>
      </div>
    </div>
  )
}
