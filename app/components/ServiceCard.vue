<script setup lang="ts">
import type { Service } from '~/types/content'

defineProps<{ service: Service }>()
</script>

<template>
  <article
    data-testid="service-card"
    class="flex flex-col rounded-2xl border border-line/60 bg-surface/30 p-6 transition-colors hover:border-terminal/50"
  >
    <p class="font-mono text-xs uppercase tracking-widest text-terminal">
      {{ service.id }}
    </p>

    <h3 class="mt-3 font-display text-2xl text-bone">
      {{ service.title }}
    </h3>

    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
      {{ service.description }}
    </p>

    <ul class="mt-5 space-y-1">
      <li
        v-for="bullet in service.bullets"
        :key="bullet"
        class="font-mono text-xs leading-relaxed text-muted"
      >
        — {{ bullet }}
      </li>
    </ul>

    <a
      v-if="service.workSlug"
      :href="`/work/${service.workSlug}`"
      class="mt-5 inline-flex font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:text-terminal"
    >
      See the work →
    </a>
  </article>
</template>
