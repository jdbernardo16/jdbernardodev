import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import HeroSection from '../../app/components/HeroSection.vue'

describe('hero', () => {
  it('renders the promise, CTAs, and the bug smash game', async () => {
    const wrapper = await mountSuspended(HeroSection)

    expect(wrapper.get('h1').text()).toContain('Jaydee Bernardo')
    expect(wrapper.text()).toContain('AI systems that automate real work')
    expect(wrapper.find('a[href="#contact"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#work"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="data-stream"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="data-stream-start"]').exists()).toBe(true)
  })
})
