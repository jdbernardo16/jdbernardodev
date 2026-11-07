import { describe, it, expect } from 'vitest'
import { useAgentLab } from '../../app/composables/useAgentLab'
import { agentMissions } from '../../app/data/agentLab'

describe('agent lab', () => {
  it('accepts the correct pipeline', () => {
    const lab = useAgentLab(agentMissions)
    for (const id of agentMissions[0]!.solution) lab.addNode(id)
    lab.run()
    expect(lab.status.value).toBe('success')
    expect(lab.completed.value).toBe(true)
  })

  it('rejects a wrong order with a hint', () => {
    const lab = useAgentLab(agentMissions)
    lab.addNode(agentMissions[0]!.solution[1]!)
    lab.run()
    expect(lab.status.value).toBe('error')
    expect(lab.logs.value.map((log) => log.message).join(' ')).toContain(agentMissions[0]!.hint)
  })

  it('resets and advances missions', () => {
    const lab = useAgentLab(agentMissions)
    lab.addNode(agentMissions[0]!.solution[0]!)
    lab.reset()
    expect(lab.selected.value).toHaveLength(0)
    lab.nextMission()
    expect(lab.missionIndex.value).toBe(1)
    expect(lab.selected.value).toHaveLength(0)
  })
})
