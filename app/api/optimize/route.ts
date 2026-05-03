import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

/* -------------------- OpenRouter Client -------------------- */
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

/* -------------------- Helpers -------------------- */
function extractJSON(text: string) {
  if (!text) throw new Error('Empty AI response')

  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {}

  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON object found')

  return JSON.parse(match[0])
}

/* -------------------- Route -------------------- */
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

    const [atsSafe, impact, recruiterFriendly, analysis] =
      await Promise.all([
        generateResumeVersion(masterResume, jobDescription, 'atsSafe'),
        generateResumeVersion(masterResume, jobDescription, 'impact'),
        generateResumeVersion(masterResume, jobDescription, 'recruiterFriendly'),
        analyzeResume(masterResume, jobDescription),
      ])

    return NextResponse.json({
      atsScore: analysis.atsScore,
      keywordsAdded: analysis.keywordsAdded,
      changes: analysis.changes,
      insights: analysis.insights,
      originalResume: masterResume,
      versions: {
        atsSafe,
        impact,
        recruiterFriendly,
      },
    })
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    )
  }
}

/* -------------------- Resume Versions -------------------- */
async function generateResumeVersion(
  masterResume: string,
  jobDescription: string,
  version: 'atsSafe' | 'impact' | 'recruiterFriendly'
): Promise<string> {
  const prompts = {
    atsSafe: `
You are an ATS optimization expert.

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Return ONLY the optimized resume text. No explanation.
`,
    impact: `
You are a career coach specializing in impact-driven resumes.

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Return ONLY the optimized resume text. No explanation.
`,
    recruiterFriendly: `
You are a professional resume writer writing for human recruiters.

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Return ONLY the optimized resume text. No explanation.
`,
  }

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content:
          'You are a resume optimization assistant. Follow instructions strictly.',
      },
      {
        role: 'user',
        content: prompts[version],
      },
    ],
  })

  return response.choices[0]?.message?.content || masterResume
}

/* -------------------- Resume Analysis -------------------- */
async function analyzeResume(masterResume: string, jobDescription: string) {
  const prompt = `
Analyze the resume against the job description.

Return VALID JSON ONLY.
No markdown. No explanation.

{
  "atsScore": number,
  "keywordsAdded": string[],
  "changes": [
    {
      "type": "keyword_added" | "bullet_rewritten" | "content_removed",
      "original": string,
      "updated": string,
      "reason": string
    }
  ],
  "insights": [
    {
      "severity": "high" | "medium" | "low",
      "message": string,
      "action": string
    }
  ]
}

Master Resume:
${masterResume}

Job Description:
${jobDescription}
`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    max_tokens: 3000,
    messages: [
      {
        role: 'system',
        content:
          'You are a strict JSON generator. Output valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const rawText = response.choices[0]?.message?.content || ''

  try {
    return extractJSON(rawText)
  } catch (err) {
    console.error('JSON parse failed:', rawText)

    return {
      atsScore: 70,
      keywordsAdded: [],
      changes: [],
      insights: [],
    }
  }
}
