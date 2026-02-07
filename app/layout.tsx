import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ResumeTailor AI - Optimize Your Resume for Any Job',
  description: 'AI-powered resume optimizer that tailors your resume to match job descriptions and pass ATS systems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display`}>
        {children}
      </body>
    </html>
  )
}
