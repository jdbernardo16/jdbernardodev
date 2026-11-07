import { describe, it, expect } from 'vitest'
import { createNodePositions, particleCountForWidth, hitTestNode } from '../../app/utils/agent-flow'

describe('agent flow geometry', () => {
  it('scales particle count and caps it', () => {
    expect(particleCountForWidth(390)).toBe(24)
    expect(particleCountForWidth(1024)).toBe(64)
    expect(particleCountForWidth(1920)).toBe(80)
  })

  it('creates the four nodes in order', () => {
    const nodes = createNodePositions(1200, 600)
    expect(nodes.map(n => n.id)).toEqual(['detect', 'reason', 'act', 'notify'])
    expect(nodes.every(n => n.radius > 0)).toBe(true)
  })

  it('hit-tests nodes with a tolerance', () => {
    const nodes = [{ id: 'detect' as const, label: 'Detect', x: 100, y: 100, radius: 40 }]
    expect(hitTestNode(110, 110, nodes)).toBe('detect')
    expect(hitTestNode(300, 300, nodes)).toBeNull()
  })
})
