export { generateJakesTemplate } from './jakes'
export { generateHarvardTemplate } from './harvard'
export { generateVenablesTemplate } from './venables'
export { generateModernCVTemplate } from './moderncv'

export const TEMPLATES = {
  jakes: {
    name: "Jake's Resume",
    description: 'Extremely popular, one-column format. Clean and ATS-friendly.',
    generator: 'generateJakesTemplate'
  },
  harvard: {
    name: 'Harvard',
    description: 'Classic, single-column with elegant serif fonts. Traditional and professional.',
    generator: 'generateHarvardTemplate'
  },
  venables: {
    name: 'Venables',
    description: 'Professional executive-style with modern design elements.',
    generator: 'generateVenablesTemplate'
  },
  moderncv: {
    name: 'ModernCV',
    description: 'Classic LaTeX-inspired with sidebar. Perfect for technical roles.',
    generator: 'generateModernCVTemplate'
  }
}
