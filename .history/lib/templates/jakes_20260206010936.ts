import { jsPDF } from 'jspdf'

export function generateJakesTemplate(resumeData: any, doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - (margin * 2)
  let y = 20
  let currentPage = 1

  const primaryColor = [0, 0, 0]
  const accentColor = [0, 102, 204]
  const grayColor = [60, 60, 60]
  const lightGrayColor = [40, 40, 40]
  
  const checkPageBreak = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - 15) {
      doc.addPage()
      currentPage++
      y = 20
      return true
    }
    return false
  }

  const splitText = (text: string, maxWidth: number): string[] => {
    try {
      const result = (doc as any).splitTextToSize(text, maxWidth)
      return Array.isArray(result) ? result : [result]
    } catch (e) {
      const words = text.split(' ')
      const lines: string[] = []
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const testWidth = (doc as any).getTextWidth(testLine)
        
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      
      if (currentLine) {
        lines.push(currentLine)
      }
      
      return lines.length > 0 ? lines : [text]
    }
  }

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

    if (line.match(/^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|PROFESSIONAL\s+SUMMARY|OBJECTIVE)/i)) {
      currentSection = line.toLowerCase().replace(/[:\s]/g, '')
      if (currentSection.includes('professional') || currentSection.includes('objective')) currentSection = 'summary'
      continue
    }

    // Treat the first reasonable line as the name (no obvious contact / URL markers)
    if (
      !name &&
      line.length > 0 &&
      line.length < 60 &&
      !line.includes('@') &&
      !line.toLowerCase().includes('http') &&
      !line.toLowerCase().includes('linkedin') &&
      !line.toLowerCase().includes('github')
    ) {
      name = line
      continue
    }

    // Treat common contact / link patterns as header contact info
    if (
      line.includes('@') ||
      line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) || 
      line.toLowerCase().includes('linkedin') ||
      line.toLowerCase().includes('github') ||
      line.toLowerCase().includes('http') ||
      line.toLowerCase().includes('portfolio') ||
      line.toLowerCase().includes('website') ||
      line.includes('|')
    ) {
      if (!contact && line.includes('|')) {
        contact = line
      } else if (!line.includes('|')) {
        contact += (contact ? ' | ' : '') + line
      }
      continue
    }

    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line)
    }
  }

  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(name || 'Your Name', pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
  
  const contactText = contact || 'your.email@example.com | (555) 123-4567 | Your City, State | linkedin.com/in/yourprofile'
  const contactLines = splitText(contactText, contentWidth)
  contactLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 4
  })
  y += 6

  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  if (sections.summary.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('PROFESSIONAL SUMMARY', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
    
    const summaryText = sections.summary.join(' ')
    const summaryLines = splitText(summaryText, contentWidth)
    summaryLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 8
  }

  if (sections.experience.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('EXPERIENCE', margin, y)
    y += 6

    doc.setFontSize(9.5)
    let isJobTitle = true
    let isFirstBullet = true
    
    sections.experience.forEach((line: string) => {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
        const bulletText = line.replace(/^[•\-*]\s*/, '').trim()
        if (!bulletText) return
        
        checkPageBreak(10)
        
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
        
        const bulletLines = splitText(bulletText, contentWidth - 8)
        bulletLines.forEach((bLine: string, idx: number) => {
          if (idx > 0) {
            checkPageBreak(5)
          }
          
          if (idx === 0) {
            doc.text('•', margin + 2, y)
            doc.text(bLine, margin + 8, y)
          } else {
            doc.text(bLine, margin + 8, y)
          }
          y += 4.5
        })
        isFirstBullet = false
      } else if (line.length > 0) {
        checkPageBreak(10)
        
        if (isJobTitle) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text(line, margin, y)
          y += 6
          isJobTitle = false
        } else {
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
          doc.text(line, margin, y)
          y += 5
          isJobTitle = true
        }
      }
    })
    y += 6
  }

  if (sections.education.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('EDUCATION', margin, y)
    y += 6

    doc.setFontSize(9.5)
    sections.education.forEach((line: string) => {
      checkPageBreak(6)
      
      const isDegree = line.includes('Bachelor') || line.includes('Master') || line.includes('PhD') || 
                     line.includes('B.S') || line.includes('M.S') || line.includes('B.A') || 
                     line.includes('M.A') || line.includes('Doctor')
      
      if (isDegree) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
      }
      
      const eduLines = splitText(line, contentWidth)
      eduLines.forEach((eduLine: string) => {
        doc.text(eduLine, margin, y)
        y += 4.5
      })
    })
    y += 6
  }

  if (sections.skills.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('SKILLS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
    
    const skillsText = sections.skills.join(', ')
    const skillsLines = splitText(skillsText, contentWidth)
    skillsLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 6
  }

  if (sections.projects.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('PROJECTS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    sections.projects.forEach((line: string) => {
      checkPageBreak(6)
      
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const bulletText = line.replace(/^[•\-*]\s*/, '').trim()
        if (!bulletText) return
        
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
        
        const bulletLines = splitText(bulletText, contentWidth - 8)
        bulletLines.forEach((bLine: string, idx: number) => {
          if (idx > 0) {
            checkPageBreak(5)
          }
          
          if (idx === 0) {
            doc.text('•', margin + 2, y)
            doc.text(bLine, margin + 8, y)
          } else {
            doc.text(bLine, margin + 8, y)
          }
          y += 4.5
        })
      } else if (line.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        
        const projectLines = splitText(line, contentWidth)
        projectLines.forEach((pLine: string) => {
          doc.text(pLine, margin, y)
          y += 4.5
        })
      }
    })
    y += 6
  }

  if (sections.certifications.length > 0) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('CERTIFICATIONS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
    
    sections.certifications.forEach((line: string) => {
      checkPageBreak(6)
      
      const certLines = splitText(line, contentWidth)
      certLines.forEach((cLine: string) => {
        doc.text(cLine, margin, y)
        y += 4.5
      })
    })
    y += 6
  }

  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
  }

  return doc
}
