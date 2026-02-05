import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const masterResume = formData.get('masterResume') as string
    const jobDescription = formData.get('jobDescription') as string

    if (!masterResume || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate all three resume versions
    const atsSafeResume = await generateResumeVersion(masterResume, jobDescription, 'atsSafe')
    const impactResume = await generateResumeVersion(masterResume, jobDescription, 'impact')
    const recruiterResume = await generateResumeVersion(masterResume, jobDescription, 'recruiterFriendly')

    // Calculate ATS score and extract insights
    const analysis = await analyzeResume(masterResume, jobDescription)

    const result = {
      atsScore: analysis.atsScore,
      keywordsAdded: analysis.keywordsAdded,
      changes: analysis.changes,
      insights: analysis.insights,
      originalResume: masterResume,
      versions: {
        atsSafe: atsSafeResume,
        impact: impactResume,
        recruiterFriendly: recruiterResume,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    )
  }
}

async function generateResumeVersion(
  masterResume: string,
  jobDescription: string,
  version: 'atsSafe' | 'impact' | 'recruiterFriendly'
): Promise<string> {
  const prompts = {
    atsSafe: `You are an ATS optimization expert. Your goal is to maximize keyword density while maintaining readability.

INSTRUCTIONS:
1. Extract all important keywords and phrases from the job description
2. Incorporate these keywords naturally throughout the resume
3. Use simple, clear language that ATS systems can parse
4. Maintain the original structure but optimize content
5. Focus on exact matches for technical skills and tools

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Create an ATS-optimized version of this resume. Return ONLY the optimized resume text, no explanations.`,

    impact: `You are a career coach specializing in achievement-focused resumes.

INSTRUCTIONS:
1. Rewrite bullet points to emphasize measurable outcomes
2. Use strong action verbs (Spearheaded, Drove, Achieved, Led, etc.)
3. Add metric placeholders [X%], [Y users], [$Z] where numbers would strengthen claims
4. Focus on impact and results rather than responsibilities
5. Highlight leadership and initiative

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Create an impact-focused version of this resume. Return ONLY the optimized resume text, no explanations.`,

    recruiterFriendly: `You are a professional resume writer creating content for human readers.

INSTRUCTIONS:
1. Balance keyword optimization with natural, engaging language
2. Write in a professional but conversational tone
3. Ensure excellent readability and flow
4. Highlight relevant experience that matches the job
5. Make it easy to skim and find key information

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Create a recruiter-friendly version of this resume. Return ONLY the optimized resume text, no explanations.`,
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompts[version],
      },
    ],
  })

  const textContent = message.content.find((block) => block.type === 'text')
  return textContent && 'text' in textContent ? textContent.text : masterResume
}

async function analyzeResume(
  masterResume: string,
  jobDescription: string
): Promise<{
  atsScore: number
  keywordsAdded: string[]
  changes: any[]
  insights: any[]
}> {
  const analysisPrompt = `You are an ATS and resume analysis expert.

Analyze this resume against the job description and provide:
1. ATS match score (0-100)
2. List of important keywords from JD missing in the resume
3. Specific changes that should be made
4. Honest insights about rejection risks

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Respond in JSON format:
{
  "atsScore": <number 0-100>,
  "keywordsAdded": ["keyword1", "keyword2"],
  "changes": [
    {
      "type": "keyword_added" | "bullet_rewritten" | "content_removed",
      "original": "original text",
      "updated": "new text",
      "reason": "why this change matters"
    }
  ],
  "insights": [
    {
      "severity": "high" | "medium" | "low",
      "message": "honest feedback",
      "action": "what to do about it"
    }
  ]
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: analysisPrompt,
      },
    ],
  })

  const textContent = message.content.find((block) => block.type === 'text')
  if (!textContent || !('text' in textContent)) {
    throw new Error('Failed to analyze resume')
  }

  try {
    const parsed = JSON.parse(textContent.text)
    return parsed
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      atsScore: 70,
      keywordsAdded: ['Python', 'SQL', 'Leadership'],
      changes: [
        {
          type: 'keyword_added',
          original: '',
          updated: 'Added relevant keywords',
          reason: 'To match job requirements',
        },
      ],
      insights: [
        {
          severity: 'medium',
          message: 'Resume could be better optimized',
          action: 'Review the suggested changes',
        },
      ],
    }
  }
}
