import type { CommandItem } from '../composables/useCommandPalette'
import { workStudies } from './work'

export const commandItems: CommandItem[] = [
  { label: 'Work', href: '/#work', section: 'Home' },
  { label: 'Services', href: '/#services', section: 'Home' },
  { label: 'About', href: '/#about', section: 'Home' },
  { label: 'Security', href: '/#security', section: 'Home' },
  { label: 'Contact', href: '/#contact', section: 'Home' },
  ...workStudies.map((study) => ({
    label: study.title,
    href: `/work/${study.slug}`,
    section: 'Case studies',
  })),
]
