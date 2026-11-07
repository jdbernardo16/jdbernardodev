<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ambientNodeCount, shouldAnimateAmbient } from '~/utils/ambient'
import { useReducedMotion } from '~/composables/useReducedMotion'

interface AmbientNode {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const reduced = useReducedMotion()

let context: CanvasRenderingContext2D | null = null
let nodes: AmbientNode[] = []
let width = 0
let height = 0
let frame = 0
let running = false
let hidden = false
let pointer = { x: -9999, y: -9999 }

function resize() {
  if (!canvas.value) return

  width = window.innerWidth
  height = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.value.width = Math.round(width * dpr)
  canvas.value.height = Math.round(height * dpr)

  context = canvas.value.getContext('2d')
  context?.setTransform(dpr, 0, 0, dpr, 0, 0)

  const count = ambientNodeCount(width)
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    size: Math.random() * 1.8 + 0.8,
  }))

  draw()
}

function drawGrid() {
  if (!context) return
  context.strokeStyle = 'rgba(124, 255, 178, 0.045)'
  context.lineWidth = 1

  for (let x = 0; x < width; x += 80) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }

  for (let y = 0; y < height; y += 80) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
}

function draw() {
  if (!context) return

  context.clearRect(0, 0, width, height)
  drawGrid()

  for (const node of nodes) {
    context.beginPath()
    context.arc(node.x, node.y, node.size, 0, Math.PI * 2)
    context.fillStyle = 'rgba(124, 255, 178, 0.28)'
    context.fill()
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i]!
      const b = nodes[j]!
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distance > 150) continue

      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.strokeStyle = `rgba(124, 255, 178, ${0.08 * (1 - distance / 150)})`
      context.lineWidth = 1
      context.stroke()
    }
  }
}

function move() {
  for (const node of nodes) {
    node.x += node.vx
    node.y += node.vy

    if (node.x < 0 || node.x > width) node.vx *= -1
    if (node.y < 0 || node.y > height) node.vy *= -1

    const dx = node.x - pointer.x
    const dy = node.y - pointer.y
    const distance = Math.hypot(dx, dy)

    if (distance < 140 && distance > 0.001) {
      const force = (140 - distance) / 140
      node.x += (dx / distance) * force * 0.5
      node.y += (dy / distance) * force * 0.5
    }
  }
}

function loop() {
  if (!running) return
  move()
  draw()
  frame = window.requestAnimationFrame(loop)
}

function start() {
  if (running) return
  if (!shouldAnimateAmbient({ reduced: reduced.value, hidden, intersecting: true })) return
  running = true
  frame = window.requestAnimationFrame(loop)
}

function stop() {
  running = false
  window.cancelAnimationFrame(frame)
}

function handlePointerMove(event: PointerEvent) {
  pointer = { x: event.clientX, y: event.clientY }
}

function handleVisibility() {
  hidden = document.visibilityState === 'hidden'
  if (hidden) stop()
  else start()
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
  start()
})

watch(reduced, (value) => {
  if (value) {
    stop()
    draw()
  } else {
    start()
  }
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<template>
  <canvas
    ref="canvas"
    data-testid="ambient-graph"
    class="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50"
    aria-hidden="true"
  />
</template>
