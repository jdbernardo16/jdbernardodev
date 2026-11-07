<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { agentMissions } from '~/data/agentLab'
import { useAgentLab } from '~/composables/useAgentLab'

const hydrated = ref(false)

onMounted(() => {
  hydrated.value = true
})

const {
  missionIndex,
  mission,
  selected,
  logs,
  completed,
  addNode,
  removeNode,
  run,
  reset,
  setMission,
} = useAgentLab(agentMissions)

function nodeLabel(id: string): string {
  return mission.value.nodes.find((node) => node.id === id)?.label ?? id
}

function toneClass(tone: string) {
  return {
    'text-bone': tone === 'info',
    'text-terminal': tone === 'success',
    'text-amber': tone === 'warn',
    'text-magenta': tone === 'error',
  }
}
</script>

<template>
  <div
    data-testid="agent-lab"
    :data-hydrated="hydrated"
    class="overflow-hidden rounded-2xl border border-line/60 bg-ink/95 shadow-2xl backdrop-blur"
  >
    <div class="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
      <div class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-magenta/80" aria-hidden="true" />
        <span class="h-2.5 w-2.5 rounded-full bg-amber/80" aria-hidden="true" />
        <span class="h-2.5 w-2.5 rounded-full bg-terminal/80" aria-hidden="true" />
        <span class="ml-2 font-mono text-xs text-muted">~/agent-lab</span>
      </div>
      <span class="font-mono text-xs text-muted">
        mission {{ missionIndex + 1 }}/{{ agentMissions.length }}
      </span>
    </div>

    <div class="flex gap-1 overflow-x-auto border-b border-line/60 px-3 py-2">
      <button
        v-for="(item, index) in agentMissions"
        :key="item.id"
        type="button"
        :data-testid="`mission-${item.id}`"
        :aria-pressed="missionIndex === index"
        class="shrink-0 rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors"
        :class="missionIndex === index ? 'bg-terminal text-ink' : 'text-muted hover:text-bone'"
        @click="setMission(index)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="p-4 md:p-5">
      <p class="font-mono text-xs uppercase tracking-widest text-terminal">mission brief</p>
      <p class="mt-2 text-sm leading-relaxed text-bone">
        {{ mission.brief }}
      </p>

      <div class="mt-4">
        <p class="font-mono text-xs uppercase tracking-widest text-muted">pipeline</p>
        <div class="mt-2 grid grid-cols-4 gap-2">
          <button
            v-for="slot in 4"
            :key="slot"
            type="button"
            :data-testid="`slot-${slot}`"
            class="flex min-h-16 flex-col items-start justify-between rounded-xl border border-line/60 bg-surface/40 p-2 text-left transition-colors hover:border-terminal/60"
            :aria-label="selected[slot - 1] ? `Remove ${nodeLabel(selected[slot - 1]!)}` : `Empty slot ${slot}`"
            @click="selected[slot - 1] ? removeNode(slot - 1) : undefined"
          >
            <span class="font-mono text-xs text-muted">0{{ slot }}</span>
            <span
              class="mt-1 font-mono text-xs leading-tight"
              :class="selected[slot - 1] ? 'text-terminal' : 'text-muted'"
            >
              {{ selected[slot - 1] ? nodeLabel(selected[slot - 1]!) : '+' }}
            </span>
          </button>
        </div>
      </div>

      <div class="mt-4">
        <p class="font-mono text-xs uppercase tracking-widest text-muted">nodes</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="node in mission.nodes"
            :key="node.id"
            type="button"
            :data-testid="`node-${node.id}`"
            :disabled="selected.includes(node.id)"
            class="rounded-lg border border-line/60 bg-surface/30 px-2.5 py-1.5 text-left font-mono text-xs transition-colors hover:border-terminal/60 disabled:cursor-not-allowed disabled:opacity-40"
            @click="addNode(node.id)"
          >
            <span class="text-muted">{{ node.kind }}</span>
            <span class="text-bone"> · {{ node.label }}</span>
          </button>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          data-testid="agent-run"
          class="inline-flex items-center rounded-full bg-terminal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
          @click="run"
        >
          ▶ run agent
        </button>
        <button
          type="button"
          class="inline-flex items-center rounded-full border border-line/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-terminal hover:text-terminal"
          @click="reset"
        >
          reset
        </button>
      </div>

      <div
        class="mt-4 min-h-28 rounded-xl border border-line/60 bg-black/50 p-3 font-mono text-xs leading-relaxed"
        aria-live="polite"
      >
        <p v-if="!logs.length" class="text-muted">$ waiting for input</p>
        <p v-for="(log, index) in logs" :key="`${log.time}-${index}`">
          <span class="text-muted">{{ log.time }}</span>
          <span class="ml-2" :class="toneClass(log.tone)">{{ log.message }}</span>
        </p>
      </div>

      <div
        v-if="completed"
        class="mt-4 rounded-xl border border-terminal/40 bg-terminal/10 p-3"
      >
        <p class="font-mono text-xs uppercase tracking-widest text-terminal">
          mission complete
        </p>
        <NuxtLink
          :to="`/work/${mission.workSlug}`"
          class="mt-2 inline-flex font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:text-terminal"
        >
          Open the case study →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
