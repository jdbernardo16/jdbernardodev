import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import AgentLab from '../../app/components/AgentLab.vue'
import { agentMissions } from '../../app/data/agentLab'

describe('agent lab component', () => {
  it('runs the correct pipeline and unlocks the case study', async () => {
    const wrapper = await mountSuspended(AgentLab)
    for (const id of agentMissions[0]!.solution) {
      await wrapper.get(`[data-testid="node-${id}"]`).trigger('click')
    }
    await wrapper.get('[data-testid="agent-run"]').trigger('click')
    expect(wrapper.text()).toContain('mission complete')
    expect(wrapper.find(`a[href="/work/${agentMissions[0]!.workSlug}"]`).exists()).toBe(true)
  })

  it('shows a hint on a wrong pipeline', async () => {
    const wrapper = await mountSuspended(AgentLab)
    await wrapper.get(`[data-testid="node-${agentMissions[0]!.solution[1]}"]`).trigger('click')
    await wrapper.get('[data-testid="agent-run"]').trigger('click')
    expect(wrapper.text()).toContain(agentMissions[0]!.hint)
  })
})
