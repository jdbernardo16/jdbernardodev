import { describe, it, expect } from 'vitest'
import { ambientNodeCount, shouldAnimateAmbient } from '../../app/utils/ambient'

describe('ambient graph', () => {
  it('scales nodes and caps them', () => {
    expect(ambientNodeCount(390)).toBe(18)
    expect(ambientNodeCount(1440)).toBe(48)
  })

  it('disables animation for reduced motion and hidden tabs', () => {
    expect(shouldAnimateAmbient({ reduced: true, hidden: false, intersecting: true })).toBe(false)
    expect(shouldAnimateAmbient({ reduced: false, hidden: true, intersecting: true })).toBe(false)
    expect(shouldAnimateAmbient({ reduced: false, hidden: false, intersecting: false })).toBe(false)
    expect(shouldAnimateAmbient({ reduced: false, hidden: false, intersecting: true })).toBe(true)
  })
})
