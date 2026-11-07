import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { AgentMission } from '~/data/agentLab'

export type AgentLabStatus = 'idle' | 'running' | 'success' | 'error'
export type AgentLabTone = 'info' | 'success' | 'warn' | 'error'

export interface AgentLabLog {
  time: string
  message: string
  tone: AgentLabTone
}

export interface AgentLabState {
  missionIndex: Ref<number>
  mission: ComputedRef<AgentMission>
  selected: Ref<string[]>
  status: Ref<AgentLabStatus>
  logs: Ref<AgentLabLog[]>
  completed: Ref<boolean>
  addNode: (id: string) => void
  removeNode: (index: number) => void
  run: () => void
  reset: () => void
  setMission: (index: number) => void
  nextMission: () => void
}

function stamp(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

export function useAgentLab(missions: AgentMission[]): AgentLabState {
  const missionIndex = ref(0)
  const selected = ref<string[]>([])
  const status = ref<AgentLabStatus>('idle')
  const logs = ref<AgentLabLog[]>([])
  const completed = ref(false)

  const mission = computed(() => missions[missionIndex.value] ?? missions[0]!)

  function addNode(id: string) {
    if (selected.value.length >= 4) return
    if (selected.value.includes(id)) return
    if (!mission.value.nodes.some((node) => node.id === id)) return

    selected.value.push(id)
    status.value = 'idle'
    completed.value = false
  }

  function removeNode(index: number) {
    selected.value.splice(index, 1)
    status.value = 'idle'
    completed.value = false
  }

  function run() {
    const solution = mission.value.solution

    if (selected.value.length !== solution.length) {
      status.value = 'error'
      logs.value = [
        {
          time: stamp(),
          message: `Pipeline has ${selected.value.length}/${solution.length} steps. Fill every slot before running.`,
          tone: 'warn',
        },
        { time: stamp(), message: mission.value.hint, tone: 'info' },
      ]
      return
    }

    const correct = solution.every((id, index) => selected.value[index] === id)

    if (!correct) {
      status.value = 'error'
      logs.value = [
        { time: stamp(), message: mission.value.hint, tone: 'warn' },
        {
          time: stamp(),
          message: `Your pipeline: ${selected.value
            .map((id) => mission.value.nodes.find((node) => node.id === id)?.label ?? id)
            .join(' → ')}`,
          tone: 'error',
        },
      ]
      return
    }

    status.value = 'success'
    completed.value = true
    logs.value = [
      { time: stamp(), message: 'agent started', tone: 'info' },
      ...solution.map((id) => ({
        time: stamp(),
        message: mission.value.nodes.find((node) => node.id === id)?.label ?? id,
        tone: 'info' as const,
      })),
      { time: stamp(), message: mission.value.success, tone: 'success' },
    ]
  }

  function reset() {
    selected.value = []
    status.value = 'idle'
    logs.value = []
    completed.value = false
  }

  function setMission(index: number) {
    if (index < 0 || index >= missions.length) return
    missionIndex.value = index
    reset()
  }

  function nextMission() {
    missionIndex.value = (missionIndex.value + 1) % missions.length
    reset()
  }

  return {
    missionIndex,
    mission,
    selected,
    status,
    logs,
    completed,
    addNode,
    removeNode,
    run,
    reset,
    setMission,
    nextMission,
  }
}
