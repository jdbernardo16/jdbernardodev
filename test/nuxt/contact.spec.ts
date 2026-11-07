import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ContactForm from '../../app/components/ContactForm.vue'

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
mockNuxtImport('$fetch', () => fetchMock)

describe('contact form', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('shows validation errors on empty submit', async () => {
    const wrapper = await mountSuspended(ContactForm, { props: { endpoint: 'https://example.test/form' } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Consent is required')
  })

  it('submits a valid payload and shows success', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const wrapper = await mountSuspended(ContactForm, { props: { endpoint: 'https://example.test/form' } })
    await wrapper.get('input[name="name"]').setValue('Ana Cruz')
    await wrapper.get('input[name="email"]').setValue('ana@example.com')
    await wrapper.get('select[name="projectType"]').setValue('AI agent')
    await wrapper.get('textarea[name="message"]').setValue('I need an agent that monitors orders and notifies my team.')
    await wrapper.get('input[name="consent"]').setValue(true)
    await wrapper.get('form').trigger('submit')
    expect(fetchMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Thanks')
  })

  it('includes a honeypot field', async () => {
    const wrapper = await mountSuspended(ContactForm, { props: { endpoint: 'https://example.test/form' } })
    expect(wrapper.find('input[name="_gotcha"]').exists()).toBe(true)
  })
})
