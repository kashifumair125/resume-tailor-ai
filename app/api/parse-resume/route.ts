import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import mammoth from 'mammoth'
// @ts-ignore
import pdf from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    // Parse based on file type
    if (file.name.endsWith('.pdf')) {
      const data = await pdf(buffer)
      text = data.text
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (file.name.endsWith('.txt')) {
      text = buffer.toString('utf-8')
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please use PDF, DOCX, or TXT' },
        { status: 400 }
      )
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    )
  }
}
