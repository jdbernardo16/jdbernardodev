import type { WorkStudy } from '../types/content'

export const workStudies: WorkStudy[] = [
  {
    slug: 'education-agent',
    category: 'AI agent',
    clientType: 'Education',
    title: 'Grading automation agent',
    summary: 'An AI assistant that automates grading, records results, and flags what needs attention.',
    problem:
      'Manual grading and record-keeping consumed time, and important follow-ups were easy to miss.',
    build: [
      'Automated the grading workflow from submission to recorded result.',
      'Generated summaries and flagged low-confidence items for the teacher.',
      'Sent notifications when a student needed attention.',
    ],
    outcome: [
      'Up to 5x faster grading workflow (owner estimate).',
      'Fewer manual errors and missed follow-ups.',
      'More time returned to teaching.',
    ],
    stack: ['AI agent workflow', 'Automation', 'Notifications', 'Data recording'],
    metrics: [{ value: '5x', label: 'faster grading workflow', estimate: true }],
    consoleLines: [
      { time: '09:14:02', message: 'grade submitted → rubric matched → result recorded', tone: 'success' },
      { time: '09:14:07', message: 'low confidence on item 4 → teacher notified', tone: 'warn' },
      { time: '09:14:11', message: 'report updated → 28 students complete', tone: 'info' },
    ],
    confidential: true,
  },
  {
    slug: 'mt5-agent',
    category: 'AI agent',
    clientType: 'Trading',
    title: 'MT5 operations agent',
    summary: "A Hermes agent that manages an MT5 account and executes trades within the client's rules.",
    problem: 'The trader needed an agent to operate and manage an MT5 account without manual intervention.',
    build: [
      'Configured Hermes, an open-source AI agent runtime, to manage the MT5 account.',
      "Encoded the client's trading rules and risk checks.",
      'Logged every action and notified the owner.',
    ],
    outcome: [
      'Automated trade management.',
      'The trader can monitor rather than manually operate.',
      'Every action is logged for review.',
    ],
    stack: ['Hermes', 'MT5 integration', 'Trading rules', 'Notifications'],
    metrics: [],
    consoleLines: [
      { time: '09:15:01', message: 'signal received → risk check passed', tone: 'info' },
      { time: '09:15:03', message: 'MT5 position opened → stop set', tone: 'success' },
      { time: '09:15:04', message: 'owner notified → trade logged', tone: 'info' },
    ],
    confidential: true,
  },
  {
    slug: 'ecommerce-agent',
    category: 'AI agent',
    clientType: 'E-commerce',
    title: 'Order monitoring agent',
    summary: 'A Hermes agent that watches the online market and alerts the owner when a new order arrives.',
    problem: 'The owner had to watch marketplaces manually for new orders.',
    build: [
      'Connected a Hermes agent to the online market/e-commerce channel.',
      'Polled for new orders and checked inventory.',
      'Notified the owner with the order details.',
    ],
    outcome: [
      'Faster response to new orders.',
      'Fewer missed sales.',
      'The owner no longer watches the marketplace manually.',
    ],
    stack: ['Hermes', 'Marketplace monitoring', 'Notifications'],
    metrics: [],
    consoleLines: [
      { time: '09:16:02', message: 'marketplace polled → new order detected', tone: 'info' },
      { time: '09:16:03', message: 'inventory checked → item reserved', tone: 'success' },
      { time: '09:16:04', message: 'owner notified → order queued', tone: 'info' },
    ],
    confidential: true,
  },
  {
    slug: 'real-estate-agent',
    category: 'AI assistant',
    clientType: 'Real estate',
    title: 'CRM-aware property assistant',
    summary: "A Node.js chatbot that recommends only available properties from the client's CRM.",
    problem: 'Customer inquiries required an agent who knew live inventory.',
    build: [
      "Built a Node.js chatbot connected to the client's CRM.",
      'Searched live inventory before recommending a property.',
      'Answered questions and shared viewing links.',
    ],
    outcome: [
      'Faster, more accurate inquiry handling.',
      'Recommendations grounded in real inventory.',
      'Customers get useful advice without waiting for an agent.',
    ],
    stack: ['Node.js', 'CRM integration', 'LLM', 'Retrieval'],
    metrics: [],
    consoleLines: [
      { time: '09:17:01', message: 'inquiry received → budget and area parsed', tone: 'info' },
      { time: '09:17:02', message: 'CRM searched → 3 available properties matched', tone: 'success' },
      { time: '09:17:03', message: 'recommendation sent → viewing link shared', tone: 'info' },
    ],
    confidential: true,
  },
]

export function getWorkStudy(slug: string): WorkStudy | undefined {
  return workStudies.find((study) => study.slug === slug)
}
