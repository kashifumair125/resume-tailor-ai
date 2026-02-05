import { jsPDF } from 'jspdf'

export function generateJakesTemplate(resumeData: any, doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.width
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let y = 20

  // Colors
  const primaryColor = '#000000'
  const secondaryColor = '#606060'

  // Helper to handle page breaks
  const checkPageBreak = (height: number) => {
    if (y + height > doc.internal.pageSize.height - 20) {
      doc.addPage()
      y = 20
    }
  }

  /* ---------------- HEADER ---------------- */
  const header = resumeData.header || {}
  const name = header.name || 'Your Name'
  const contact = [
    header.email,
    header.phone,
    header.linkedin
  ].filter(Boolean).join(' | ')

  // Name
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor)
  doc.text(name, pageWidth / 2, y, { align: 'center' })
  y += 10

  // Contact
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(secondaryColor)
  const contactLines = doc.splitTextToSize(contact || 'your.email@example.com', contentWidth)
  contactLines.forEach(line => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 4.5
  })
  y += 5

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  /* ---------------- SUMMARY ---------------- */
  if (resumeData.summary) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('PROFESSIONAL SUMMARY', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const summaryLines = doc.splitTextToSize(resumeData.summary, contentWidth)
    summaryLines.forEach(line => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 5
  }

  /* ---------------- EXPERIENCE ---------------- */
  if (resumeData.experience?.length) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('EXPERIENCE', margin, y)
    y += 6

    doc.setFontSize(9.5)
    resumeData.experience.forEach((exp: any) => {
      checkPageBreak(10)
      // Role + Company + Dates
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryColor)
      doc.text(`${exp.role || ''}, ${exp.company || ''} | ${exp.dates || ''}`, margin, y)
      y += 5

      // Bullets
      if (exp.bullets?.length) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(40, 40, 40)
        exp.bullets.forEach((b: string) => {
          checkPageBreak(5)
          const bulletLines = doc.splitTextToSize(b, contentWidth - 5)
          bulletLines.forEach((line, idx) => {
            if (idx === 0) doc.text('•', margin + 2, y)
            doc.text(line, margin + 7, y)
            y += 4.5
          })
          y += 1
        })
      }
      y += 3
    })
    y += 5
  }

  /* ---------------- EDUCATION ---------------- */
  if (resumeData.education?.length) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('EDUCATION', margin, y)
    y += 6

    doc.setFontSize(9.5)
    resumeData.education.forEach((edu: any) => {
      checkPageBreak(5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryColor)
      doc.text(`${edu.degree || ''}, ${edu.school || ''} | ${edu.dates || ''}`, margin, y)
      y += 5
    })
    y += 5
  }

  /* ---------------- SKILLS ---------------- */
  if (resumeData.skills?.length) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('SKILLS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const skillsText = resumeData.skills.join(', ')
    const skillsLines = doc.splitTextToSize(skillsText, contentWidth)
    skillsLines.forEach(line => {
      checkPageBreak(5)
      doc.text(line, margin, y)
      y += 4.5
    })
    y += 5
  }

  /* ---------------- PROJECTS ---------------- */
  if (resumeData.projects?.length) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('PROJECTS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    resumeData.projects.forEach((proj: any) => {
      checkPageBreak(6)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryColor)
      doc.text(proj.name || '', margin, y)
      y += 4.5
      if (proj.description) {
        const descLines = doc.splitTextToSize(proj.description, contentWidth)
        descLines.forEach(line => {
          checkPageBreak(5)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(40, 40, 40)
          doc.text(line, margin + 5, y)
          y += 4.5
        })
        y += 2
      }
    })
    y += 5
  }

  /* ---------------- CERTIFICATIONS ---------------- */
  if (resumeData.certifications?.length) {
    checkPageBreak(15)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('CERTIFICATIONS', margin, y)
    y += 6

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    resumeData.certifications.forEach((cert: any) => {
      checkPageBreak(5)
      doc.text(`${cert.name || ''} | ${cert.date || ''}`, margin, y)
      y += 4.5
    })
  }

  return doc
}
