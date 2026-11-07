export type WorkCategory = 'AI agent' | 'AI assistant' | 'AI integration' | 'Web' | 'Security'

export interface Service {
  id: string
  title: string
  description: string
  bullets: string[]
  workSlug?: string
}

export interface WorkMetric {
  value: string
  label: string
  estimate?: boolean
}

export interface ConsoleLine {
  time: string
  message: string
  tone: 'info' | 'success' | 'warn'
}

export interface WorkStudy {
  slug: string
  category: WorkCategory
  clientType: string
  title: string
  summary: string
  problem: string
  build: string[]
  outcome: string[]
  stack: string[]
  metrics: WorkMetric[]
  consoleLines: ConsoleLine[]
  confidential: boolean
}

export interface SiteConfig {
  name: string
  fullName: string
  title: string
  email: string
  location: string
  linkedin: string
  github: string
  url: string
  nav: { label: string; href: string }[]
}
