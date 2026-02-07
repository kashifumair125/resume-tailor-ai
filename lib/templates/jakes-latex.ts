/**
 * Generate LaTeX resume based on Jake's Resume template
 * Converts plain text resume to LaTeX format
 */

interface ParsedResume {
  name: string
  contact: string[]
  sections: {
    education: string[]
    experience: string[]
    projects: string[]
    skills: string[]
    summary?: string[]
    certifications?: string[]
  }
}

function parseResumeText(resumeText: string): ParsedResume {
  const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line)
  
  const result: ParsedResume = {
    name: '',
    contact: [],
    sections: {
      education: [],
      experience: [],
      projects: [],
      skills: [],
      summary: [],
      certifications: []
    }
  }

  let currentSection = ''
  let isHeader = true

  for (let line of lines) {
    // Detect section headers
    const sectionMatch = line.match(/^(EDUCATION|EXPERIENCE|PROJECTS|SKILLS|TECHNICAL\s+SKILLS|SUMMARY|PROFESSIONAL\s+SUMMARY|OBJECTIVE|CERTIFICATIONS)/i)
    if (sectionMatch) {
      isHeader = false
      const sectionName = sectionMatch[1].toLowerCase()
      if (sectionName.includes('education')) currentSection = 'education'
      else if (sectionName.includes('experience')) currentSection = 'experience'
      else if (sectionName.includes('project')) currentSection = 'projects'
      else if (sectionName.includes('skill')) currentSection = 'skills'
      else if (sectionName.includes('summary') || sectionName.includes('objective')) currentSection = 'summary'
      else if (sectionName.includes('certification')) currentSection = 'certifications'
      continue
    }

    // Parse header (name and contact)
    if (isHeader) {
      // Name detection: first substantial line without email/phone markers
      if (!result.name && 
          line.length > 0 && 
          line.length < 60 &&
          !line.includes('@') &&
          !line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) &&
          !line.toLowerCase().includes('http') &&
          !line.toLowerCase().includes('linkedin') &&
          !line.toLowerCase().includes('github')) {
        result.name = line
        continue
      }

      // Contact info detection
      if (line.includes('@') || 
          line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) ||
          line.toLowerCase().includes('linkedin') ||
          line.toLowerCase().includes('github') ||
          line.toLowerCase().includes('http') ||
          line.includes('|')) {
        result.contact.push(line)
        continue
      }
    }

    // Add to current section
    if (currentSection && result.sections[currentSection as keyof typeof result.sections]) {
      const section = result.sections[currentSection as keyof typeof result.sections]
      if (Array.isArray(section)) {
        section.push(line)
      }
    }
  }

  return result
}

function escapeLaTeX(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/\&/g, '\\&')
    .replace(/\#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\_/g, '\\_')
    .replace(/\~/g, '\\textasciitilde{}')
    .replace(/\%/g, '\\%')
}

function formatContactInfo(contact: string[]): string {
  if (contact.length === 0) {
    return 'your.email@example.com $|$ \\href{https://linkedin.com/in/...}{\\underline{linkedin.com/in/yourprofile}} $|$ \\href{https://github.com/...}{\\underline{github.com/yourprofile}}'
  }

  return contact
    .map(line => {
      // Extract email
      const emailMatch = line.match(/([\w.-]+@[\w.-]+\.\w+)/i)
      if (emailMatch) {
        line = line.replace(emailMatch[1], `\\href{mailto:${emailMatch[1]}}{\\underline{${emailMatch[1]}}}`)
      }

      // Extract URLs
      const urlMatch = line.match(/(https?:\/\/[^\s|]+)/gi)
      if (urlMatch) {
        urlMatch.forEach(url => {
          const displayUrl = url.replace(/^https?:\/\//, '')
          line = line.replace(url, `\\href{${url}}{\\underline{${displayUrl}}}`)
        })
      }

      // Extract phone numbers
      const phoneMatch = line.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/)
      if (phoneMatch) {
        line = line.replace(phoneMatch[1], phoneMatch[1])
      }

      return escapeLaTeX(line)
    })
    .join(' $|$ ')
}

function formatExperience(experience: string[]): string {
  if (experience.length === 0) return ''

  let latex = '  \\resumeSubHeadingListStart\n'
  let i = 0
  let currentJob: { title?: string; company?: string; location?: string; dates?: string; bullets: string[] } = { bullets: [] }

  while (i < experience.length) {
    const line = experience[i]

    // Check if it's a bullet point
    if (line.match(/^[•\-\*]\s*/)) {
      const bullet = line.replace(/^[•\-\*]\s*/, '').trim()
      if (bullet) {
        currentJob.bullets.push(bullet)
      }
      i++
      continue
    }

    // If we have a complete job entry, output it
    if (currentJob.title && currentJob.company && currentJob.dates) {
      latex += `    \\resumeSubheading\n`
      latex += `      {${escapeLaTeX(currentJob.title)}}{${escapeLaTeX(currentJob.dates)}}\n`
      latex += `      {${escapeLaTeX(currentJob.company)}}{${escapeLaTeX(currentJob.location || '')}}\n`
      
      if (currentJob.bullets.length > 0) {
        latex += `      \\resumeItemListStart\n`
        currentJob.bullets.forEach(bullet => {
          latex += `        \\resumeItem{${escapeLaTeX(bullet)}}\n`
        })
        latex += `      \\resumeItemListEnd\n`
      }
      
      currentJob = { bullets: [] }
    }

    // Try to parse job title, company, location, dates
    // Common patterns:
    // "Job Title | Dates"
    // "Company Name | Location"
    // "Job Title"
    // "Company Name"
    
    if (!currentJob.title && line.length < 80 && !line.includes('•') && !line.includes('-') && !line.includes('*')) {
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim())
        if (parts.length >= 2) {
          // Could be "Title | Dates" or "Company | Location"
          if (parts[1].match(/\d{4}/)) {
            // Likely dates
            currentJob.title = parts[0]
            currentJob.dates = parts[1]
          } else {
            // Likely location
            currentJob.company = parts[0]
            currentJob.location = parts[1]
          }
        }
      } else {
        // Single line - could be title or company
        if (!currentJob.title) {
          currentJob.title = line
        } else if (!currentJob.company) {
          currentJob.company = line
        }
      }
    } else if (line.match(/\d{4}/) && !currentJob.dates) {
      // Likely dates
      currentJob.dates = line
    }

    i++
  }

  // Output last job if exists
  if (currentJob.title && currentJob.company) {
    latex += `    \\resumeSubheading\n`
    latex += `      {${escapeLaTeX(currentJob.title)}}{${escapeLaTeX(currentJob.dates || '')}}\n`
    latex += `      {${escapeLaTeX(currentJob.company)}}{${escapeLaTeX(currentJob.location || '')}}\n`
    
    if (currentJob.bullets.length > 0) {
      latex += `      \\resumeItemListStart\n`
      currentJob.bullets.forEach(bullet => {
        latex += `        \\resumeItem{${escapeLaTeX(bullet)}}\n`
      })
      latex += `      \\resumeItemListEnd\n`
    }
  }

  latex += '  \\resumeSubHeadingListEnd\n'
  return latex
}

function formatEducation(education: string[]): string {
  if (education.length === 0) return ''

  let latex = '  \\resumeSubHeadingListStart\n'
  let i = 0
  let currentEdu: { school?: string; location?: string; degree?: string; dates?: string } = {}

  while (i < education.length) {
    const line = education[i]

    // If we have a complete education entry, output it
    if (currentEdu.school && currentEdu.degree && currentEdu.dates) {
      latex += `    \\resumeSubheading\n`
      latex += `      {${escapeLaTeX(currentEdu.school)}}{${escapeLaTeX(currentEdu.location || '')}}\n`
      latex += `      {${escapeLaTeX(currentEdu.degree)}}{${escapeLaTeX(currentEdu.dates)}}\n`
      currentEdu = {}
    }

    // Try to parse education entry
    if (line.match(/(Bachelor|Master|PhD|B\.S|M\.S|B\.A|M\.A|Associate|Doctor)/i)) {
      // Likely degree
      currentEdu.degree = line
    } else if (line.match(/\d{4}/) && !currentEdu.dates) {
      // Likely dates
      currentEdu.dates = line
    } else if (!currentEdu.school && line.length < 60) {
      // Likely school name
      if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim())
        currentEdu.school = parts[0]
        currentEdu.location = parts.slice(1).join(', ')
      } else {
        currentEdu.school = line
      }
    }

    i++
  }

  // Output last education if exists
  if (currentEdu.school && currentEdu.degree) {
    latex += `    \\resumeSubheading\n`
    latex += `      {${escapeLaTeX(currentEdu.school)}}{${escapeLaTeX(currentEdu.location || '')}}\n`
    latex += `      {${escapeLaTeX(currentEdu.degree)}}{${escapeLaTeX(currentEdu.dates || '')}}\n`
  }

  latex += '  \\resumeSubHeadingListEnd\n'
  return latex
}

function formatProjects(projects: string[]): string {
  if (projects.length === 0) return ''

  let latex = '    \\resumeSubHeadingListStart\n'
  let i = 0
  let currentProject: { title?: string; tech?: string; bullets: string[] } = { bullets: [] }

  while (i < projects.length) {
    const line = projects[i]

    // Check if it's a bullet point
    if (line.match(/^[•\-\*]\s*/)) {
      const bullet = line.replace(/^[•\-\*]\s*/, '').trim()
      if (bullet) {
        currentProject.bullets.push(bullet)
      }
      i++
      continue
    }

    // If we have a complete project entry, output it
    if (currentProject.title) {
      latex += `      \\resumeProjectHeading\n`
      latex += `          {\\textbf{${escapeLaTeX(currentProject.title)}} $|$ \\emph{${escapeLaTeX(currentProject.tech || '')}}}{${escapeLaTeX('')}}\n`
      
      if (currentProject.bullets.length > 0) {
        latex += `          \\resumeItemListStart\n`
        currentProject.bullets.forEach(bullet => {
          latex += `            \\resumeItem{${escapeLaTeX(bullet)}}\n`
        })
        latex += `          \\resumeItemListEnd\n`
      }
      
      currentProject = { bullets: [] }
    }

    // Parse project title and tech stack
    if (line.includes('|')) {
      const parts = line.split('|').map(p => p.trim())
      currentProject.title = parts[0]
      currentProject.tech = parts.slice(1).join(', ')
    } else if (!currentProject.title && line.length < 80) {
      currentProject.title = line
    }

    i++
  }

  // Output last project if exists
  if (currentProject.title) {
    latex += `      \\resumeProjectHeading\n`
    latex += `          {\\textbf{${escapeLaTeX(currentProject.title)}} $|$ \\emph{${escapeLaTeX(currentProject.tech || '')}}}{${escapeLaTeX('')}}\n`
    
    if (currentProject.bullets.length > 0) {
      latex += `          \\resumeItemListStart\n`
      currentProject.bullets.forEach(bullet => {
        latex += `            \\resumeItem{${escapeLaTeX(bullet)}}\n`
      })
      latex += `          \\resumeItemListEnd\n`
    }
  }

  latex += '    \\resumeSubHeadingListEnd\n'
  return latex
}

function formatSkills(skills: string[]): string {
  if (skills.length === 0) return ''

  const skillsText = skills.join(' ')
  // Try to parse categories like "Languages: Java, Python..."
  const categories: { [key: string]: string[] } = {}
  let currentCategory = 'General'
  
  skills.forEach(line => {
    if (line.includes(':')) {
      const [cat, items] = line.split(':').map(s => s.trim())
      currentCategory = cat.replace(/\{|\}/g, '')
      categories[currentCategory] = items.split(',').map(s => s.trim()).filter(s => s)
    } else {
      if (!categories[currentCategory]) {
        categories[currentCategory] = []
      }
      const items = line.split(',').map(s => s.trim()).filter(s => s)
      categories[currentCategory].push(...items)
    }
  })

  let latex = ' \\begin{itemize}[leftmargin=0.15in, label={}]\n'
  latex += '    \\small{\\item{\n'
  
  const categoryEntries = Object.entries(categories)
  categoryEntries.forEach(([category, items], idx) => {
    if (items.length > 0) {
      latex += `     \\textbf{${escapeLaTeX(category)}}{: ${items.map(item => escapeLaTeX(item)).join(', ')}}`
      if (idx < categoryEntries.length - 1) {
        latex += ' \\\\\n'
      } else {
        latex += '\n'
      }
    }
  })

  if (categoryEntries.length === 0) {
    // Fallback: just output all skills
    const allSkills = skillsText.split(',').map(s => s.trim()).filter(s => s)
    latex += `     ${allSkills.map(s => escapeLaTeX(s)).join(', ')}\n`
  }

  latex += '    }}\n'
  latex += ' \\end{itemize}\n'
  return latex
}

export function generateJakesLaTeX(resumeText: string): string {
  const parsed = parseResumeText(resumeText)
  
  const name = parsed.name || 'Your Name'
  const contact = formatContactInfo(parsed.contact)

  const latex = `%-------------------------
% Resume in LaTeX
% Generated by ResumeTailor AI
% Based on: Jake's Resume Template
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLaTeX(name)}} \\\\ \\vspace{1pt}
    \\small ${contact}
\\end{center}

${parsed.sections.education.length > 0 ? `%-----------EDUCATION-----------
\\section{Education}
${formatEducation(parsed.sections.education)}` : ''}

${parsed.sections.experience.length > 0 ? `%-----------EXPERIENCE-----------
\\section{Experience}
${formatExperience(parsed.sections.experience)}` : ''}

${parsed.sections.projects.length > 0 ? `%-----------PROJECTS-----------
\\section{Projects}
${formatProjects(parsed.sections.projects)}` : ''}

${parsed.sections.skills.length > 0 ? `%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
${formatSkills(parsed.sections.skills)}` : ''}

%-------------------------------------------
\\end{document}
`

  return latex
}
