import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useBugSmash } from '../../app/composables/useBugSmash'

describe('bug smash', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts a build with a bug and squashes it', () => {
    const game = useBugSmash({ random: () => 0, storage: null })
    game.start()

    expect(game.status.value).toBe('playing')
    expect(game.active.value[0]).toBeDefined()

    game.squash(0)

    expect(game.score.value).toBe(1)
    expect(game.squashed.value).toBe(1)
    expect(game.active.value[0]).toBeUndefined()
  })

  it('loses a life when a bug ships', () => {
    const game = useBugSmash({ random: () => 0, storage: null, startingLives: 3 })
    game.start()

    vi.advanceTimersByTime(1400)

    expect(game.lives.value).toBe(2)
  })

  it('ends when the build timer reaches zero', () => {
    const game = useBugSmash({ random: () => 0, storage: null, duration: 3, startingLives: 99 })
    game.start()

    vi.advanceTimersByTime(3100)

    expect(game.status.value).toBe('over')
    expect(game.lastEvent.value).toContain('build shipped')
  })
})
