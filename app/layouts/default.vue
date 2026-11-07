<script setup lang="ts">
import { commandItems } from '~/data/commands'
</script>

<template>
  <div class="min-h-screen bg-ink text-bone">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-amber focus:px-4 focus:py-2 focus:text-ink"
    >
      Skip to content
    </a>

    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
    <CommandPalette :items="commandItems" />
  </div>
</template>
