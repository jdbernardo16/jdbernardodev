import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import WorkSection from '../../app/components/WorkSection.vue'
import AgentConsole from '../../app/components/AgentConsole.vue'
import { workStudies } from '../../app/data/work'

describe('work section', () => {
  it('renders four case-study cards linking to detail pages', async () => {
    const wrapper = await mountSuspended(WorkSection, { props: { studies: workStudies } })
    expect(wrapper.findAll('[data-testid="work-card"]')).toHaveLength(4)
    expect(wrapper.find('a[href="/work/education-agent"]').exists()).toBe(true)
  })

  it('switches console tabs', async () => {
    const wrapper = await mountSuspended(AgentConsole, { props: { studies: workStudies } })
    await wrapper.get('[data-testid="console-tab-mt5-agent"]').trigger('click')
    expect(wrapper.text()).toContain('signal received')
  })

  it('shows a static sample run under reduced motion', async () => {
    const wrapper = await mountSuspended(AgentConsole, {
      props: { studies: workStudies, reducedMotion: true },
    })
    expect(wrapper.findAll('[data-testid="console-line"]')).toHaveLength(workStudies[0].consoleLines.length)
    expect(wrapper.find('[data-testid="console-play"]').exists()).toBe(false)
  })
})
