export interface FlowNode {
  id: 'detect' | 'reason' | 'act' | 'notify'
  label: string
  x: number
  y: number
  radius: number
}

export const FLOW_NODE_LABELS: { id: FlowNode['id']; label: string }[] = [
  { id: 'detect', label: 'Detect' },
  { id: 'reason', label: 'Reason' },
  { id: 'act', label: 'Act' },
  { id: 'notify', label: 'Notify' },
]

export function particleCountForWidth(width: number): number {
  return Math.min(80, Math.max(24, Math.round(width / 16)))
}

export function createNodePositions(width: number, height: number): FlowNode[] {
  const radius = Math.max(28, Math.round(width * 0.03))
  const centerY = height / 2

  return FLOW_NODE_LABELS.map((node, index) => ({
    ...node,
    x: width * [0.15, 0.38, 0.62, 0.85][index],
    y: centerY + (index % 2 === 0 ? -height * 0.05 : height * 0.05),
    radius,
  }))
}

export function hitTestNode(
  x: number,
  y: number,
  nodes: FlowNode[],
  tolerance = 12,
): FlowNode['id'] | null {
  for (const node of nodes) {
    const distance = Math.hypot(x - node.x, y - node.y)
    if (distance <= node.radius + tolerance) {
      return node.id
    }
  }

  return null
}
