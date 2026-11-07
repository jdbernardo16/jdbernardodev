<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { bugSmashCells } from '~/data/bugSmash'
import { useBugSmash } from '~/composables/useBugSmash'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps<{ reducedMotion?: boolean }>()

const prefersReducedMotion = useReducedMotion()
const reduced = computed(
  () => props.reducedMotion === true || prefersReducedMotion.value,
)

const hydrated = ref(false)

const { status, score, combo, best, lives, timeLeft, active, squashed, lastEvent, start, squash } =
  useBugSmash({ cellNames: bugSmashCells.map((cell) => cell.name) })

function handleKeydown(event: KeyboardEvent) {
  if (status.value !== 'playing') return
  const cell = Number(event.key)
  if (cell >= 1 && cell <= 9) {
    event.preventDefault()
    squash(cell - 1)
  }
}

onMounted(() => {
  hydrated.value = true
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    data-testid="bug-smash"
    :data-hydrated="hydrated"
    class="overflow-hidden rounded-2xl border border-line/60 bg-ink/95 shadow-2xl backdrop-blur"
  >
    <div class="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
      <div class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-magenta/80" aria-hidden="true" />
        <span class="h-2.5 w-2.5 rounded-full bg-amber/80" aria-hidden="true" />
        <span class="h-2.5 w-2.5 rounded-full bg-terminal/80" aria-hidden="true" />
        <span class="ml-2 font-mono text-xs text-muted">~/bug-smash</span>
      </div>
      <span class="font-mono text-xs text-muted">
        {{ status === 'playing' ? 'build running' : status === 'over' ? 'build complete' : 'ready' }}
      </span>
    </div>

    <div v-if="reduced" class="p-6">
      <p class="font-mono text-xs uppercase tracking-widest text-terminal">reduced motion</p>
      <p class="mt-3 font-display text-3xl text-bone">Bug Smash is paused.</p>
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
      <div class="grid grid-cols-4 gap-2 border-b border-line/60 px-3 py-2 font-mono text-xs uppercase tracking-widest">
        <div>
          <span class="text-muted">score</span>
          <span class="ml-1 text-terminal">{{ score }}</span>
        </div>
        <div>
          <span class="text-muted">combo</span>
          <span class="ml-1 text-bone">x{{ combo }}</span>
        </div>
        <div>
          <span class="text-muted">build</span>
          <span class="ml-1 text-bone">{{ timeLeft }}s</span>
        </div>
        <div class="text-right">
          <span class="text-muted">lives</span>
          <span class="ml-1 text-terminal">{{ '●'.repeat(Math.max(0, lives)) }}</span>
        </div>
      </div>

      <div class="relative p-3">
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(cell, index) in bugSmashCells"
            :key="cell.name"
            type="button"
            :data-testid="`bug-cell-${index}`"
            :data-cell-index="index"
            :data-bug="Boolean(active[index])"
            :disabled="status !== 'playing'"
            :aria-label="
              active[index]
                ? `Squash bug in ${cell.name}`
                : `${cell.name} — no bug`
            "
            class="flex min-h-20 flex-col justify-between rounded-xl border p-2.5 text-left transition-colors"
            :class="
              active[index]
                ? 'border-magenta/70 bg-magenta/10'
                : 'border-line/60 bg-surface/30 hover:border-terminal/40 disabled:hover:border-line/60'
            "
            @click="squash(index)"
          >
            <span class="font-mono text-xs text-muted">{{ cell.name }}</span>
            <span
              class="mt-2 font-mono text-xs leading-tight"
              :class="active[index] ? 'text-magenta' : 'text-bone'"
            >
              {{ active[index] ? '✖ bug' : cell.code }}
            </span>
          </button>
        </div>

        <div
          v-if="status === 'idle'"
          class="absolute inset-0 flex flex-col items-center justify-center bg-ink/90 p-6 text-center backdrop-blur-sm"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-terminal">$ npm run build</p>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Bugs are shipping. Squash them before they reach production. Click or tap a cell,
            or press 1–9.
          </p>
          <button
            type="button"
            data-testid="bug-smash-start"
            class="mt-5 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
            @click="start"
          >
            ▶ run build
          </button>
        </div>

        <div
          v-if="status === 'over'"
          class="absolute inset-0 flex flex-col items-center justify-center bg-ink/90 p-6 text-center backdrop-blur-sm"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-terminal">build complete</p>
          <p class="mt-2 font-display text-4xl text-bone">{{ squashed }} bugs squashed</p>
          <p class="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
            score {{ score }} · best {{ best }}
          </p>
          <button
            type="button"
            data-testid="bug-smash-start"
            class="mt-5 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
            @click="start"
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
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-line/60 px-3 py-2 font-mono text-xs text-muted">
        <span aria-live="polite">{{ lastEvent || 'waiting for build…' }}</span>
        <span class="hidden sm:inline">1–9 to squash</span>
      </div>
    </template>
  </div>
</template>
