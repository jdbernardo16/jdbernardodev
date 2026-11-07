import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useAgentConsole } from '../../app/composables/useAgentConsole'
import { workStudies } from '../../app/data/work'

describe('agent console', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('reveals one line per second and pauses', () => {
    const consoleState = useAgentConsole(workStudies)
    expect(consoleState.activeSlug.value).toBe('education-agent')
    expect(consoleState.visibleLines.value).toHaveLength(1)

    vi.advanceTimersByTime(1000)
    expect(consoleState.visibleLines.value).toHaveLength(2)

    consoleState.toggle()
    expect(consoleState.isPlaying.value).toBe(false)
    vi.advanceTimersByTime(2000)
    expect(consoleState.visibleLines.value).toHaveLength(2)
  })

  it('resets when switching studies', () => {
    const consoleState = useAgentConsole(workStudies)
    consoleState.setStudy('mt5-agent')
    expect(consoleState.activeSlug.value).toBe('mt5-agent')
    expect(consoleState.visibleLines.value).toHaveLength(1)
  })

  it('shows all lines immediately under reduced motion', () => {
    const reducedMotion = ref(true)
    const consoleState = useAgentConsole(workStudies, { reducedMotion })
    expect(consoleState.isPlaying.value).toBe(false)
    expect(consoleState.visibleLines.value).toHaveLength(workStudies[0].consoleLines.length)
  })
})
