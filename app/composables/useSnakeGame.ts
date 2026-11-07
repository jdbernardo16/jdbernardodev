import { computed, ref, type ComputedRef, type Ref } from 'vue'

export type Direction = 'up' | 'down' | 'left' | 'right'
export type SnakeStatus = 'idle' | 'ready' | 'playing' | 'paused' | 'over'

export interface Cell {
  x: number
  y: number
}

export interface SnakeGameOptions {
  gridSize?: number
  random?: () => number
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null
}

export interface SnakeGameState {
  gridSize: number
  status: Ref<SnakeStatus>
  snake: Ref<Cell[]>
  food: Ref<Cell>
  bugs: Ref<Cell[]>
  direction: Ref<Direction>
  score: Ref<number>
  best: Ref<number>
  speed: Ref<number>
  length: ComputedRef<number>
  start: () => void
  turn: (direction: Direction) => void
  tick: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

const BEST_KEY = 'data-stream-best'

const DELTAS: Record<Direction, Cell> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

function defaultStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function useSnakeGame(options: SnakeGameOptions = {}): SnakeGameState {
  const gridSize = options.gridSize ?? 10
  const random = options.random ?? Math.random
  const storage = options.storage === undefined ? defaultStorage() : options.storage

  const status = ref<SnakeStatus>('idle')
  const snake = ref<Cell[]>([])
  const food = ref<Cell>({ x: 0, y: 0 })
  const bugs = ref<Cell[]>([])
  const direction = ref<Direction>('right')
  const score = ref(0)
  const best = ref(0)
  const speed = ref(240)

  const queue: Direction[] = []

  const length = computed(() => snake.value.length)

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
      // Storage can be unavailable; the in-memory best still works.
    }
  }

  function occupied(cell: Cell): boolean {
    return (
      snake.value.some((segment) => segment.x === cell.x && segment.y === cell.y) ||
      (food.value.x === cell.x && food.value.y === cell.y) ||
      bugs.value.some((bug) => bug.x === cell.x && bug.y === cell.y)
    )
  }

  function randomFreeCell(): Cell {
    const free: Cell[] = []
    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const cell = { x, y }
        if (!occupied(cell)) free.push(cell)
      }
    }

    if (!free.length) return { x: 0, y: 0 }
    return free[Math.floor(random() * free.length)] ?? free[0]!
  }

  function spawnFood() {
    food.value = randomFreeCell()
  }

  function spawnBug() {
    if (bugs.value.length >= 4) return
    const cell = randomFreeCell()
    if (cell.x === food.value.x && cell.y === food.value.y) return
    bugs.value = [...bugs.value, cell]
  }

  function end() {
    status.value = 'over'
    saveBest()
  }

  function tick() {
    if (status.value !== 'playing') return

    const queued = queue.shift()
    if (queued) direction.value = queued

    const head = snake.value[0]
    if (!head) return

    const delta = DELTAS[direction.value]
    const next = { x: head.x + delta.x, y: head.y + delta.y }

    if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize) {
      end()
      return
    }

    if (bugs.value.some((bug) => bug.x === next.x && bug.y === next.y)) {
      end()
      return
    }

    const eating = next.x === food.value.x && next.y === food.value.y
    const body = eating ? snake.value : snake.value.slice(0, -1)

    if (body.some((segment) => segment.x === next.x && segment.y === next.y)) {
      end()
      return
    }

    const nextSnake = [next, ...snake.value]
    if (!eating) nextSnake.pop()
    snake.value = nextSnake

    if (eating) {
      score.value += 1
      speed.value = Math.max(110, 240 - score.value * 8)
      spawnFood()
      if (score.value % 3 === 0) spawnBug()
    }
  }

  function turn(nextDirection: Direction) {
    if (status.value === 'ready') {
      const current = direction.value
      if (OPPOSITES[current] === nextDirection) return
      direction.value = nextDirection
      queue.length = 0
      status.value = 'playing'
      return
    }

    if (status.value !== 'playing') return

    const current = queue.length ? queue[queue.length - 1]! : direction.value
    if (OPPOSITES[current] === nextDirection) return
    if (current === nextDirection) return
    if (queue.length >= 2) return

    queue.push(nextDirection)
  }

  function start() {
    status.value = 'ready'
    snake.value = [
      { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) },
      { x: Math.floor(gridSize / 2) - 1, y: Math.floor(gridSize / 2) },
      { x: Math.floor(gridSize / 2) - 2, y: Math.floor(gridSize / 2) },
    ]
    direction.value = 'right'
    queue.length = 0
    score.value = 0
    speed.value = 240
    bugs.value = []
    spawnFood()
  }

  function pause() {
    if (status.value === 'playing') status.value = 'paused'
  }

  function resume() {
    if (status.value === 'paused') status.value = 'playing'
  }

  function reset() {
    status.value = 'idle'
    snake.value = []
    bugs.value = []
    score.value = 0
    speed.value = 240
    queue.length = 0
  }

  loadBest()

  return {
    gridSize,
    status,
    snake,
    food,
    bugs,
    direction,
    score,
    best,
    speed,
    length,
    start,
    turn,
    tick,
    pause,
    resume,
    reset,
  }
}
