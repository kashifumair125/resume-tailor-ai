import { jsPDF } from 'jspdf'

export function generateVenablesTemplate(resumeData: any, doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.width
  const margin = 18
  const contentWidth = pageWidth - (margin * 2)
  let y = 22

  const primaryColor = '#2c3e50'
  const accentColor = '#34495e'
  const lightGray = '#ecf0f1'
  
  const checkPageBreak = (height: number) => {
    if (y + height > doc.internal.pageSize.height - 20) {
      doc.addPage()
      y = 22
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

    if (line.match(/^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY)/i)) {
      currentSection = line.toLowerCase().replace(/[:\s]/g, '')
      if (currentSection.includes('professional') || currentSection.includes('executive')) currentSection = 'summary'
      continue
    }

    // Executive header name line (no contact/link markers)
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

    // Capture email/phone/LinkedIn/GitHub/URLs/portfolio as contact header
    if (
      line.includes('@') ||
      line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) || 
      line.toLowerCase().includes('linkedin') ||
      line.toLowerCase().includes('github') ||
      line.toLowerCase().includes('http') ||
      line.toLowerCase().includes('portfolio') ||
      line.toLowerCase().includes('website')
    ) {
      contact += (contact ? ' | ' : '') + line
      continue
    }

    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line)
    }
  }

  // HEADER - Executive Style with Background
  doc.setFillColor(44, 62, 80)
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(name || 'YOUR NAME', pageWidth / 2, 20, { align: 'center' })

  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(236, 240, 241)
  const contactLines = doc.splitTextToSize(contact || 'your.email@example.com | (555) 123-4567', contentWidth)
  let contactY = 30
  contactLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, contactY, { align: 'center' })
    contactY += 4.5
  })

  y = 55

  // EXECUTIVE SUMMARY
  if (sections.summary.length > 0) {
    checkPageBreak(25)
    
    // Section with background
    doc.setFillColor(236, 240, 241)
    doc.rect(margin - 3, y - 7, contentWidth + 6, 10, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('EXECUTIVE SUMMARY', margin, y)
    y += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const summaryText = sections.summary.join(' ')
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth)
    summaryLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 5
    })
    y += 8
  }

  // PROFESSIONAL EXPERIENCE
  if (sections.experience.length > 0) {
    checkPageBreak(25)
    
    doc.setFillColor(236, 240, 241)
    doc.rect(margin - 3, y - 7, contentWidth + 6, 10, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('PROFESSIONAL EXPERIENCE', margin, y)
    y += 10

    doc.setFontSize(10)
    let isJobTitle = true
    sections.experience.forEach((line: string) => {
      checkPageBreak(8)
      
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(50, 50, 50)
        const bulletText = line.replace(/^[•\-*]\s*/, '')
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 6)
        bulletLines.forEach((bLine: string, idx: number) => {
          checkPageBreak(5)
          if (idx === 0) {
            doc.setFillColor(52, 73, 94)
            doc.circle(margin + 2, y - 1.5, 1, 'F')
            doc.text(bLine, margin + 7, y)
          } else {
            doc.text(bLine, margin + 7, y)
          }
          y += 4.8
        })
      } else if (line.length > 0) {
        if (isJobTitle) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(44, 62, 80)
          doc.text(line, margin, y)
          y += 5.5
          isJobTitle = false
        } else {
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(80, 80, 80)
          doc.text(line, margin, y)
          y += 5.5
          isJobTitle = true
        }
      }
    })
    y += 8
  }

  // EDUCATION
  if (sections.education.length > 0) {
    checkPageBreak(25)
    
    doc.setFillColor(236, 240, 241)
    doc.rect(margin - 3, y - 7, contentWidth + 6, 10, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('EDUCATION', margin, y)
    y += 10

    doc.setFontSize(10)
    sections.education.forEach((line: string) => {
      checkPageBreak(6)
      if (line.includes('Bachelor') || line.includes('Master') || line.includes('PhD') || 
          line.includes('B.S') || line.includes('M.S')) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(44, 62, 80)
        doc.text(line, margin, y)
        y += 5.5
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.text(line, margin, y)
        y += 5
      }
    })
    y += 8
  }

  // CORE COMPETENCIES (Skills)
  if (sections.skills.length > 0) {
    checkPageBreak(25)
    
    doc.setFillColor(236, 240, 241)
    doc.rect(margin - 3, y - 7, contentWidth + 6, 10, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('CORE COMPETENCIES', margin, y)
    y += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    
    // Display skills in a professional grid
    const skillsText = sections.skills.join(' • ')
    const skillsLines = doc.splitTextToSize(skillsText, contentWidth)
    skillsLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 5
    })
    y += 8
  }

  // PROJECTS & ACHIEVEMENTS
  if (sections.projects.length > 0) {
    checkPageBreak(25)
    
    doc.setFillColor(236, 240, 241)
    doc.rect(margin - 3, y - 7, contentWidth + 6, 10, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(44, 62, 80)
    doc.text('PROJECTS & ACHIEVEMENTS', margin, y)
    y += 10

    doc.setFontSize(10)
    sections.projects.forEach((line: string) => {
      checkPageBreak(6)
      if (line.startsWith('•') || line.startsWith('-')) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(50, 50, 50)
        const bulletText = line.replace(/^[•\-]\s*/, '')
        doc.setFillColor(52, 73, 94)
        doc.circle(margin + 2, y - 1.5, 1, 'F')
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 6)
        bulletLines.forEach((bLine: string) => {
          checkPageBreak(5)
          doc.text(bLine, margin + 7, y)
          y += 4.8
        })
      } else {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(44, 62, 80)
        doc.text(line, margin, y)
        y += 5.5
      }
    })
  }

  return doc
}
