<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <section class="relative overflow-hidden border-b border-line/40">
    <div class="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />

    <div class="relative mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-20 md:grid-cols-12 md:items-center md:pb-28 md:pt-28">
      <div class="md:col-span-5">
        <p class="font-mono text-xs uppercase tracking-widest text-terminal">
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
            class="inline-flex items-center rounded-full bg-terminal px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
          >
            Start a project
          </MagneticButton>
          <a
            href="#work"
            class="inline-flex items-center rounded-full border border-line px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-bone transition-colors hover:border-terminal hover:text-terminal"
          >
            See the work
          </a>
        </div>

        <p class="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
          Available for selected projects · {{ site.location }}
        </p>

        <div class="mt-6 rounded-xl border border-line/60 bg-surface/30 p-4 font-mono text-xs">
          <p class="text-muted">// find me on github:</p>
          <p class="mt-1">
            <span class="text-magenta">const</span>
            <span class="ml-1 text-cyan">githubLink</span>
            <span class="mx-1 text-muted">=</span>
            <span class="text-terminal">"https://github.com/jdbernardo16"</span>
          </p>
        </div>
      </div>

      <div class="md:col-span-7">
        <DataStreamGame />
        <p class="mt-3 text-center font-mono text-xs uppercase tracking-widest text-muted">
          Collect the data. Avoid the bugs. Ship the build.
        </p>
      </div>
    </div>
  </section>
</template>
