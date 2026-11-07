<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSnakeGame, type Direction } from '~/composables/useSnakeGame'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{ reducedMotion?: boolean }>()

const prefersReducedMotion = useReducedMotion()
const reduced = computed(
  () => props.reducedMotion === true || prefersReducedMotion.value,
)

const hydrated = ref(false)
const failed = ref(false)
const stage = ref<HTMLDivElement | null>(null)
const canvasHost = ref<HTMLDivElement | null>(null)
const lastEvent = ref('collect data nodes')

const {
  gridSize,
  status,
  snake,
  food,
  bugs,
  direction,
  score,
  best,
  speed,
  length,
  start,
  turn,
  tick,
  pause,
  resume,
} = useSnakeGame()

const CELL = 1.2

let THREE: typeof import('three') | undefined
let renderer: import('three').WebGLRenderer | undefined
let scene: import('three').Scene | undefined
let camera: import('three').PerspectiveCamera | undefined
let headMaterial: import('three').MeshStandardMaterial | undefined
let bodyMaterial: import('three').MeshStandardMaterial | undefined
let snakeMeshes: import('three').Mesh[] = []
let foodMesh: import('three').Mesh | undefined
let bugMeshes: import('three').Mesh[] = []
let frame = 0
let tickTimer: ReturnType<typeof setTimeout> | undefined
let resizeObserver: ResizeObserver | undefined
let running = false

function cellToWorld(cell: { x: number; y: number }, height = 0.35): import('three').Vector3 {
  const offset = (gridSize - 1) / 2
  return new THREE!.Vector3((cell.x - offset) * CELL, height, (cell.y - offset) * CELL)
}

function syncScene() {
  if (!THREE || !scene) return

  snakeMeshes.forEach((mesh, index) => {
    const segment = snake.value[index]
    if (!segment) {
      mesh.visible = false
      return
    }

    mesh.visible = true
    mesh.position.copy(cellToWorld(segment))
    mesh.material = index === 0 ? headMaterial! : bodyMaterial!
  })

  if (foodMesh) {
    foodMesh.position.copy(cellToWorld(food.value, 0.45))
    foodMesh.visible = true
  }

  bugMeshes.forEach((mesh, index) => {
    const bug = bugs.value[index]
    mesh.visible = Boolean(bug)
    if (bug) mesh.position.copy(cellToWorld(bug, 0.4))
  })
}

function animate(time = 0) {
  if (!running || !THREE || !renderer || !scene || !camera) return

  if (foodMesh) {
    foodMesh.rotation.y += 0.02
    foodMesh.rotation.x += 0.01
    foodMesh.position.y = 0.45 + Math.sin(time * 0.002) * 0.08
  }

  bugMeshes.forEach((mesh, index) => {
    if (!mesh.visible) return
    mesh.rotation.y += 0.03
    mesh.position.y = 0.4 + Math.sin(time * 0.003 + index) * 0.06
  })

  renderer.render(scene, camera)
  frame = window.requestAnimationFrame(animate)
}

function resize() {
  if (!canvasHost.value || !camera || !renderer) return
  const width = canvasHost.value.clientWidth
  const height = canvasHost.value.clientHeight
  if (!width || !height) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

async function initThree(): Promise<boolean> {
  if (THREE) return true
  if (!canvasHost.value || reduced.value) return false

  const width = canvasHost.value.clientWidth
  const height = canvasHost.value.clientHeight
  if (!width || !height) return false

  const probe = document.createElement('canvas')
  const context = probe.getContext('webgl2') ?? probe.getContext('webgl')
  if (!context) {
    failed.value = true
    return false
  }

  try {
    THREE = await import('three')
  } catch {
    failed.value = true
    return false
  }

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    failed.value = true
    return false
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height)
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.inset = '0'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.dataset.testid = 'data-stream-canvas'
  canvasHost.value.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x08090b, 0.035)

  camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
  camera.position.set(8, 10, 8)
  camera.lookAt(0, 0, 0)

  scene.add(new THREE.AmbientLight(0x7cffb2, 0.7))
  const key = new THREE.DirectionalLight(0xf2efe9, 1.3)
  key.position.set(6, 10, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0x22d3ee, 2, 30)
  rim.position.set(-6, 4, -4)
  scene.add(rim)

  const size = gridSize * CELL
  const grid = new THREE.GridHelper(size, gridSize, 0x2f6b52, 0x17352a)
  const gridMaterial = grid.material as import('three').Material
  gridMaterial.transparent = true
  gridMaterial.opacity = 0.85
  scene.add(grid)

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({ color: 0x0b0c0e, metalness: 0.2, roughness: 0.8 }),
  )
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -0.02
  scene.add(plane)

  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(size, 0.15, size)),
    new THREE.LineBasicMaterial({ color: 0x7cffb2, transparent: true, opacity: 0.22 }),
  )
  border.position.y = -0.05
  scene.add(border)

  headMaterial = new THREE.MeshStandardMaterial({
    color: 0x7cffb2,
    emissive: 0x7cffb2,
    emissiveIntensity: 1.4,
    metalness: 0.4,
    roughness: 0.3,
  })
  bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c7a57,
    emissive: 0x1f6b4a,
    emissiveIntensity: 0.7,
    metalness: 0.4,
    roughness: 0.4,
  })

  const segmentGeometry = new THREE.BoxGeometry(0.85, 0.4, 0.85)
  for (let index = 0; index < 100; index += 1) {
    const mesh = new THREE.Mesh(segmentGeometry, bodyMaterial)
    mesh.visible = false
    scene.add(mesh)
    snakeMeshes.push(mesh)
  }

  foodMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.6,
      metalness: 0.5,
      roughness: 0.2,
    }),
  )
  foodMesh.add(new THREE.PointLight(0x22d3ee, 2, 5))
  scene.add(foodMesh)

  const bugGeometry = new THREE.OctahedronGeometry(0.3, 0)
  const bugMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4d6d,
    emissive: 0xff4d6d,
    emissiveIntensity: 1.2,
    metalness: 0.3,
    roughness: 0.4,
  })
  for (let index = 0; index < 4; index += 1) {
    const mesh = new THREE.Mesh(bugGeometry, bugMaterial)
    mesh.visible = false
    scene.add(mesh)
    bugMeshes.push(mesh)
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvasHost.value as unknown as Element)

  running = true
  frame = window.requestAnimationFrame(animate)
  syncScene()
  return true
}

function scheduleTick() {
  if (tickTimer) clearTimeout(tickTimer)
  if (status.value !== 'playing') return

  tickTimer = setTimeout(() => {
    tick()
    syncScene()

    if (status.value === 'playing') {
      scheduleTick()
    } else if (status.value === 'over') {
      lastEvent.value = `build failed — ${score.value} data collected`
    }
  }, speed.value)
}

async function startGame() {
  if (reduced.value) return

  const ready = await initThree()
  if (!ready) return

  start()
  syncScene()
  lastEvent.value = 'press an arrow / WASD to move'
}

function turnDirection(nextDirection: Direction) {
  turn(nextDirection)
  if (status.value === 'playing' && !tickTimer) {
    lastEvent.value = 'packet moving — collect data'
    scheduleTick()
  }
}

function pauseGame() {
  if (status.value !== 'playing') return
  pause()
  if (tickTimer) clearTimeout(tickTimer)
  lastEvent.value = 'build paused'
}

function resumeGame() {
  if (status.value !== 'paused') return
  resume()
  lastEvent.value = 'build resumed'
  scheduleTick()
}

function handleKeydown(event: KeyboardEvent) {
  const directions: Record<string, Direction> = {
    ArrowUp: 'up',
    w: 'up',
    W: 'up',
    ArrowDown: 'down',
    s: 'down',
    S: 'down',
    ArrowLeft: 'left',
    a: 'left',
    A: 'left',
    ArrowRight: 'right',
    d: 'right',
    D: 'right',
  }

  const nextDirection = directions[event.key]
  if (nextDirection && (status.value === 'playing' || status.value === 'ready')) {
    event.preventDefault()
    turnDirection(nextDirection)
    return
  }

  if (event.key === ' ' && (status.value === 'playing' || status.value === 'paused')) {
    event.preventDefault()
    if (status.value === 'playing') pauseGame()
    else resumeGame()
    return
  }

  if (event.key === 'Escape' && status.value === 'playing') {
    event.preventDefault()
    pauseGame()
  }
}

function handlePointerMove(event: PointerEvent) {
  if (!camera || !stage.value) return
  const rect = stage.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  camera.position.x += (8 + x * 0.8 - camera.position.x) * 0.05
  camera.position.y += (10 - y * 0.5 - camera.position.y) * 0.05
  camera.lookAt(0, 0, 0)
}

function handleVisibility() {
  if (document.visibilityState === 'hidden') pauseGame()
}

function cleanup() {
  running = false
  window.cancelAnimationFrame(frame)
  if (tickTimer) clearTimeout(tickTimer)
  resizeObserver?.disconnect()
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('visibilitychange', handleVisibility)
  stage.value?.removeEventListener('pointermove', handlePointerMove)

  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
    renderer = undefined
  }

  if (scene && THREE) {
    scene.traverse((object) => {
      if (object instanceof THREE!.Mesh || object instanceof THREE!.Line) {
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      }
    })
  }

  snakeMeshes = []
  bugMeshes = []
  foodMesh = undefined
  scene = undefined
  camera = undefined
  THREE = undefined
}

onMounted(() => {
  hydrated.value = true
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('visibilitychange', handleVisibility)
  stage.value?.addEventListener('pointermove', handlePointerMove)
})

onBeforeUnmount(cleanup)
</script>

<template>
  <div
    data-testid="data-stream"
    :data-hydrated="hydrated"
    :data-status="status"
    :data-direction="direction"
    class="overflow-hidden rounded-2xl border border-line/60 bg-ink/95 shadow-2xl backdrop-blur"
  >
    <div class="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
      <div class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-magenta/80" aria-hidden="true" />
        <span class="h-2.5 w-2.5 rounded-full bg-amber/80" aria-hidden="true" />
        <span class="h-2.5 w-2.5 rounded-full bg-terminal/80" aria-hidden="true" />
        <span class="ml-2 font-mono text-xs text-muted">~/data-stream</span>
      </div>
      <span class="font-mono text-xs text-muted">
        {{ status === 'playing' ? 'packet running' : status === 'ready' ? 'ready — press a key' : status === 'paused' ? 'paused' : status === 'over' ? 'game over' : 'ready' }}
      </span>
    </div>

    <div v-if="reduced" class="p-6">
      <p class="font-mono text-xs uppercase tracking-widest text-terminal">reduced motion</p>
      <p class="mt-3 font-display text-3xl text-bone">Data Stream is paused.</p>
      <p class="mt-2 text-sm leading-relaxed text-muted">
        The game is optional. Same developer craft, no moving targets — jump straight to the
        work or start a project.
      </p>
      <a
        href="#contact"
        class="mt-5 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
      >
        Start a project
      </a>
    </div>

    <template v-else>
      <div class="grid grid-cols-3 gap-2 border-b border-line/60 px-3 py-2 font-mono text-xs uppercase tracking-widest">
        <div>
          <span class="text-muted">score</span>
          <span data-testid="data-stream-score" class="ml-1 text-terminal">{{ score }}</span>
        </div>
        <div>
          <span class="text-muted">best</span>
          <span class="ml-1 text-bone">{{ best }}</span>
        </div>
        <div class="text-right">
          <span class="text-muted">data</span>
          <span class="ml-1 text-cyan">{{ score }}</span>
          <span class="ml-2 text-muted">len</span>
          <span class="ml-1 text-bone">{{ length }}</span>
        </div>
      </div>

      <div ref="stage" class="relative h-80 overflow-hidden bg-black/40 md:h-96">
        <div ref="canvasHost" class="absolute inset-0" />

        <div
          v-if="status === 'idle' && !failed"
          class="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-ink/45 p-6 text-center"
        >
          <div class="data-grid-preview absolute inset-0 opacity-50" aria-hidden="true" />
          <div class="relative">
            <p class="font-mono text-xs uppercase tracking-widest text-terminal">$ run data-stream</p>
            <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Collect data nodes. Avoid the red bugs. Don't hit the wall.
            </p>
            <button
              type="button"
              data-testid="data-stream-start"
              class="mt-5 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
              @click="startGame"
            >
              ▶ run data-stream
            </button>
            <p class="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
              arrows / wasd · space to pause
            </p>
          </div>
        </div>

        <div
          v-if="status === 'ready'"
          class="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center"
        >
          <p class="rounded-full border border-terminal/40 bg-ink/85 px-4 py-2 font-mono text-xs uppercase tracking-widest text-terminal">
            press an arrow / WASD to move
          </p>
        </div>

        <div
          v-if="status === 'paused'"
          class="absolute inset-0 flex flex-col items-center justify-center bg-ink/85 p-6 text-center backdrop-blur-sm"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-amber">build paused</p>
          <p class="mt-2 font-display text-4xl text-bone">Data Stream</p>
          <button
            type="button"
            class="mt-4 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
            @click="resumeGame"
          >
            resume
          </button>
        </div>

        <div
          v-if="status === 'over'"
          class="absolute inset-0 flex flex-col items-center justify-center bg-ink/85 p-6 text-center backdrop-blur-sm"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-magenta">game over</p>
          <p class="mt-2 font-display text-4xl text-bone">{{ score }} data collected</p>
          <p class="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
            best {{ best }} · length {{ length }}
          </p>
          <button
            type="button"
            data-testid="data-stream-start"
            class="mt-4 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
            @click="startGame"
          >
            run again
          </button>
          <a
            href="#contact"
            class="mt-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
          >
            start a project →
          </a>
        </div>

        <div
          v-if="failed"
          class="absolute inset-0 flex flex-col items-center justify-center bg-ink/90 p-6 text-center"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-amber">3D unavailable</p>
          <p class="mt-2 max-w-sm text-sm text-muted">
            This browser could not start WebGL. The rest of the site works fine — use the
            contact link to start a project.
          </p>
          <a
            href="#contact"
            class="mt-4 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
          >
            start a project
          </a>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-line/60 p-3">
        <div class="grid grid-cols-3 gap-1">
          <span />
          <button
            type="button"
            data-testid="turn-up"
            :disabled="status !== 'playing' && status !== 'ready'"
            aria-label="Move up"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-line/60 font-mono text-sm text-bone transition-colors hover:border-terminal hover:text-terminal disabled:opacity-30"
            @click="turnDirection('up')"
          >
            ↑
          </button>
          <span />
          <button
            type="button"
            data-testid="turn-left"
            :disabled="status !== 'playing' && status !== 'ready'"
            aria-label="Move left"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-line/60 font-mono text-sm text-bone transition-colors hover:border-terminal hover:text-terminal disabled:opacity-30"
            @click="turnDirection('left')"
          >
            ←
          </button>
          <button
            type="button"
            data-testid="turn-down"
            :disabled="status !== 'playing' && status !== 'ready'"
            aria-label="Move down"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-line/60 font-mono text-sm text-bone transition-colors hover:border-terminal hover:text-terminal disabled:opacity-30"
            @click="turnDirection('down')"
          >
            ↓
          </button>
          <button
            type="button"
            data-testid="turn-right"
            :disabled="status !== 'playing' && status !== 'ready'"
            aria-label="Move right"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-line/60 font-mono text-sm text-bone transition-colors hover:border-terminal hover:text-terminal disabled:opacity-30"
            @click="turnDirection('right')"
          >
            →
          </button>
        </div>

        <p class="font-mono text-xs text-muted" aria-live="polite">
          {{ lastEvent }}
        </p>
      </div>
    </template>
  </div>
</template>
