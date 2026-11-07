import type { Service } from '../types/content'

export const services: Service[] = [
  {
    id: 'ai-agents',
    title: 'AI agents',
    description: 'Systems that monitor a source, reason about it, take action, and notify a human.',
    bullets: ['Grading automation', 'MT5 trading operations', 'E-commerce order monitoring'],
    workSlug: 'education-agent',
  },
  {
    id: 'ai-assistants',
    title: 'AI assistants',
    description: 'Chat interfaces grounded in a website, CRM, or document set.',
    bullets: ['Website-grounded support', 'CRM-aware recommendations', 'Retrieval and guardrails'],
    workSlug: 'real-estate-agent',
  },
  {
    id: 'ai-integration',
    title: 'AI integration',
    description: 'Adding AI to existing apps and workflows with APIs, retrieval, and evaluation.',
    bullets: ['API and tool calling', 'Retrieval pipelines', 'Evaluation and guardrails'],
  },
  {
    id: 'vapt',
    title: 'VAPT & security',
    description: 'Scoped vulnerability assessment, penetration testing, remediation, and incident response.',
    bullets: ['Penetration testing', 'Findings and remediation', 'Incident response'],
  },
  {
    id: 'full-stack',
    title: 'Full-stack delivery',
    description: 'Production web apps in Node.js, Vue/Nuxt, Laravel, PHP, and Silverstripe.',
    bullets: ['Node.js and Vue/Nuxt', 'Laravel and Silverstripe', 'Accessible, responsive UI'],
  },
]
