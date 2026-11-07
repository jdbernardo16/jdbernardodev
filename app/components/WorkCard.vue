<script setup lang="ts">
import type { WorkStudy } from '~/types/content'

defineProps<{ study: WorkStudy }>()
</script>

<template>
  <article
    data-testid="work-card"
    class="flex flex-col rounded-2xl border border-line/60 bg-surface/30 p-6 transition-colors hover:border-amber/50"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="font-mono text-xs uppercase tracking-widest text-amber">
        {{ study.category }}
      </p>
      <p class="font-mono text-xs uppercase tracking-widest text-muted">
        {{ study.clientType }}
      </p>
    </div>

    <h3 class="mt-4 font-display text-2xl leading-tight text-bone">
      {{ study.title }}
    </h3>

    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
      {{ study.summary }}
    </p>

    <p
      v-for="metric in study.metrics"
      :key="metric.label"
      class="mt-4 font-mono text-xs uppercase tracking-widest text-terminal"
    >
      {{ metric.value }} {{ metric.label }}
      <span v-if="metric.estimate" class="text-muted">(estimate)</span>
    </p>

    <ul class="mt-5 flex flex-wrap gap-2">
      <li
        v-for="tech in study.stack"
        :key="tech"
        class="rounded-full border border-line/60 px-2.5 py-1 font-mono text-xs text-muted"
      >
        {{ tech }}
      </li>
    </ul>

    <a
      :href="`/work/${study.slug}`"
      class="mt-5 inline-flex font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:text-amber"
    >
      Read the case study →
    </a>
  </article>
</template>
