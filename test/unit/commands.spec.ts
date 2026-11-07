import { describe, it, expect } from 'vitest'
import { parseCommand, runCommand } from '../../app/utils/commands'

const context = {
  workSlugs: ['education-agent', 'mt5-agent'],
  email: 'jdbernardo16@gmail.com',
}

describe('terminal commands', () => {
  it('parses names and args', () => {
    expect(parseCommand('open education-agent')).toEqual({ name: 'open', args: ['education-agent'] })
    expect(parseCommand('  help  ')).toEqual({ name: 'help', args: [] })
  })

  it('lists work and navigates to a case study', () => {
    expect(runCommand(parseCommand('ls'), context).output.join(' ')).toContain('education-agent')
    expect(runCommand(parseCommand('open mt5-agent'), context).navigate).toBe('/work/mt5-agent')
  })

  it('returns an error for an unknown command', () => {
    expect(runCommand(parseCommand('deploy'), context).output[0]).toContain('command not found')
  })
})
