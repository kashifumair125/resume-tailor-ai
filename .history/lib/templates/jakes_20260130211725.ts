import { jsPDF } from 'jspdf'

export function generateJakesTemplate(resumeData: any, doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.width
  const margin = 15
  const contentWidth = pageWidth - (margin * 2)
  let y = 20

  // Colors
  const primaryColor = '#000000'
  const accentColor = '#0066cc'
  
  // Helper function to check page break
  const checkPageBreak = (height: number) => {
    if (y + height > doc.internal.pageSize.height - 20) {
      doc.addPage()
      y = 20
    }
  }

  // Parse resume data
  const lines = resumeData.split('\n')
  let section = 'header'
  let name = ''
  let contact = ''
  let currentSection = ''

  // Extract sections
  const sections: any = {
    header: [],
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

    // Detect section headers
    if (line.match(/^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|PROFESSIONAL SUMMARY)/i)) {
      currentSection = line.toLowerCase().replace(/[:\s]/g, '')
      if (currentSection.includes('professional')) currentSection = 'summary'
      continue
    }

    // First non-empty line is usually the name
    if (!name && line.length > 0 && line.length < 50 && !line.includes('@')) {
      name = line
      continue
    }

    // Contact info (email, phone, location, linkedin)
    if (line.includes('@') || line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) || 
        line.toLowerCase().includes('linkedin') || line.toLowerCase().includes('github')) {
      contact += (contact ? ' | ' : '') + line
      continue
    }

    // Add to current section
    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line)
    } else if (!currentSection) {
      sections.header.push(line)
    }
  }

  // HEADER - Name and Contact
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor)
  doc.text(name || 'Your Name', pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  const contactLines = doc.splitTextToSize(contact || 'your.email@example.com | (555) 123-4567', contentWidth)
  contactLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 4
  })
  y += 5

  // Horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // SUMMARY
  if (sections.summary.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('PROFESSIONAL SUMMARY', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const summaryText = sections.summary.join(' ')
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth)
    summaryLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 5
  }

  // EXPERIENCE
  if (sections.experience.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('EXPERIENCE', margin, y)
    y += 6

    doc.setFontSize(9.5)
    let isJobTitle = true
    sections.experience.forEach((line: string) => {
      checkPageBreak(8)
      
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        // Bullet point
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(40, 40, 40)
        const bulletText = line.replace(/^[•\-*]\s*/, '')
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5)
        bulletLines.forEach((bLine: string, idx: number) => {
          checkPageBreak(5)
          if (idx === 0) {
            doc.text('•', margin + 2, y)
            doc.text(bLine, margin + 7, y)
          } else {
            doc.text(bLine, margin + 7, y)
          }
          y += 4.5
        })
      } else if (line.length > 0) {
        // Job title or company
        if (isJobTitle) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(primaryColor)
          doc.text(line, margin, y)
          y += 5
          isJobTitle = false
        } else {
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(60, 60, 60)
          doc.text(line, margin, y)
          y += 5
          isJobTitle = true
        }
      }
    })
    y += 3
  }

  // EDUCATION
  if (sections.education.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('EDUCATION', margin, y)
    y += 6

    doc.setFontSize(9.5)
    sections.education.forEach((line: string) => {
      checkPageBreak(5)
      if (line.includes('Bachelor') || line.includes('Master') || line.includes('PhD') || line.includes('B.S') || line.includes('M.S')) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor)
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
      }
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 5
  }

  // SKILLS
  if (sections.skills.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('SKILLS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const skillsText = sections.skills.join(', ')
    const skillsLines = doc.splitTextToSize(skillsText, contentWidth)
    skillsLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 5
  }

  // PROJECTS
  if (sections.projects.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('PROJECTS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    sections.projects.forEach((line: string) => {
      checkPageBreak(6)
      if (line.startsWith('•') || line.startsWith('-')) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(40, 40, 40)
        const bulletText = line.replace(/^[•\-]\s*/, '')
        doc.text('•', margin + 2, y)
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5)
        bulletLines.forEach((bLine: string, idx: number) => {
          checkPageBreak(5)
          doc.text(bLine, margin + 7, y)
          if (idx < bulletLines.length - 1) y += 4.5
        })
        y += 4.5
      } else {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor)
        doc.text(line, margin, y)
        y += 5
      }
    })
  }

  return doc
}
