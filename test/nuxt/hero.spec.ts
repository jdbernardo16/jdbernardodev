import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import AgentFlowCanvas from '../../app/components/AgentFlowCanvas.vue'
import HeroSection from '../../app/components/HeroSection.vue'

describe('hero', () => {
  it('renders the four flow labels as a static fallback', async () => {
    const wrapper = await mountSuspended(AgentFlowCanvas, { props: { reducedMotion: true } })
    expect(wrapper.text()).toContain('Detect')
    expect(wrapper.text()).toContain('Reason')
    expect(wrapper.text()).toContain('Act')
    expect(wrapper.text()).toContain('Notify')
    expect(wrapper.find('canvas').exists()).toBe(false)
  })

  it('renders the promise and CTAs', async () => {
    const wrapper = await mountSuspended(HeroSection)
    expect(wrapper.get('h1').text()).toContain('Jaydee Bernardo')
    expect(wrapper.text()).toContain('AI systems that automate real work')
    expect(wrapper.find('a[href="#contact"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#work"]').exists()).toBe(true)
  })
})
