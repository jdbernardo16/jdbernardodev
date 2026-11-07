import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import BugSmashGame from '../../app/components/BugSmashGame.vue'

describe('bug smash game', () => {
  it('starts a build and squashes a bug', async () => {
    const wrapper = await mountSuspended(BugSmashGame)

    expect(wrapper.findAll('[data-testid^="bug-cell-"]')).toHaveLength(9)

    await wrapper.get('[data-testid="bug-smash-start"]').trigger('click')

    const bugCell = wrapper.findAll('[data-bug="true"]')[0]
    expect(bugCell).toBeTruthy()

    await bugCell!.trigger('click')

    expect(wrapper.text()).toContain('squashed a bug')
  })

  it('pauses under reduced motion', async () => {
    const wrapper = await mountSuspended(BugSmashGame, { props: { reducedMotion: true } })

    expect(wrapper.text()).toContain('Bug Smash is paused')
    expect(wrapper.find('[data-testid="bug-smash-start"]').exists()).toBe(false)
  })
})
