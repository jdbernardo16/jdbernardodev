<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{
  href?: string
  as?: string
}>()

const element = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
const tag = computed(() => props.as ?? (props.href ? 'a' : 'button'))

function handlePointerMove(event: PointerEvent) {
  if (reduced.value || !element.value || typeof window === 'undefined') return
  if (!window.matchMedia('(pointer: fine)').matches) return

  const rect = element.value.getBoundingClientRect()
  const x = event.clientX - rect.left - rect.width / 2
  const y = event.clientY - rect.top - rect.height / 2

  element.value.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`
}

function reset() {
  if (element.value) element.value.style.transform = ''
}
</script>

<template>
  <component
    :is="tag"
    ref="element"
    :href="href"
    data-magnetic
    @pointermove="handlePointerMove"
    @pointerleave="reset"
  >
    <slot />
  </component>
</template>
