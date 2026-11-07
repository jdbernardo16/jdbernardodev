import { describe, it, expect } from 'vitest'
import { useCommandPalette } from '../../app/composables/useCommandPalette'

const items = [
  { label: 'About', href: '#about', section: 'Home' },
  { label: 'Education agent', href: '/work/education-agent', section: 'Case studies' },
  { label: 'MT5 agent', href: '/work/mt5-agent', section: 'Case studies' },
]

describe('command palette', () => {
  it('filters by label and section', () => {
    const palette = useCommandPalette(items)
    palette.query.value = 'mt5'
    expect(palette.filtered.value.map(i => i.label)).toEqual(['MT5 agent'])
    palette.query.value = 'case'
    expect(palette.filtered.value).toHaveLength(2)
    palette.query.value = ''
    expect(palette.filtered.value).toHaveLength(3)
  })

  it('toggles open state', () => {
    const palette = useCommandPalette(items)
    expect(palette.isOpen.value).toBe(false)
    palette.open()
    expect(palette.isOpen.value).toBe(true)
    palette.close()
    expect(palette.isOpen.value).toBe(false)
    palette.toggle()
    expect(palette.isOpen.value).toBe(true)
  })
})
