import { describe, it, expect } from 'vitest'
import { useSnakeGame } from '../../app/composables/useSnakeGame'

describe('data stream', () => {
  it('waits for input, then moves right', () => {
    const game = useSnakeGame({ random: () => 0, storage: null })
    game.start()

    expect(game.status.value).toBe('ready')
    expect(game.snake.value[0]).toEqual({ x: 5, y: 5 })

    game.turn('right')
    game.tick()

    expect(game.status.value).toBe('playing')
    expect(game.snake.value[0]).toEqual({ x: 6, y: 5 })
  })

  it('turns up and ignores a reverse', () => {
    const game = useSnakeGame({ random: () => 0, storage: null })
    game.start()

    game.turn('left')
    expect(game.status.value).toBe('ready')

    game.turn('up')
    game.tick()
    expect(game.snake.value[0]).toEqual({ x: 5, y: 4 })
  })

  it('eats food and grows', () => {
    const game = useSnakeGame({ random: () => 0, storage: null })
    game.start()
    game.turn('right')

    game.food.value = { x: 6, y: 5 }
    game.tick()

    expect(game.score.value).toBe(1)
    expect(game.snake.value).toHaveLength(4)
  })

  it('ends at the wall', () => {
    const game = useSnakeGame({ random: () => 0, storage: null })
    game.start()
    game.turn('right')

    for (let step = 0; step < 6; step += 1) game.tick()

    expect(game.status.value).toBe('over')
  })

  it('ends on a bug', () => {
    const game = useSnakeGame({ random: () => 0, storage: null })
    game.start()
    game.turn('right')

    game.bugs.value = [{ x: 6, y: 5 }]
    game.tick()

    expect(game.status.value).toBe('over')
  })
})
