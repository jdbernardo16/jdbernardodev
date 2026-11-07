export interface BugSmashCell {
  name: string
  code: string
}

export const bugSmashCells: BugSmashCell[] = [
  { name: 'auth.ts', code: 'verify(token)' },
  { name: 'api.ts', code: 'await fetch(url)' },
  { name: 'db.ts', code: 'findMany()' },
  { name: 'ui.tsx', code: '<Agent />' },
  { name: 'cache.ts', code: 'get(key)' },
  { name: 'queue.ts', code: 'enqueue(job)' },
  { name: 'mail.ts', code: 'sendEmail()' },
  { name: 'pay.ts', code: 'charge(amount)' },
  { name: 'deploy.sh', code: 'pnpm build' },
]
