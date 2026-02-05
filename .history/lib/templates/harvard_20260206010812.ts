import { jsPDF } from 'jspdf'

export function generateHarvardTemplate(resumeData: any, doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let y = 25

  const primaryColor = '#1a1a1a'
  const accentColor = '#8B0000' // Harvard crimson
  
  const checkPageBreak = (height: number) => {
    if (y + height > doc.internal.pageSize.height - 20) {
      doc.addPage()
      y = 25
    }
  }

  // Parse resume data
  const lines = resumeData.split('\n')
  let name = ''
  let contact = ''
  let currentSection = ''

  const sections: any = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  }

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    if (line.match(/^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|PROFESSIONAL SUMMARY)/i)) {
      currentSection = line.toLowerCase().replace(/[:\s]/g, '')
      if (currentSection.includes('professional')) currentSection = 'summary'
      continue
    }

    // Use first clean line as name (no contact/link markers)
    if (
      !name &&
      line.length > 0 &&
      line.length < 50 &&
      !line.includes('@') &&
      !line.toLowerCase().includes('http') &&
      !line.toLowerCase().includes('linkedin') &&
      !line.toLowerCase().includes('github')
    ) {
      name = line
      continue
    }

    // Aggregate all contact / link lines, including generic URLs & portfolio links
    if (
      line.includes('@') ||
      line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) || 
      line.toLowerCase().includes('linkedin') ||
      line.toLowerCase().includes('github') ||
      line.toLowerCase().includes('http') ||
      line.toLowerCase().includes('portfolio') ||
      line.toLowerCase().includes('website')
    ) {
      contact += (contact ? ' • ' : '') + line
      continue
    }

    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line)
    }
  }

  // If there are no parsed sections, render the full resume as plain text
  // under the classic Harvard header, so nothing from the AI output is lost.
  const hasBodyContent = Object.values(sections).some(
    (arr: string[]) => Array.isArray(arr) && arr.length > 0
  )

  if (!hasBodyContent) {
    // Header
    doc.setFontSize(22)
    doc.setFont('times', 'bold')
    doc.setTextColor(primaryColor)
    doc.text(name || 'YOUR NAME', pageWidth / 2, y, { align: 'center' })
    y += 7

    doc.setFontSize(10)
    doc.setFont('times', 'normal')
    doc.setTextColor(60, 60, 60)
    const contactLines = doc.splitTextToSize(
      contact || 'your.email@example.com • (555) 123-4567',
      contentWidth
    )
    contactLines.forEach((line: string) => {
      doc.text(line, pageWidth / 2, y, { align: 'center' })
      y += 4.5
    })
    y += 6

    doc.setDrawColor(139, 0, 0)
    doc.setLineWidth(0.8)
    doc.line(margin, y, pageWidth - margin, y)
    y += 10

    // Body: print every non-header line verbatim
    doc.setFontSize(10.5)
    doc.setFont('times', 'normal')
    doc.setTextColor(30, 30, 30)

    for (let rawLine of lines) {
      const line = rawLine.trim()
      if (!line) {
        y += 3.5
        continue
      }

      if (line === name) continue
      if (contact && contact.includes(line)) continue

      const wrapped = doc.splitTextToSize(line, contentWidth)
      wrapped.forEach((wLine: string) => {
        checkPageBreak(5)
        doc.text(wLine, margin, y)
        y += 5
      })
      y += 2
    }

    return doc
  }

  // HEADER - Classic Harvard Style
  doc.setFontSize(22)
  doc.setFont('times', 'bold')
  doc.setTextColor(primaryColor)
  doc.text(name || 'YOUR NAME', pageWidth / 2, y, { align: 'center' })
  y += 7

  // Contact info in classic serif style
  doc.setFontSize(10)
  doc.setFont('times', 'normal')
  doc.setTextColor(60, 60, 60)
  const contactLines = doc.splitTextToSize(contact || 'your.email@example.com • (555) 123-4567', contentWidth)
  contactLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 4.5
  })
  y += 6

  // Elegant line separator
  doc.setDrawColor(139, 0, 0) // Harvard crimson
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // SUMMARY
  if (sections.summary.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(accentColor)
    doc.text('SUMMARY', margin, y)
    y += 7

    doc.setFontSize(10.5)
    doc.setFont('times', 'normal')
    doc.setTextColor(30, 30, 30)
    const summaryText = sections.summary.join(' ')
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth)
    summaryLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 5
    })
    y += 6
  }

  // EDUCATION (Harvard style puts education first)
  if (sections.education.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(accentColor)
    doc.text('EDUCATION', margin, y)
    y += 7

    doc.setFontSize(10.5)
    sections.education.forEach((line: string) => {
      checkPageBreak(6)
      if (line.includes('Bachelor') || line.includes('Master') || line.includes('PhD') || 
          line.includes('B.S') || line.includes('M.S') || line.includes('B.A') || line.includes('M.A')) {
        doc.setFont('times', 'bold')
        doc.setTextColor(primaryColor)
        doc.text(line, margin, y)
        y += 5.5
      } else {
        doc.setFont('times', 'italic')
        doc.setTextColor(60, 60, 60)
        doc.text(line, margin, y)
        y += 5
      }
    })
    y += 6
  }

  // EXPERIENCE
  if (sections.experience.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(accentColor)
    doc.text('EXPERIENCE', margin, y)
    y += 7

    doc.setFontSize(10.5)
    let isJobTitle = true
    sections.experience.forEach((line: string) => {
      checkPageBreak(8)
      
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        doc.setFont('times', 'normal')
        doc.setTextColor(30, 30, 30)
        const bulletText = line.replace(/^[•\-*]\s*/, '')
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5)
        bulletLines.forEach((bLine: string, idx: number) => {
          checkPageBreak(5)
          if (idx === 0) {
            doc.text('•', margin + 2, y)
            doc.text(bLine, margin + 8, y)
          } else {
            doc.text(bLine, margin + 8, y)
          }
          y += 5
        })
      } else if (line.length > 0) {
        if (isJobTitle) {
          doc.setFont('times', 'bold')
          doc.setTextColor(primaryColor)
          doc.text(line, margin, y)
          y += 5.5
          isJobTitle = false
        } else {
          doc.setFont('times', 'italic')
          doc.setTextColor(60, 60, 60)
          doc.text(line, margin, y)
          y += 5.5
          isJobTitle = true
        }
      }
    })
    y += 6
  }

  // SKILLS
  if (sections.skills.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(accentColor)
    doc.text('SKILLS', margin, y)
    y += 7

    doc.setFontSize(10.5)
    doc.setFont('times', 'normal')
    doc.setTextColor(30, 30, 30)
    const skillsText = sections.skills.join(' • ')
    const skillsLines = doc.splitTextToSize(skillsText, contentWidth)
    skillsLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 5
    })
    y += 6
  }

  // PROJECTS
  if (sections.projects.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(accentColor)
    doc.text('PROJECTS', margin, y)
    y += 7

    doc.setFontSize(10.5)
    sections.projects.forEach((line: string) => {
      checkPageBreak(6)
      if (line.startsWith('•') || line.startsWith('-')) {
        doc.setFont('times', 'normal')
        doc.setTextColor(30, 30, 30)
        const bulletText = line.replace(/^[•\-]\s*/, '')
        doc.text('•', margin + 2, y)
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5)
        bulletLines.forEach((bLine: string) => {
          checkPageBreak(5)
          doc.text(bLine, margin + 8, y)
          y += 5
        })
      } else {
        doc.setFont('times', 'bold')
        doc.setTextColor(primaryColor)
        doc.text(line, margin, y)
        y += 5.5
      }
    })
  }

  return doc
}
