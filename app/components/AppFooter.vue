<script setup lang="ts">
import { site } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line/60 bg-ink">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="font-mono text-xs text-terminal">~/jaydee/bernardo</p>
        <p class="mt-2 font-display text-3xl text-bone">Jaydee Bernardo</p>
        <p class="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
          {{ site.title }}
        </p>
      </div>

      <nav class="flex flex-wrap gap-x-6 gap-y-2" aria-label="Contact">
        <a
          :href="`mailto:${site.email}`"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          {{ site.email }}
        </a>
        <a
          :href="site.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          LinkedIn
        </a>
        <a
          :href="site.github"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          GitHub
        </a>
        <NuxtLink
          to="/privacy"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          Privacy
        </NuxtLink>
        <a
          :href="site.github"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          Source
        </a>
        <a
          href="#main"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          Back to top
        </a>
      </nav>
    </div>

    <div class="mx-auto max-w-6xl border-t border-line/40 px-6 py-6">
      <p class="font-mono text-xs uppercase tracking-widest text-muted">
        © {{ year }} Jaydee Bernardo. Built with Nuxt and Tailwind.
      </p>
    </div>
  </footer>
</template>
