<script setup lang="ts">
import { computed } from 'vue'
import type { WorkStudy } from '~/types/content'
import { useAgentConsole } from '~/composables/useAgentConsole'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{
  studies: WorkStudy[]
  reducedMotion?: boolean
}>()

const prefersReducedMotion = useReducedMotion()
const reduced = computed(() => props.reducedMotion ?? prefersReducedMotion.value)

const { activeSlug, isPlaying, speed, visibleLines, setStudy, toggle, setSpeed } = useAgentConsole(
  props.studies,
  {
    reducedMotion: reduced,
    autoStart: import.meta.client,
  },
)

const activeStudy = computed(
  () => props.studies.find((study) => study.slug === activeSlug.value) ?? props.studies[0],
)
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-line/60 bg-ink">
    <div class="flex flex-wrap gap-2 border-b border-line/60 p-3">
      <button
        v-for="study in studies"
        :key="study.slug"
        type="button"
        :data-testid="`console-tab-${study.slug}`"
        class="rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors"
        :class="activeSlug === study.slug ? 'bg-amber text-ink' : 'text-muted hover:text-bone'"
        @click="setStudy(study.slug)"
      >
        {{ study.clientType }}
      </button>
    </div>

    <div class="p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="font-mono text-xs uppercase tracking-widest text-muted">
          Sample agent run — synthetic events.
        </p>

        <div v-if="!reduced" class="flex items-center gap-2">
          <button
            type="button"
            data-testid="console-play"
            class="rounded-full border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:border-amber hover:text-amber"
            @click="toggle"
          >
            {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
          <button
            type="button"
            class="rounded-full border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:border-amber hover:text-amber"
            @click="setSpeed(speed === 1 ? 2 : 1)"
          >
            {{ speed }}x
          </button>
        </div>
      </div>

      <div class="mt-5 min-h-28 space-y-2 font-mono text-xs leading-relaxed" aria-live="off">
        <p
          v-for="(line, index) in visibleLines"
          :key="`${activeSlug}-${index}`"
          data-testid="console-line"
        >
          <span class="text-muted">{{ line.time }}</span>
          <span
            class="ml-3"
            :class="{
              'text-terminal': line.tone === 'success',
              'text-amber': line.tone === 'warn',
              'text-bone': line.tone === 'info',
            }"
          >
            {{ line.message }}
          </span>
        </p>
      </div>

      <a
        v-if="activeStudy"
        :href="`/work/${activeStudy.slug}`"
        class="mt-5 inline-flex font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:text-amber"
      >
        Open the case study →
      </a>
    </div>
  </div>
</template>
