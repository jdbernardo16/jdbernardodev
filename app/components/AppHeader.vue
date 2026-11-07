<script setup lang="ts">
import { ref } from 'vue'
import { site } from '~/data/site'

const isMenuOpen = ref(false)
const emit = defineEmits<{ 'open-command': [] }>()

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <NuxtLink
        to="/"
        class="font-display text-xl tracking-tight text-bone"
        @click="closeMenu"
      >
        Jaydee Bernardo
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex" aria-label="Primary">
        <a
          v-for="item in site.nav"
          :key="item.href"
          :href="item.href"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-bone"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <button type="button" class="sr-only" @click="emit('open-command')">
          Open command palette
        </button>

        <a
          href="#contact"
          class="hidden rounded-full bg-amber px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          Start a project
        </a>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone md:hidden"
          aria-controls="mobile-nav"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            v-if="!isMenuOpen"
            aria-hidden="true"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg
            v-else
            aria-hidden="true"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <nav
      v-show="isMenuOpen"
      id="mobile-nav"
      class="border-t border-line/60 bg-ink px-6 py-4 md:hidden"
      aria-label="Mobile"
    >
      <a
        v-for="item in site.nav"
        :key="item.href"
        :href="item.href"
        class="block py-2 font-mono text-sm uppercase tracking-widest text-muted"
        @click="closeMenu"
      >
        {{ item.label }}
      </a>
      <a
        href="#contact"
        class="mt-3 inline-flex rounded-full bg-amber px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
        @click="closeMenu"
      >
        Start a project
      </a>
    </nav>
  </header>
</template>
