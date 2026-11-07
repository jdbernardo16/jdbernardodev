<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AgentMission } from '~/data/agentLab'
import type { AgentLabStatus } from '~/composables/useAgentLab'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{
  mission: AgentMission
  selected: string[]
  status: AgentLabStatus
}>()

const emit = defineEmits<{ select: [id: string] }>()

const container = ref<HTMLDivElement | null>(null)
const reduced = useReducedMotion()
const failed = ref(false)

let THREE: typeof import('three') | undefined
let css2d: typeof import('three/addons/renderers/CSS2DRenderer.js') | undefined

interface NodeObject {
  group: import('three').Group
  mesh: import('three').Mesh
  ring: import('three').Mesh
  label: import('three/addons/renderers/CSS2DRenderer.js').CSS2DObject
  baseY: number
  phase: number
}

let renderer: import('three').WebGLRenderer | undefined
let labelRenderer: import('three/addons/renderers/CSS2DRenderer.js').CSS2DRenderer | undefined
let scene: import('three').Scene | undefined
let camera: import('three').PerspectiveCamera | undefined
let raycaster: import('three').Raycaster | undefined
let line: import('three').Line | undefined
let packet: import('three').Mesh | undefined
let packetCurve: import('three').CatmullRomCurve3 | undefined
let nodes: Record<string, NodeObject> = {}
let frame = 0
let running = false
let time = 0
let packetProgress = 0
let pointer = { x: 0, y: 0 }
let containerEl: HTMLDivElement | undefined
let resizeObserver: ResizeObserver | undefined

function disposeNode(node: NodeObject) {
  scene?.remove(node.group)
  node.group.traverse((child) => {
    if (child instanceof THREE!.Mesh) {
      child.geometry.dispose()
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => material.dispose())
    }
  })
  node.label.element.remove()
}

function rebuildNodes() {
  if (!THREE || !css2d || !scene) return

  for (const node of Object.values(nodes)) disposeNode(node)
  nodes = {}

  const positions: [number, number, number][] = [
    [-3.9, 1.25, 0.2],
    [0, 1.55, -0.6],
    [3.9, 1.25, 0.2],
    [-3.9, -1.15, 0.4],
    [0, -1.45, -0.2],
    [3.9, -1.15, 0.4],
  ]

  for (const [index, node] of props.mission.nodes.entries()) {
    const position = positions[index] ?? [0, 0, 0]
    const selected = props.selected.includes(node.id)
    const color = selected ? 0x7cffb2 : 0xf2efe9

    const group = new THREE.Group()
    group.position.set(...position)

    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: selected ? 0.9 : 0.25,
      metalness: 0.5,
      roughness: 0.35,
    })

    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0), material)
    mesh.userData.nodeId = node.id
    group.add(mesh)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.012, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x7cffb2, transparent: true, opacity: 0.3 }),
    )
    ring.rotation.x = Math.PI / 2.6
    group.add(ring)

    const labelEl = document.createElement('button')
    labelEl.type = 'button'
    labelEl.className = 'pipeline-label'
    labelEl.textContent = node.label
    labelEl.dataset.nodeId = node.id
    labelEl.dataset.selected = String(selected)
    labelEl.addEventListener('click', () => emit('select', node.id))

    const label = new css2d.CSS2DObject(labelEl)
    label.position.set(0, index < 3 ? 0.8 : -0.8, 0)
    group.add(label)

    scene.add(group)
    nodes[node.id] = { group, mesh, ring, label, baseY: position[1], phase: index }
  }

  updateSelection()
}

function updateSelection() {
  if (!THREE || !scene) return

  for (const [id, node] of Object.entries(nodes)) {
    const selected = props.selected.includes(id)
    const material = node.mesh.material as import('three').MeshStandardMaterial
    const color = selected ? 0x7cffb2 : 0xf2efe9
    material.color.setHex(color)
    material.emissive.setHex(color)
    material.emissiveIntensity = selected ? 0.9 : 0.25
    node.label.element.dataset.selected = String(selected)
  }

  if (line) {
    scene.remove(line)
    line.geometry.dispose()
    ;(line.material as import('three').Material).dispose()
    line = undefined
  }

  const points = props.selected
    .map((id) => nodes[id]?.group.position)
    .filter((point): point is import('three').Vector3 => Boolean(point))

  if (points.length >= 2) {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => point.clone()))
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60))
    line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x7cffb2, transparent: true, opacity: 0.7 }),
    )
    scene.add(line)
    packetCurve = curve

    if (!packet) {
      packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x7cffb2 }),
      )
      scene.add(packet)
    }

    packet.visible = props.status === 'success'
    if (props.status === 'success') packetProgress = 0
  } else {
    packetCurve = undefined
    if (packet) packet.visible = false
  }
}

function animate() {
  if (!running || !THREE || !scene || !camera || !renderer || !labelRenderer) return

  time += 0.016

  for (const [id, node] of Object.entries(nodes)) {
    node.group.position.y = node.baseY + Math.sin(time * 1.2 + node.phase) * 0.06
    node.ring.rotation.z += 0.004
    node.ring.rotation.y += 0.006

    if (props.selected.includes(id)) {
      const material = node.mesh.material as import('three').MeshStandardMaterial
      material.emissiveIntensity = 1.1 + Math.sin(time * 4) * 0.25
    }
  }

  if (packet && packetCurve && props.status === 'success') {
    packetProgress = Math.min(1, packetProgress + 0.008)
    packet.position.copy(packetCurve.getPointAt(packetProgress))
    packet.visible = true
    if (packetProgress >= 1) packetProgress = 0
  } else if (packet) {
    packet.visible = false
  }

  camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04
  camera.position.y += (4.2 + pointer.y * 0.5 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
  frame = window.requestAnimationFrame(animate)
}

function handlePointerMove(event: PointerEvent) {
  if (!containerEl) return
  const rect = containerEl.getBoundingClientRect()
  pointer = {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
  }
}

function handleClick(event: MouseEvent) {
  if (!THREE || !raycaster || !camera || !containerEl) return
  const rect = containerEl.getBoundingClientRect()
  const pointerCoords = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -(((event.clientY - rect.top) / rect.height) * 2 - 1),
  )

  raycaster.setFromCamera(pointerCoords, camera)
  const intersecting = raycaster.intersectObjects(
    Object.values(nodes).map((node) => node.mesh),
    false,
  )
  const nodeId = intersecting[0]?.object.userData.nodeId as string | undefined
  if (nodeId) emit('select', nodeId)
}

function resize() {
  if (!containerEl || !camera || !renderer || !labelRenderer) return
  const width = containerEl.clientWidth
  const height = containerEl.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  labelRenderer.setSize(width, height)
}

async function init() {
  if (!container.value || reduced.value || typeof window === 'undefined') return
  if (!window.matchMedia('(min-width: 768px)').matches) return

  const probe = document.createElement('canvas')
  const context = probe.getContext('webgl2') ?? probe.getContext('webgl')
  if (!context) {
    failed.value = true
    return
  }

  try {
    THREE = await import('three')
    css2d = await import('three/addons/renderers/CSS2DRenderer.js')
  } catch {
    failed.value = true
    return
  }

  const el = container.value as unknown as HTMLDivElement
  containerEl = el
  const width = el.clientWidth
  const height = el.clientHeight

  if (!width || !height) return

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    failed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height)
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.inset = '0'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  el.appendChild(renderer.domElement)

  labelRenderer = new css2d.CSS2DRenderer()
  labelRenderer.setSize(width, height)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.inset = '0'
  labelRenderer.domElement.style.pointerEvents = 'none'
  el.appendChild(labelRenderer.domElement)

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x08090b, 0.045)

  camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
  camera.position.set(0, 4.2, 9)
  camera.lookAt(0, 0, 0)

  scene.add(new THREE.AmbientLight(0x7cffb2, 0.7))
  const key = new THREE.DirectionalLight(0xf2efe9, 1.2)
  key.position.set(4, 8, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0x7cffb2, 2, 20)
  rim.position.set(-5, 2, 4)
  scene.add(rim)

  const grid = new THREE.GridHelper(24, 24, 0x1c3b2c, 0x10231b)
  grid.position.y = -2.4
  const gridMaterial = grid.material as import('three').Material
  gridMaterial.transparent = true
  gridMaterial.opacity = 0.55
  scene.add(grid)

  raycaster = new THREE.Raycaster()
  renderer.domElement.addEventListener('pointermove', handlePointerMove)
  renderer.domElement.addEventListener('click', handleClick)

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(el)

  rebuildNodes()
  running = true
  frame = window.requestAnimationFrame(animate)
}

function cleanup() {
  running = false
  window.cancelAnimationFrame(frame)
  resizeObserver?.disconnect()

  if (renderer) {
    renderer.domElement.removeEventListener('pointermove', handlePointerMove)
    renderer.domElement.removeEventListener('click', handleClick)
    renderer.domElement.remove()
    renderer.dispose()
    renderer = undefined
  }

  if (labelRenderer) {
    labelRenderer.domElement.remove()
    labelRenderer = undefined
  }

  for (const node of Object.values(nodes)) disposeNode(node)
  nodes = {}

  if (line) {
    line.geometry.dispose()
    ;(line.material as import('three').Material).dispose()
    line = undefined
  }

  if (packet) {
    packet.geometry.dispose()
    ;(packet.material as import('three').Material).dispose()
    packet = undefined
  }
}

onMounted(init)
onBeforeUnmount(cleanup)

watch(() => props.selected, updateSelection, { deep: true })
watch(() => props.status, updateSelection)
watch(
  () => props.mission.id,
  () => rebuildNodes(),
)
</script>

<template>
  <div class="relative hidden h-64 overflow-hidden border-b border-line/60 bg-black/30 md:block">
    <div ref="container" class="absolute inset-0" />

    <div
      v-if="failed"
      class="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs text-muted"
    >
      3D view unavailable — use the pipeline controls below.
    </div>

    <div
      class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3 font-mono text-xs uppercase tracking-widest text-muted"
    >
      <span>pipeline visualizer</span>
      <span>click a node</span>
    </div>
  </div>
</template>
