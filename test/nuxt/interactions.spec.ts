import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import CommandPalette from '../../app/components/CommandPalette.vue'
import MetricCounter from '../../app/components/MetricCounter.vue'

const items = [
  { label: 'About', href: '#about', section: 'Home' },
  { label: 'Education agent', href: '/work/education-agent', section: 'Case studies' },
]

describe('interactions', () => {
  it('opens with meta+k and closes on escape', async () => {
    const wrapper = await mountSuspended(CommandPalette, { props: { items } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('filters results and exposes them as options', async () => {
    const wrapper = await mountSuspended(CommandPalette, { props: { items } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    await nextTick()
    await wrapper.get('input[type="search"]').setValue('edu')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
  })

  it('renders the counter value statically under reduced motion', async () => {
    const wrapper = await mountSuspended(MetricCounter, {
      props: { value: '5x', label: 'faster grading workflow', estimate: true },
    })
    expect(wrapper.text()).toContain('5x')
    expect(wrapper.text()).toContain('estimate')
  })
})
