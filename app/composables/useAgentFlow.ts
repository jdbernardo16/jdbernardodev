import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import {
  createNodePositions,
  hitTestNode,
  particleCountForWidth,
  type FlowNode,
} from '~/utils/agent-flow'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export interface UseAgentFlowOptions {
  canvas: Ref<HTMLCanvasElement | null>
  reducedMotion: Ref<boolean>
  onSelect?: (id: FlowNode['id']) => void
}

export function useAgentFlow(options: UseAgentFlowOptions) {
  const activeNode = ref<FlowNode['id'] | null>(null)

  let frame = 0
  let running = false
  let width = 0
  let height = 0
  let dpr = 1
  let nodes: FlowNode[] = []
  let particles: Particle[] = []
  let pointer = { x: -9999, y: -9999 }
  let resizeObserver: ResizeObserver | undefined
  let intersectionObserver: IntersectionObserver | undefined
  let isVisible = true

  function seedParticles() {
    const count = particleCountForWidth(width)
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.6 + 0.6,
    }))
  }

  function resize() {
    const canvas = options.canvas.value
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)

    const context = canvas.getContext('2d')
    if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0)

    nodes = createNodePositions(width, height)
    seedParticles()
  }

  function moveParticles() {
    for (const particle of particles) {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      const dx = particle.x - pointer.x
      const dy = particle.y - pointer.y
      const distance = Math.hypot(dx, dy)

      if (distance < 90 && distance > 0.001) {
        const force = (90 - distance) / 90
        particle.x += (dx / distance) * force * 1.4
        particle.y += (dy / distance) * force * 1.4
      }
    }
  }

  function draw() {
    const canvas = options.canvas.value
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    context.clearRect(0, 0, width, height)

    for (let index = 0; index < nodes.length - 1; index += 1) {
      const start = nodes[index]!
      const end = nodes[index + 1]!
      context.beginPath()
      context.moveTo(start.x, start.y)
      context.lineTo(end.x, end.y)
      context.strokeStyle = 'rgba(255, 184, 77, 0.18)'
      context.lineWidth = 1
      context.stroke()
    }

    for (const particle of particles) {
      context.beginPath()
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      context.fillStyle = 'rgba(242, 239, 233, 0.32)'
      context.fill()
    }

    for (const node of nodes) {
      const isActive = activeNode.value === node.id
      context.beginPath()
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      context.fillStyle = isActive ? 'rgba(255, 184, 77, 0.16)' : 'rgba(242, 239, 233, 0.04)'
      context.fill()
      context.strokeStyle = isActive ? 'rgba(255, 184, 77, 0.9)' : 'rgba(242, 239, 233, 0.22)'
      context.lineWidth = isActive ? 1.5 : 1
      context.stroke()

      context.fillStyle = isActive ? '#ffb84d' : '#f2efe9'
      context.font = '600 11px "JetBrains Mono", monospace'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(node.label.toUpperCase(), node.x, node.y)
    }
  }

  function loop() {
    if (!running) return
    moveParticles()
    draw()
    frame = window.requestAnimationFrame(loop)
  }

  function start() {
    if (running || options.reducedMotion.value || !isVisible) return
    running = true
    frame = window.requestAnimationFrame(loop)
  }

  function stop() {
    running = false
    window.cancelAnimationFrame(frame)
  }

  function updatePointer(event: PointerEvent) {
    const canvas = options.canvas.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    activeNode.value = hitTestNode(pointer.x, pointer.y, nodes)
  }

  function clearPointer() {
    pointer = { x: -9999, y: -9999 }
    activeNode.value = null
  }

  function selectNode(event: MouseEvent) {
    const canvas = options.canvas.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const id = hitTestNode(event.clientX - rect.left, event.clientY - rect.top, nodes)
    if (id) options.onSelect?.(id)
  }

  function handleVisibility() {
    isVisible = document.visibilityState === 'visible'
    if (isVisible) start()
    else stop()
  }

  onMounted(() => {
    const canvas = options.canvas.value
    if (!canvas) return

    resize()
    canvas.addEventListener('pointermove', updatePointer)
    canvas.addEventListener('pointerleave', clearPointer)
    canvas.addEventListener('click', selectNode)
    document.addEventListener('visibilitychange', handleVisibility)

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)
    }

    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible = Boolean(entry?.isIntersecting)
        if (isVisible) start()
        else stop()
      })
      intersectionObserver.observe(canvas)
    }

    start()
  })

  watch(options.reducedMotion, (reduced) => {
    if (reduced) {
      stop()
      clearPointer()
    } else {
      start()
    }
  })

  onBeforeUnmount(() => {
    stop()
    const canvas = options.canvas.value
    canvas?.removeEventListener('pointermove', updatePointer)
    canvas?.removeEventListener('pointerleave', clearPointer)
    canvas?.removeEventListener('click', selectNode)
    document.removeEventListener('visibilitychange', handleVisibility)
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
  })

  return { activeNode, start, stop }
}
