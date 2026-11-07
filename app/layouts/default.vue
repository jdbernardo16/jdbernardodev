<script setup lang="ts">
import { commandItems } from '~/data/commands'
</script>

<template>
  <div class="relative min-h-screen bg-ink text-bone">
    <AmbientGraph />

    <div class="relative z-10 pb-9">
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-terminal focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <AppHeader />
      <main id="main" tabindex="-1">
        <slot />
      </main>
      <AppFooter />
    </div>

    <StatusBar />
    <CommandPalette :items="commandItems" />
  </div>
</template>
