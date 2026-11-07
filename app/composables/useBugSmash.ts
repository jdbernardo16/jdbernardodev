import { getCurrentScope, onScopeDispose, ref, type Ref } from 'vue'

export type BugSmashStatus = 'idle' | 'playing' | 'over'

export interface BugSmashOptions {
  duration?: number
  cellNames?: string[]
  startingLives?: number
  random?: () => number
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null
}

export interface BugSmashState {
  status: Ref<BugSmashStatus>
  score: Ref<number>
  combo: Ref<number>
  best: Ref<number>
  lives: Ref<number>
  timeLeft: Ref<number>
  active: Ref<Record<number, number>>
  squashed: Ref<number>
  lastEvent: Ref<string>
  start: () => void
  reset: () => void
  squash: (cell: number) => void
}

const BEST_KEY = 'bug-smash-best'

function defaultStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function useBugSmash(options: BugSmashOptions = {}): BugSmashState {
  const duration = options.duration ?? 30
  const startingLives = options.startingLives ?? 3
  const random = options.random ?? Math.random
  const storage = options.storage === undefined ? defaultStorage() : options.storage
  const cellNames = options.cellNames ?? []
  const cellCount = cellNames.length || 9

  const status = ref<BugSmashStatus>('idle')
  const score = ref(0)
  const combo = ref(0)
  const best = ref(0)
  const lives = ref(startingLives)
  const timeLeft = ref(duration)
  const active = ref<Record<number, number>>({})
  const squashed = ref(0)
  const lastEvent = ref('')

  let spawnTimer: ReturnType<typeof setInterval> | undefined
  let countdown: ReturnType<typeof setInterval> | undefined
  let expiryTimers: Record<number, ReturnType<typeof setTimeout>> = {}
  let nextBugId = 1

  function cellName(cell: number): string {
    return cellNames[cell] ?? `cell ${cell + 1}`
  }

  function loadBest() {
    if (!storage) return
    try {
      best.value = Number(storage.getItem(BEST_KEY) ?? 0) || 0
    } catch {
      best.value = 0
    }
  }

  function saveBest() {
    if (!storage || score.value <= best.value) return
    best.value = score.value
    try {
      storage.setItem(BEST_KEY, String(best.value))
    } catch {
      // Storage can be unavailable in private mode; the in-memory best still works.
    }
  }

  function clearTimers() {
    if (spawnTimer) clearInterval(spawnTimer)
    if (countdown) clearInterval(countdown)
    spawnTimer = undefined
    countdown = undefined

    for (const timer of Object.values(expiryTimers)) clearTimeout(timer)
    expiryTimers = {}
  }

  function end(reason: string) {
    status.value = 'over'
    lastEvent.value = reason
    clearTimers()
    saveBest()
  }

  function miss(cell: number) {
    if (status.value !== 'playing' || active.value[cell] === undefined) return

    const next = { ...active.value }
    delete next[cell]
    active.value = next
    delete expiryTimers[cell]

    combo.value = 0
    lives.value -= 1
    lastEvent.value = `a bug shipped from ${cellName(cell)}`

    if (lives.value <= 0) end('build failed — too many bugs shipped')
  }

  function spawn() {
    if (status.value !== 'playing') return

    const occupied = new Set(Object.keys(active.value).map(Number))
    const free = Array.from({ length: cellCount }, (_, index) => index).filter(
      (index) => !occupied.has(index),
    )
    if (!free.length) return

    const cell = free[Math.floor(random() * free.length)] ?? free[0]!
    active.value = { ...active.value, [cell]: nextBugId++ }

    const elapsed = duration - timeLeft.value
    const lifetime = Math.max(700, 1300 - elapsed * 18)
    expiryTimers[cell] = setTimeout(() => miss(cell), lifetime)
  }

  function squash(cell: number) {
    if (status.value !== 'playing') return

    if (active.value[cell] === undefined) {
      combo.value = 0
      lastEvent.value = `no bug in ${cellName(cell)}`
      return
    }

    if (expiryTimers[cell]) {
      clearTimeout(expiryTimers[cell])
      delete expiryTimers[cell]
    }

    const next = { ...active.value }
    delete next[cell]
    active.value = next

    squashed.value += 1
    combo.value += 1
    score.value += 1 + Math.min(4, Math.floor(combo.value / 3))
    lastEvent.value = `squashed a bug in ${cellName(cell)}`
  }

  function start() {
    clearTimers()
    status.value = 'playing'
    score.value = 0
    combo.value = 0
    lives.value = startingLives
    timeLeft.value = duration
    active.value = {}
    squashed.value = 0
    lastEvent.value = 'build started — squash the bugs'

    spawn()
    spawnTimer = setInterval(spawn, 900)
    countdown = setInterval(() => {
      timeLeft.value -= 1
      if (timeLeft.value <= 0) end('build shipped — bugs squashed')
    }, 1000)
  }

  function reset() {
    clearTimers()
    status.value = 'idle'
    score.value = 0
    combo.value = 0
    lives.value = startingLives
    timeLeft.value = duration
    active.value = {}
    squashed.value = 0
    lastEvent.value = ''
  }

  loadBest()
  if (getCurrentScope()) onScopeDispose(clearTimers)

  return {
    status,
    score,
    combo,
    best,
    lives,
    timeLeft,
    active,
    squashed,
    lastEvent,
    start,
    reset,
    squash,
  }
}
