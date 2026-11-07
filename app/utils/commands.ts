export interface ParsedCommand {
  name: string
  args: string[]
}

export interface CommandContext {
  workSlugs: string[]
  email: string
}

export interface CommandResult {
  output: string[]
  navigate?: string
  clear?: boolean
  close?: boolean
}

export function parseCommand(input: string): ParsedCommand {
  const parts = input.trim().split(/\s+/).filter(Boolean)
  return { name: (parts[0] ?? '').toLowerCase(), args: parts.slice(1) }
}

export function runCommand(command: ParsedCommand, context: CommandContext): CommandResult {
  switch (command.name) {
    case 'help':
      return {
        output: [
          'available commands:',
          '  help            show this list',
          '  ls              list sections and case studies',
          '  open <slug>     open a case study',
          '  whoami          print the short bio',
          '  contact         jump to the contact section',
          '  missions        list the agent lab missions',
          '  clear           clear the terminal',
          '  close           close the terminal',
        ],
      }
    case 'ls':
      return {
        output: [
          'work/',
          ...context.workSlugs.map((slug) => `  ${slug}`),
          'services/',
          'about/',
          'security/',
          'contact/',
        ],
      }
    case 'open': {
      const slug = command.args[0] ?? ''
      if (!context.workSlugs.includes(slug)) {
        return { output: [`open: no case study named "${slug}"`, 'try: ls'] }
      }
      return { output: [`opening /work/${slug}`], navigate: `/work/${slug}`, close: true }
    }
    case 'whoami':
      return {
        output: [
          'jaydee bernardo — senior ai engineer & full-stack developer',
          'marilao, bulacan, philippines',
        ],
      }
    case 'contact':
      return { output: [`email: ${context.email}`, 'opening contact section'], navigate: '/#contact', close: true }
    case 'missions':
      return {
        output: [
          'agent lab missions:',
          '  ecommerce — order monitoring',
          '  education — grading automation',
          '  trading   — mt5 operations',
        ],
      }
    case 'clear':
      return { output: [], clear: true }
    case 'close':
      return { output: [], close: true }
    case '':
      return { output: [] }
    default:
      return { output: [`command not found: ${command.name}`, 'type "help" for available commands'] }
  }
}
