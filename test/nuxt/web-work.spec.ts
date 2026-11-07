import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import WebWorkSection from '../../app/components/WebWorkSection.vue'

describe('web work', () => {
  it('names cleared clients and keeps the CTA', async () => {
    const wrapper = await mountSuspended(WebWorkSection)
    expect(wrapper.text()).toContain('True Influence Method')
    expect(wrapper.text()).toContain('DrCare POS')
    expect(wrapper.text()).toContain('Retrosneak')
    expect(wrapper.text()).toContain('Jerrmond Dental Clinic')
    expect(wrapper.find('a[href="#contact"]').exists()).toBe(true)
  })
})
