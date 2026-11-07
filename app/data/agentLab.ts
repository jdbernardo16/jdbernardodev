export type AgentNodeKind = 'watch' | 'check' | 'act' | 'notify' | 'log'

export interface AgentNode {
  id: string
  label: string
  kind: AgentNodeKind
}

export interface AgentMission {
  id: string
  label: string
  clientType: string
  brief: string
  nodes: AgentNode[]
  solution: string[]
  hint: string
  success: string
  workSlug: string
}

export const agentMissions: AgentMission[] = [
  {
    id: 'ecommerce',
    label: 'E-commerce',
    clientType: 'Order monitoring agent',
    brief:
      'A new order just landed. Build the agent that catches it, checks stock, and tells the owner.',
    nodes: [
      { id: 'watch-market', label: 'watch marketplace', kind: 'watch' },
      { id: 'check-stock', label: 'check inventory', kind: 'check' },
      { id: 'notify-owner', label: 'notify owner', kind: 'notify' },
      { id: 'log-order', label: 'log order', kind: 'log' },
      { id: 'charge-card', label: 'charge card', kind: 'act' },
      { id: 'ignore', label: 'ignore', kind: 'act' },
    ],
    solution: ['watch-market', 'check-stock', 'notify-owner', 'log-order'],
    hint: 'Start by watching the marketplace, then verify stock before you act.',
    success: 'New order detected, stock verified, owner notified, order logged.',
    workSlug: 'ecommerce-agent',
  },
  {
    id: 'education',
    label: 'Education',
    clientType: 'Grading automation agent',
    brief:
      'A batch of submissions is waiting. Build the agent that grades, records, and flags what needs attention.',
    nodes: [
      { id: 'read-submission', label: 'read submission', kind: 'watch' },
      { id: 'match-rubric', label: 'match rubric', kind: 'check' },
      { id: 'record-result', label: 'record result', kind: 'log' },
      { id: 'flag-teacher', label: 'flag teacher', kind: 'notify' },
      { id: 'publish-grades', label: 'publish grades', kind: 'act' },
      { id: 'delete-submission', label: 'delete submission', kind: 'act' },
    ],
    solution: ['read-submission', 'match-rubric', 'record-result', 'flag-teacher'],
    hint: 'Read the submission and match the rubric before recording anything.',
    success: 'Submission read, rubric matched, result recorded, teacher flagged for review.',
    workSlug: 'education-agent',
  },
  {
    id: 'trading',
    label: 'Trading',
    clientType: 'MT5 operations agent',
    brief:
      'A signal just arrived. Build the agent that checks risk before it touches the account.',
    nodes: [
      { id: 'receive-signal', label: 'receive signal', kind: 'watch' },
      { id: 'risk-check', label: 'risk check', kind: 'check' },
      { id: 'open-position', label: 'open position', kind: 'act' },
      { id: 'log-trade', label: 'log trade', kind: 'log' },
      { id: 'double-down', label: 'double down', kind: 'act' },
      { id: 'sleep', label: 'sleep', kind: 'act' },
    ],
    solution: ['receive-signal', 'risk-check', 'open-position', 'log-trade'],
    hint: 'Never open a position before the risk check passes.',
    success: 'Signal received, risk check passed, position opened, trade logged.',
    workSlug: 'mt5-agent',
  },
]
