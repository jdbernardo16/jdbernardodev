import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import ProofStrip from '../../app/components/ProofStrip.vue'
import ServicesSection from '../../app/components/ServicesSection.vue'
import AboutSection from '../../app/components/AboutSection.vue'
import SecuritySection from '../../app/components/SecuritySection.vue'
import { services } from '../../app/data/services'

describe('home sections', () => {
  it('renders proof with the estimate label', async () => {
    const wrapper = await mountSuspended(ProofStrip)
    expect(wrapper.text()).toContain('5x')
    expect(wrapper.text()).toContain('estimate')
    expect(wrapper.text()).toContain('two weeks')
  })

  it('renders five services and links relevant work', async () => {
    const wrapper = await mountSuspended(ServicesSection, { props: { services } })
    expect(wrapper.findAll('[data-testid="service-card"]')).toHaveLength(5)
    expect(wrapper.find('a[href="/work/education-agent"]').exists()).toBe(true)
  })

  it('renders the senior role and location', async () => {
    const wrapper = await mountSuspended(AboutSection)
    expect(wrapper.text()).toContain('Senior Developer at Praxxys')
    expect(wrapper.text()).toContain('Marilao, Bulacan')
  })

  it('describes the security incident without agency names', async () => {
    const wrapper = await mountSuspended(SecuritySection)
    expect(wrapper.text()).toContain('SQL injection')
    expect(wrapper.text()).not.toContain('PNA')
    expect(wrapper.text()).not.toContain('DOJ')
  })
})
