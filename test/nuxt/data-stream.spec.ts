import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import DataStreamGame from '../../app/components/DataStreamGame.vue'

describe('data stream game', () => {
  it('shows the start screen and direction controls', async () => {
    const wrapper = await mountSuspended(DataStreamGame)

    expect(wrapper.find('[data-testid="data-stream-start"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid^="turn-"]')).toHaveLength(4)
  })

  it('pauses under reduced motion', async () => {
    const wrapper = await mountSuspended(DataStreamGame, { props: { reducedMotion: true } })

    expect(wrapper.text()).toContain('Data Stream is paused')
    expect(wrapper.find('[data-testid="data-stream-start"]').exists()).toBe(false)
  })
})
