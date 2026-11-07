<script setup lang="ts">
import type { Service } from '~/types/content'

defineProps<{ services: Service[] }>()
</script>

<template>
  <section id="services" class="border-b border-line/40">
    <div class="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading
        eyebrow="Services"
        title="Build, integrate, secure."
        description="AI agents that run real operations, assistants grounded in your data, and the web apps and security work behind them."
      />

      <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="service in services" :key="service.id" :service="service" />
      </div>
    </div>
  </section>
</template>
