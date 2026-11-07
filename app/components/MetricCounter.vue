<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{
  value: string
  label: string
  estimate?: boolean
}>()

const element = ref<HTMLElement | null>(null)
const display = ref(props.value)
const reduced = useReducedMotion()

const match = computed(() => props.value.match(/^(\d+(?:\.\d+)?)(.*)$/))
const target = computed(() => (match.value ? Number(match.value[1]) : Number.NaN))
const suffix = computed(() => match.value?.[2] ?? '')

function animate() {
  const end = target.value
  if (Number.isNaN(end)) return

  const start = performance.now()
  const duration = 700

  function tick(now: number) {
    const progress = Math.min(1, (now - start) / duration)
    const current = Math.round(end * progress)
    display.value = `${current}${suffix.value}`

    if (progress < 1) {
      window.requestAnimationFrame(tick)
    } else {
      display.value = props.value
    }
  }

  window.requestAnimationFrame(tick)
}

onMounted(() => {
  if (reduced.value || Number.isNaN(target.value) || !element.value) return
  if (typeof IntersectionObserver === 'undefined') return

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting) return
    observer.disconnect()
    window.setTimeout(animate, 100)
  })

  observer.observe(element.value as unknown as Element)
})
</script>

<template>
  <div ref="element">
    <p class="font-display text-5xl text-terminal">{{ display }}</p>
    <p class="mt-2 text-sm leading-relaxed text-muted">
      {{ label }}
      <span v-if="estimate" class="mt-1 block font-mono text-xs uppercase tracking-widest text-muted">
        estimate
      </span>
    </p>
  </div>
</template>
