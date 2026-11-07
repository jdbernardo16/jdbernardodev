<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="max-w-2xl">
    <p class="font-mono text-xs uppercase tracking-widest text-amber">
      {{ eyebrow }}
    </p>
    <h2 class="mt-3 font-display text-4xl leading-tight text-bone md:text-5xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-base leading-relaxed text-muted">
      {{ description }}
    </p>
  </div>
</template>
