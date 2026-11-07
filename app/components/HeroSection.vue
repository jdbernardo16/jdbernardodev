<script setup lang="ts">
import { site } from '~/data/site'
import type { FlowNode } from '~/utils/agent-flow'

const targets: Record<FlowNode['id'], string> = {
  detect: 'work',
  reason: 'services',
  act: 'work',
  notify: 'contact',
}

function handleSelect(id: FlowNode['id']) {
  if (!import.meta.client) return
  document.getElementById(targets[id])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="relative overflow-hidden border-b border-line/40">
    <div
      class="pointer-events-none absolute inset-0 hero-glow"
      aria-hidden="true"
    />

    <div class="relative mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-20 md:grid-cols-12 md:items-center md:pb-28 md:pt-32">
      <div class="md:col-span-7">
        <p class="font-mono text-xs uppercase tracking-widest text-amber">
          {{ site.title }}
        </p>

        <h1 class="mt-5 font-display text-6xl leading-none tracking-tight text-bone md:text-8xl">
          Jaydee Bernardo
        </h1>

        <p class="mt-8 max-w-xl font-display text-3xl leading-tight text-bone md:text-5xl">
          AI systems that automate real work.
        </p>

        <p class="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          I build agents that monitor, decide, act, and notify — plus the web apps and
          security behind them.
        </p>

        <div class="mt-9 flex flex-wrap gap-3">
          <MagneticButton
            href="#contact"
            class="inline-flex items-center rounded-full bg-amber px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
          >
            Start a project
          </MagneticButton>
          <a
            href="#work"
            class="inline-flex items-center rounded-full border border-line px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-bone transition-colors hover:border-amber hover:text-amber"
          >
            See the work
          </a>
        </div>

        <p class="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
          Available for selected projects · {{ site.location }}
        </p>
      </div>

      <div class="md:col-span-5">
        <AgentFlowCanvas @select="handleSelect" />
        <p class="mt-3 text-center font-mono text-xs uppercase tracking-widest text-muted">
          Click a step to explore the loop
        </p>
      </div>
    </div>
  </section>
</template>
