import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'
import type { ConsoleLine, WorkStudy } from '~/types/content'

export interface UseAgentConsoleOptions {
  reducedMotion?: Ref<boolean>
  autoStart?: boolean
}

export interface AgentConsoleState {
  activeSlug: Ref<string>
  isPlaying: Ref<boolean>
  speed: Ref<1 | 2>
  visibleLines: ComputedRef<ConsoleLine[]>
  setStudy: (slug: string) => void
  toggle: () => void
  setSpeed: (speed: 1 | 2) => void
}

export function useAgentConsole(
  studies: WorkStudy[],
  options: UseAgentConsoleOptions = {},
): AgentConsoleState {
  const activeSlug = ref(studies[0]?.slug ?? '')
  const isPlaying = ref(!options.reducedMotion?.value)
  const speed = ref<1 | 2>(1)
  const lineIndex = ref(1)
  const autoStart = options.autoStart ?? true

  const currentStudy = computed(() => studies.find((study) => study.slug === activeSlug.value))

  const visibleLines = computed<ConsoleLine[]>(() => {
    const study = currentStudy.value
    if (!study) return []
    if (options.reducedMotion?.value) return study.consoleLines
    return study.consoleLines.slice(0, lineIndex.value)
  })

  let timer: ReturnType<typeof setInterval> | undefined

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = undefined
    }
  }

  function schedule() {
    clearTimer()
    if (!autoStart || options.reducedMotion?.value || !isPlaying.value) return

    timer = setInterval(() => {
      const study = currentStudy.value
      if (!study) {
        isPlaying.value = false
        clearTimer()
        return
      }

      if (lineIndex.value >= study.consoleLines.length) {
        isPlaying.value = false
        clearTimer()
        return
      }

      lineIndex.value += 1

      if (lineIndex.value >= study.consoleLines.length) {
        isPlaying.value = false
        clearTimer()
      }
    }, 1000 / speed.value)
  }

  function setStudy(slug: string) {
    if (!studies.some((study) => study.slug === slug)) return
    activeSlug.value = slug
    lineIndex.value = 1
    isPlaying.value = !options.reducedMotion?.value
    schedule()
  }

  function toggle() {
    if (options.reducedMotion?.value) return

    isPlaying.value = !isPlaying.value

    if (isPlaying.value) {
      const study = currentStudy.value
      if (study && lineIndex.value >= study.consoleLines.length) lineIndex.value = 1
      schedule()
    } else {
      clearTimer()
    }
  }

  function setSpeed(nextSpeed: 1 | 2) {
    speed.value = nextSpeed
    if (isPlaying.value) schedule()
  }

  if (options.reducedMotion) {
    watch(options.reducedMotion, (reduced) => {
      if (reduced) {
        isPlaying.value = false
        clearTimer()
      } else {
        lineIndex.value = 1
        isPlaying.value = true
        schedule()
      }
    })
  }

  if (getCurrentScope()) onScopeDispose(clearTimer)

  schedule()

  return { activeSlug, isPlaying, speed, visibleLines, setStudy, toggle, setSpeed }
}
