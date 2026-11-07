import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import AppHeader from '../../app/components/AppHeader.vue'
import AppFooter from '../../app/components/AppFooter.vue'

describe('app shell', () => {
  it('renders the name, nav, and primary CTA', async () => {
    const wrapper = await mountSuspended(AppHeader)
    expect(wrapper.text()).toContain('Jaydee Bernardo')
    expect(wrapper.find('a[href="#work"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Start a project')
  })

  it('toggles the mobile menu with aria-expanded', async () => {
    const wrapper = await mountSuspended(AppHeader)
    const button = wrapper.get('button[aria-controls="mobile-nav"]')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
  })

  it('renders contact and privacy links in the footer', async () => {
    const wrapper = await mountSuspended(AppFooter)
    expect(wrapper.find('a[href="mailto:jdbernardo16@gmail.com"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/privacy"]').exists()).toBe(true)
  })
})
