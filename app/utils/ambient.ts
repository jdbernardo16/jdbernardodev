export interface AmbientState {
  reduced: boolean
  hidden: boolean
  intersecting: boolean
}

export function ambientNodeCount(width: number): number {
  return Math.min(48, Math.max(18, Math.round(width / 30)))
}

export function shouldAnimateAmbient(state: AmbientState): boolean {
  return !state.reduced && !state.hidden && state.intersecting
}
