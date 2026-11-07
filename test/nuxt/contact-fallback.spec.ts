import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import ContactForm from '../../app/components/ContactForm.vue'

describe('contact fallback', () => {
  it('renders a mailto link when no endpoint is configured', async () => {
    const wrapper = await mountSuspended(ContactForm)
    const link = wrapper.get('[data-testid="contact-mailto"]')
    expect(link.attributes('href')).toContain('mailto:jdbernardo16@gmail.com')
  })
})
