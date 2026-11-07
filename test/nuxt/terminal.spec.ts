import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import CommandPalette from '../../app/components/CommandPalette.vue'

const items = [{ label: 'Work', href: '/#work', section: 'Home' }]

describe('terminal palette', () => {
  it('prints help output', async () => {
    const wrapper = await mountSuspended(CommandPalette, { props: { items } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    await nextTick()
    await wrapper.get('input[type="text"]').setValue('help')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('open <slug>')
  })
})
