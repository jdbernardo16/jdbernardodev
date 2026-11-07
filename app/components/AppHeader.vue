<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { site } from '~/data/site'

const isMenuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileNav = ref<HTMLElement | null>(null)
const emit = defineEmits<{ 'open-command': [] }>()

function focusableInMenu(): HTMLElement[] {
  const links = Array.from(
    mobileNav.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
  )
  return menuButton.value ? [menuButton.value as unknown as HTMLElement, ...links] : links
}

function openMenu() {
  isMenuOpen.value = true
  nextTick(() => {
    const firstLink = mobileNav.value?.querySelector<HTMLElement>('a[href]')
    firstLink?.focus()
  })
}

function closeMenu(restoreFocus = true) {
  isMenuOpen.value = false
  if (restoreFocus) nextTick(() => menuButton.value?.focus())
}

function toggleMenu() {
  if (isMenuOpen.value) closeMenu()
  else openMenu()
}

function handleKeydown(event: KeyboardEvent) {
  if (!isMenuOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }

  if (event.key !== 'Tab') return

  const focusable = focusableInMenu()
  if (!focusable.length) return

  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function openCommandPalette() {
  emit('open-command')
  if (import.meta.client) {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <NuxtLink
        to="/"
        class="group flex items-center gap-2 font-mono text-sm text-bone"
        @click="closeMenu(false)"
      >
        <span class="text-terminal">~/</span>
        <span class="font-display text-xl tracking-tight">jaydee</span>
        <span class="hidden text-muted transition-colors group-hover:text-terminal sm:inline">
          bernardo
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex" aria-label="Primary">
        <NuxtLink
          v-for="item in site.nav"
          :key="item.href"
          :to="`/${item.href}`"
          class="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-terminal"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="hidden rounded border border-line/60 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-terminal hover:text-terminal md:inline-flex"
          @click="openCommandPalette"
        >
          ⌘K
        </button>

        <NuxtLink
          to="/#contact"
          class="hidden rounded-full bg-terminal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          Start a project
        </NuxtLink>

        <button
          ref="menuButton"
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone md:hidden"
          aria-controls="mobile-nav"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
          @click="toggleMenu"
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
      ref="mobileNav"
      class="border-t border-line/60 bg-ink px-6 py-4 md:hidden"
      aria-label="Mobile"
    >
      <NuxtLink
        v-for="item in site.nav"
        :key="item.href"
        :to="`/${item.href}`"
        class="block py-3 font-mono text-sm uppercase tracking-widest text-muted"
        @click="closeMenu(false)"
      >
        {{ item.label }}
      </NuxtLink>
      <NuxtLink
        to="/#contact"
        class="mt-3 inline-flex rounded-full bg-terminal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
        @click="closeMenu(false)"
      >
        Start a project
      </NuxtLink>
    </nav>
  </header>
</template>
