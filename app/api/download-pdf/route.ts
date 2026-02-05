import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import { jsPDF } from 'jspdf'
import { 
  generateJakesTemplate, 
  generateHarvardTemplate, 
  generateVenablesTemplate, 
  generateModernCVTemplate 
} from '@/lib/templates'

export async function POST(request: NextRequest) {
  try {
    const { resume, version, template = 'jakes' } = await request.json()

    if (!resume) {
      return NextResponse.json(
        { error: 'No resume provided' },
        { status: 400 }
      )
    }

    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Get resume text
    const resumeText = typeof resume === 'string' ? resume : JSON.stringify(resume, null, 2)

    // Apply selected template
    let generatedDoc = doc
    
    switch (template) {
      case 'jakes':
        generatedDoc = generateJakesTemplate(resumeText, doc)
        break
      case 'harvard':
        generatedDoc = generateHarvardTemplate(resumeText, doc)
        break
      case 'venables':
        generatedDoc = generateVenablesTemplate(resumeText, doc)
        break
      case 'moderncv':
        generatedDoc = generateModernCVTemplate(resumeText, doc)
        break
      default:
        generatedDoc = generateJakesTemplate(resumeText, doc)
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(generatedDoc.output('arraybuffer'))

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${template}-${version}-${Date.now()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
