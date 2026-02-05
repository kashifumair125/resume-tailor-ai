import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // required by OpenRouter
    'X-Title': 'Resume Tailor AI',
  },
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

    const atsSafeResume = await generateResumeVersion(masterResume, jobDescription, 'atsSafe')
    const impactResume = await generateResumeVersion(masterResume, jobDescription, 'impact')
    const recruiterResume = await generateResumeVersion(masterResume, jobDescription, 'recruiterFriendly')

    const analysis = await analyzeResume(masterResume, jobDescription)

    return NextResponse.json({
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
    })
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
    atsSafe: `You are an ATS optimization expert...`, // keep your full prompt
    impact: `You are a career coach specializing in achievement-focused resumes...`,
    recruiterFriendly: `You are a professional resume writer creating content for human readers...`,
  }

  const response = await client.chat.completions.create({
    model: 'deepseek/deepseek-r1t2-chimera:free',
    temperature: 0.3,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompts[version]
          .replace('${masterResume}', masterResume)
          .replace('${jobDescription}', jobDescription),
      },
    ],
  })

  return response.choices[0]?.message?.content || masterResume
}

async function analyzeResume(
  masterResume: string,
  jobDescription: string
) {
  const analysisPrompt = `You are an ATS and resume analysis expert...

Master Resume:
${masterResume}

Job Description:
${jobDescription}

Respond in JSON format:
{ ... }`

  const response = await client.chat.completions.create({
    model: 'deepseek/deepseek-r1t2-chimera:free',
    temperature: 0.2,
    max_tokens: 3000,
    messages: [{ role: 'user', content: analysisPrompt }],
  })

  try {
    return JSON.parse(response.choices[0].message.content)
  } catch {
    return {
      atsScore: 70,
      keywordsAdded: [],
      changes: [],
      insights: [],
    }
  }
}
