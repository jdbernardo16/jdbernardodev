<script setup lang="ts">
import { getWorkStudy, workStudies } from '~/data/work'

const route = useRoute()
const study = getWorkStudy(String(route.params.slug))

if (!study) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

const currentIndex = workStudies.findIndex((item) => item.slug === study.slug)
const previous = workStudies[(currentIndex - 1 + workStudies.length) % workStudies.length]!
const next = workStudies[(currentIndex + 1) % workStudies.length]!

useSeoMeta({
  title: `${study.title} — Jaydee Bernardo`,
  description: study.summary,
  ogTitle: `${study.title} — Jaydee Bernardo`,
  ogDescription: study.summary,
})
</script>

<template>
  <article v-if="study">
    <div class="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <NuxtLink
        to="/#work"
        class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-amber"
      >
        ← All work
      </NuxtLink>

      <div class="mt-10 flex flex-wrap items-center gap-3">
        <span class="rounded-full bg-amber px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink">
          {{ study.category }}
        </span>
        <span class="rounded-full border border-line/60 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
          {{ study.clientType }}
        </span>
      </div>

      <h1 class="mt-6 font-display text-5xl leading-none tracking-tight text-bone md:text-7xl">
        {{ study.title }}
      </h1>

      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        {{ study.summary }}
      </p>

      <div v-if="study.metrics.length" class="mt-8 flex flex-wrap gap-8">
        <div v-for="metric in study.metrics" :key="metric.label">
          <p data-testid="work-metric" class="font-display text-5xl text-amber">
            {{ metric.value }}
          </p>
          <p class="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
            {{ metric.label }}
            <span v-if="metric.estimate">(estimate)</span>
          </p>
        </div>
      </div>

      <p
        v-if="study.confidential"
        class="mt-8 rounded-xl border border-line/60 bg-surface/30 p-4 font-mono text-xs leading-relaxed text-muted"
      >
        Client name withheld under NDA. The build and outcomes are described with permission.
      </p>

      <div class="mt-14 grid gap-12 md:grid-cols-2">
        <section>
          <h2 class="font-display text-3xl text-bone">Problem</h2>
          <p class="mt-4 text-base leading-relaxed text-muted">
            {{ study.problem }}
          </p>
        </section>

        <section>
          <h2 class="font-display text-3xl text-bone">Build</h2>
          <ul class="mt-4 space-y-2 text-base leading-relaxed text-muted">
            <li v-for="item in study.build" :key="item">— {{ item }}</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-3xl text-bone">Outcome</h2>
          <ul class="mt-4 space-y-2 text-base leading-relaxed text-muted">
            <li v-for="item in study.outcome" :key="item">— {{ item }}</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-3xl text-bone">Stack</h2>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="tech in study.stack"
              :key="tech"
              class="rounded-full border border-line/60 px-3 py-1 font-mono text-xs text-muted"
            >
              {{ tech }}
            </li>
          </ul>
        </section>
      </div>

      <div class="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-8">
        <NuxtLink
          :to="`/work/${previous.slug}`"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-amber"
        >
          ← {{ previous.title }}
        </NuxtLink>
        <NuxtLink
          :to="`/work/${next.slug}`"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-amber"
        >
          {{ next.title }} →
        </NuxtLink>
      </div>

      <div class="mt-12 rounded-2xl border border-line/60 bg-surface/30 p-6">
        <p class="font-mono text-xs uppercase tracking-widest text-amber">Next step</p>
        <p class="mt-3 font-display text-3xl text-bone">
          Have a workflow that needs an agent?
        </p>
        <a
          href="/#contact"
          class="mt-5 inline-flex rounded-full bg-amber px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
        >
          Start a project
        </a>
      </div>
    </div>
  </article>
</template>
