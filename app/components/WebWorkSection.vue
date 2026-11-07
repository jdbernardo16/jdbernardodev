<script setup lang="ts">
const namedClients = [
  { name: 'True Influence Method', detail: 'Coaching brand website' },
  { name: 'DrCare POS', detail: 'Healthcare point-of-sale system' },
  { name: 'Retrosneak', detail: 'E-commerce store' },
  { name: 'Jerrmond Dental Clinic', detail: 'Dental clinic website' },
]

const employerProjects = [
  { name: 'SavePlus', detail: 'System, mobile app, and web app' },
  { name: 'DGT', detail: 'Multi-platform dental system' },
  { name: 'Goldrank', detail: 'Web app and frontend architecture' },
]

const legacyProjects = [
  'Reliasourcing',
  'Golden Topper',
  'Kolin',
  'De La Salle Lipa',
  'Mapua',
  'Salem PH',
  'My Lovely Writer',
  'FooDee',
  'The Abbas Orchard',
]
</script>

<template>
  <section id="web-work" class="border-b border-line/40" data-reveal>
    <div class="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading
        eyebrow="Web & product work"
        title="The apps behind the agents."
        description="Client websites, e-commerce stores, POS systems, and multi-platform products — built to ship and stay maintainable."
      />

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="client in namedClients"
          :key="client.name"
          class="rounded-2xl border border-line/60 bg-surface/30 p-5"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-terminal">client</p>
          <h3 class="mt-3 font-display text-xl text-bone">{{ client.name }}</h3>
          <p class="mt-1 font-mono text-xs text-muted">{{ client.detail }}</p>
        </article>
      </div>

      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-muted">Employer projects</p>
          <ul class="mt-3 space-y-3">
            <li
              v-for="project in employerProjects"
              :key="project.name"
              class="flex flex-col gap-1 border-b border-line/40 pb-3"
            >
              <span class="font-display text-xl text-bone">{{ project.name }}</span>
              <span class="font-mono text-xs text-muted">{{ project.detail }}</span>
            </li>
          </ul>
        </div>

        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-muted">Legacy builds</p>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li
              v-for="project in legacyProjects"
              :key="project"
              class="rounded-full border border-line/60 px-3 py-1 font-mono text-xs text-muted"
            >
              {{ project }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap items-center gap-4">
        <a
          href="#contact"
          class="inline-flex rounded-full bg-terminal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
        >
          Start a project
        </a>
        <p class="font-mono text-xs text-muted">
          Named clients shown as plain text. No logos without permission.
        </p>
      </div>
    </div>
  </section>
</template>
