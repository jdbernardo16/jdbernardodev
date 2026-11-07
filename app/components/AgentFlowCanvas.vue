<script setup lang="ts">
import { computed, ref } from 'vue'
import { FLOW_NODE_LABELS, type FlowNode } from '~/utils/agent-flow'
import { useReducedMotion } from '~/composables/useReducedMotion'
import { useAgentFlow } from '~/composables/useAgentFlow'

const props = defineProps<{ reducedMotion?: boolean }>()
const emit = defineEmits<{ select: [id: FlowNode['id']] }>()

const canvas = ref<HTMLCanvasElement | null>(null)
const prefersReducedMotion = useReducedMotion()
const isStatic = computed(() => props.reducedMotion ?? prefersReducedMotion.value)

useAgentFlow({
  canvas: canvas as unknown as import('vue').Ref<HTMLCanvasElement | null>,
  reducedMotion: isStatic,
  onSelect: (id) => emit('select', id),
})
</script>

<template>
  <div class="relative">
    <canvas
      v-if="!isStatic"
      ref="canvas"
      data-testid="agent-flow"
      class="h-80 w-full rounded-2xl border border-line/60 bg-surface/40"
      aria-hidden="true"
    />

    <ol
      v-else
      data-testid="agent-flow-static"
      class="grid grid-cols-2 gap-3"
    >
      <li
        v-for="(node, index) in FLOW_NODE_LABELS"
        :key="node.id"
        class="rounded-xl border border-line/60 bg-surface/40 p-4"
      >
        <span class="font-mono text-xs text-terminal">0{{ index + 1 }}</span>
        <span class="mt-2 block font-display text-xl text-bone">{{ node.label }}</span>
      </li>
    </ol>

    <p class="sr-only">
      Agent loop: Detect, Reason, Act, Notify. Select a step to jump to the related section.
    </p>
  </div>
</template>
