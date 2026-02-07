import { NextRequest, NextResponse } from 'next/server'
import { generateJakesLaTeX } from '@/lib/templates/jakes-latex'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { resume } = await request.json()

    if (!resume) {
      return NextResponse.json(
        { error: 'No resume provided' },
        { status: 400 }
      )
    }

    // Get resume text
    const resumeText = typeof resume === 'string' ? resume : JSON.stringify(resume, null, 2)

    // Generate LaTeX
    const latexContent = generateJakesLaTeX(resumeText)

    // Return LaTeX file as text
    return new NextResponse(latexContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="resume-jakes-${Date.now()}.tex"`,
      },
    })
  } catch (error) {
    console.error('LaTeX generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate LaTeX file' },
      { status: 500 }
    )
  }
}
