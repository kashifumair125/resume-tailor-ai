import { jsPDF } from 'jspdf'

export function generateModernCVTemplate(resumeData: any, doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.width
  const sidebarWidth = 60
  const margin = 15
  const contentMargin = sidebarWidth + 10
  const contentWidth = pageWidth - contentMargin - margin
  let y = 25
  let sidebarY = 25

  const primaryColor = '#0066cc'
  const darkGray = '#2b2b2b'
  const sidebarColor = '#f5f5f5'
  
  const checkPageBreak = (height: number) => {
    if (y + height > doc.internal.pageSize.height - 20) {
      doc.addPage()
      drawSidebar() // Redraw sidebar on new page
      y = 25
    }
  }

  // Draw sidebar background
  const drawSidebar = () => {
    doc.setFillColor(245, 245, 245)
    doc.rect(0, 0, sidebarWidth, doc.internal.pageSize.height, 'F')
  }

  drawSidebar()

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

    // Main name line (avoid treating contact/link lines as name)
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

    // Sidebar contact block: include emails, phones, LinkedIn, GitHub, and generic URLs
    if (
      line.includes('@') ||
      line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) || 
      line.toLowerCase().includes('linkedin') ||
      line.toLowerCase().includes('github') ||
      line.toLowerCase().includes('http') ||
      line.toLowerCase().includes('portfolio') ||
      line.toLowerCase().includes('website')
    ) {
      contact += (contact ? '\n' : '') + line
      continue
    }

    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line)
    }
  }

  // HEADER in main area
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor)
  doc.text(name || 'YOUR NAME', contentMargin, y)
  y += 10

  // Decorative line
  doc.setDrawColor(0, 102, 204)
  doc.setLineWidth(1)
  doc.line(contentMargin, y, pageWidth - margin, y)
  y += 10

  // CONTACT INFO in sidebar
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGray)
  doc.text('CONTACT', 8, sidebarY)
  sidebarY += 6

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  const contactInfo = contact.split('\n')
  contactInfo.forEach((info) => {
    const wrappedInfo = doc.splitTextToSize(info, sidebarWidth - 16)
    wrappedInfo.forEach((line: string) => {
      doc.text(line, 8, sidebarY)
      sidebarY += 4
    })
  })
  sidebarY += 8

  // SKILLS in sidebar
  if (sections.skills.length > 0) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkGray)
    doc.text('SKILLS', 8, sidebarY)
    sidebarY += 6

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    sections.skills.forEach((skill: string) => {
      const skillItems = skill.split(',')
      skillItems.forEach((item: string) => {
        const trimmed = item.trim()
        if (trimmed) {
          // Add skill bars
          doc.setFillColor(0, 102, 204)
          doc.rect(8, sidebarY - 2, 2, 2, 'F')
          const wrappedSkill = doc.splitTextToSize(trimmed, sidebarWidth - 18)
          wrappedSkill.forEach((line: string) => {
            doc.text(line, 12, sidebarY)
            sidebarY += 4
          })
        }
      })
    })
    sidebarY += 8
  }

  // EDUCATION in sidebar (brief version)
  if (sections.education.length > 0) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkGray)
    doc.text('EDUCATION', 8, sidebarY)
    sidebarY += 6

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    sections.education.slice(0, 3).forEach((line: string) => {
      const wrappedEdu = doc.splitTextToSize(line, sidebarWidth - 16)
      wrappedEdu.forEach((l: string) => {
        if (sidebarY < doc.internal.pageSize.height - 20) {
          doc.text(l, 8, sidebarY)
          sidebarY += 3.5
        }
      })
    })
  }

  // PROFESSIONAL SUMMARY in main area
  if (sections.summary.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('Professional Summary', contentMargin, y)
    y += 7

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const summaryText = sections.summary.join(' ')
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth)
    summaryLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, contentMargin, y)
      y += 4.5
    })
    y += 8
  }

  // EXPERIENCE in main area
  if (sections.experience.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('Experience', contentMargin, y)
    y += 7

    doc.setFontSize(9.5)
    let isJobTitle = true
    sections.experience.forEach((line: string) => {
      checkPageBreak(8)
      
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(50, 50, 50)
        const bulletText = line.replace(/^[•\-*]\s*/, '')
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5)
        bulletLines.forEach((bLine: string, idx: number) => {
          checkPageBreak(5)
          if (idx === 0) {
            // Blue bullet point
            doc.setFillColor(0, 102, 204)
            doc.rect(contentMargin, y - 2, 2, 2, 'F')
            doc.text(bLine, contentMargin + 5, y)
          } else {
            doc.text(bLine, contentMargin + 5, y)
          }
          y += 4.5
        })
      } else if (line.length > 0) {
        if (isJobTitle) {
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(darkGray)
          doc.text(line, contentMargin, y)
          y += 5.5
          isJobTitle = false
        } else {
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(100, 100, 100)
          doc.text(line, contentMargin, y)
          y += 5.5
          isJobTitle = true
        }
      }
    })
    y += 8
  }

  // PROJECTS in main area
  if (sections.projects.length > 0) {
    checkPageBreak(20)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('Projects', contentMargin, y)
    y += 7

    doc.setFontSize(9.5)
    sections.projects.forEach((line: string) => {
      checkPageBreak(6)
      if (line.startsWith('•') || line.startsWith('-')) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(50, 50, 50)
        const bulletText = line.replace(/^[•\-]\s*/, '')
        doc.setFillColor(0, 102, 204)
        doc.rect(contentMargin, y - 2, 2, 2, 'F')
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5)
        bulletLines.forEach((bLine: string) => {
          checkPageBreak(5)
          doc.text(bLine, contentMargin + 5, y)
          y += 4.5
        })
      } else {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(darkGray)
        doc.text(line, contentMargin, y)
        y += 5.5
      }
    })
  }

  // Footer line on all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(sidebarWidth, doc.internal.pageSize.height - 15, pageWidth - margin, doc.internal.pageSize.height - 15)
  }

  return doc
}
