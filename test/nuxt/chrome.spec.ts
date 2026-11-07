import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import AppHeader from '../../app/components/AppHeader.vue'
import StatusBar from '../../app/components/StatusBar.vue'

describe('developer chrome', () => {
  it('uses hash routes that work from case studies', async () => {
    const wrapper = await mountSuspended(AppHeader)
    expect(wrapper.find('a[href="/#work"]').exists()).toBe(true)
  })

  it('closes the mobile menu on Escape and restores focus', async () => {
    const wrapper = await mountSuspended(AppHeader, { attachTo: document.body })
    const toggle = wrapper.get('button[aria-controls="mobile-nav"]')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await new Promise(r => setTimeout(r, 0))
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle.element)
  })

  it('renders the status bar', async () => {
    const wrapper = await mountSuspended(StatusBar)
    expect(wrapper.text()).toContain('agent online')
    expect(wrapper.text()).toContain('⌘K')
  })
})
