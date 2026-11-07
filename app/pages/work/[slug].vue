<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { getWorkStudy, workStudies } from '~/data/work'

const route = useRoute()
const study = getWorkStudy(String(route.params.slug))

if (!study) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

const currentIndex = workStudies.findIndex((item) => item.slug === study.slug)
const previous = workStudies[(currentIndex - 1 + workStudies.length) % workStudies.length]!
const next = workStudies[(currentIndex + 1) % workStudies.length]!

type TabId = 'readme' | 'flow' | 'logs' | 'outcome'
const tabs: { id: TabId; label: string }[] = [
  { id: 'readme', label: 'README' },
  { id: 'flow', label: 'Flow' },
  { id: 'logs', label: 'Logs' },
  { id: 'outcome', label: 'Outcome' },
]

const activeTab = ref<TabId>('readme')
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

function handleTabKeydown(event: KeyboardEvent, index: number) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (!keys.includes(event.key)) return

  event.preventDefault()
  const current = event.currentTarget as HTMLElement

  let nextIndex = index
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
  if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = tabs.length - 1

  activeTab.value = tabs[nextIndex]!.id

  nextTick(() => {
    const tablist = current.parentElement
    const buttons = tablist?.querySelectorAll<HTMLElement>('[role="tab"]')
    buttons?.[nextIndex]?.focus()
  })
}

useSeoMeta({
  title: `${study.title} — Jaydee Bernardo`,
  description: study.summary,
  ogTitle: `${study.title} — Jaydee Bernardo`,
  ogDescription: study.summary,
  ogImage: '/og-image.png',
  ogImageAlt: 'Jaydee Bernardo — AI systems that automate real work.',
  twitterImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})

useScrollReveal()
</script>

<template>
  <article v-if="study">
    <div class="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <NuxtLink
        to="/#work"
        class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
      >
        ← All work
      </NuxtLink>

      <div class="mt-8 flex items-center gap-2 font-mono text-xs text-muted">
        <span class="text-terminal">●</span>
        ~/work/{{ study.slug }}
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <span class="rounded-full bg-terminal px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink">
          {{ study.category }}
        </span>
        <span class="rounded-full border border-line/60 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
          {{ study.clientType }}
        </span>
        <span v-if="study.confidential" class="font-mono text-xs text-muted">
          client name withheld
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
          <p data-testid="work-metric" class="font-display text-5xl text-terminal">
            {{ metric.value }}
          </p>
          <p class="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
            {{ metric.label }}
            <span v-if="metric.estimate">(estimate)</span>
          </p>
        </div>
      </div>

      <div class="mt-10 overflow-hidden rounded-2xl border border-line/60 bg-surface/30">
        <div
          role="tablist"
          :data-hydrated="mounted"
          aria-label="Case study sections"
          class="flex gap-1 overflow-x-auto border-b border-line/60 px-3 py-2"
        >
          <button
            v-for="(tab, index) in tabs"
            :id="`tab-${tab.id}`"
            :key="tab.id"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            :tabindex="activeTab === tab.id ? 0 : -1"
            class="shrink-0 rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors"
            :class="activeTab === tab.id ? 'bg-terminal text-ink' : 'text-muted hover:text-bone'"
            @click="activeTab = tab.id"
            @keydown="handleTabKeydown($event, index)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="min-h-96 p-6 md:p-8">
          <section
            id="panel-readme"
            role="tabpanel"
            aria-labelledby="tab-readme"
            :hidden="mounted && activeTab !== 'readme'"
          >
            <h2 class="font-display text-3xl text-bone">Problem</h2>
            <p class="mt-3 text-base leading-relaxed text-muted">{{ study.problem }}</p>

            <h2 class="mt-8 font-display text-3xl text-bone">Stack</h2>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li
                v-for="tech in study.stack"
                :key="tech"
                class="rounded-full border border-line/60 px-3 py-1 font-mono text-xs text-muted"
              >
                {{ tech }}
              </li>
            </ul>
          </section>

          <section
            id="panel-flow"
            role="tabpanel"
            aria-labelledby="tab-flow"
            :hidden="mounted && activeTab !== 'flow'"
          >
            <h2 class="font-display text-3xl text-bone">Flow</h2>
            <ol class="mt-4 space-y-4">
              <li
                v-for="(step, index) in study.build"
                :key="step"
                class="flex gap-4 border-b border-line/40 pb-4"
              >
                <span class="font-mono text-xs text-terminal">0{{ index + 1 }}</span>
                <span class="text-base leading-relaxed text-muted">{{ step }}</span>
              </li>
            </ol>
          </section>

          <section
            id="panel-logs"
            role="tabpanel"
            aria-labelledby="tab-logs"
            :hidden="mounted && activeTab !== 'logs'"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h2 class="font-display text-3xl text-bone">Logs</h2>
              <p class="font-mono text-xs uppercase tracking-widest text-muted">
                sample run — synthetic events
              </p>
            </div>
            <div class="mt-4 rounded-xl border border-line/60 bg-black/50 p-4 font-mono text-xs leading-relaxed">
              <p v-for="(line, index) in study.consoleLines" :key="index">
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
          </section>

          <section
            id="panel-outcome"
            role="tabpanel"
            aria-labelledby="tab-outcome"
            :hidden="mounted && activeTab !== 'outcome'"
          >
            <h2 class="font-display text-3xl text-bone">Outcome</h2>
            <ul class="mt-4 space-y-3 text-base leading-relaxed text-muted">
              <li v-for="item in study.outcome" :key="item" class="flex gap-3">
                <span class="text-terminal">✓</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-6">
        <NuxtLink
          :to="`/work/${previous.slug}`"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          ← {{ previous.title }}
        </NuxtLink>
        <NuxtLink
          :to="`/work/${next.slug}`"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          {{ next.title }} →
        </NuxtLink>
      </div>

      <div class="mt-10 rounded-2xl border border-line/60 bg-surface/30 p-6" data-reveal>
        <p class="font-mono text-xs uppercase tracking-widest text-terminal">next step</p>
        <p class="mt-3 font-display text-3xl text-bone">
          Have a workflow that needs an agent?
        </p>
        <NuxtLink
          to="/#contact"
          class="mt-5 inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
        >
          Start a project
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
