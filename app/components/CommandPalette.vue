<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useCommandPalette, type CommandItem } from '~/composables/useCommandPalette'

const props = defineProps<{ items: CommandItem[] }>()

const { isOpen, query, filtered, open, close } = useCommandPalette(props.items)

const dialog = ref<HTMLDivElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
let previousFocus: HTMLElement | null = null

function openPalette() {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  open()
  nextTick(() => input.value?.focus())
}

function closePalette() {
  close()
  nextTick(() => previousFocus?.focus())
}

function trapFocus(event: KeyboardEvent) {
  const element = dialog.value
  if (!element) return

  const focusable = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled])',
  )
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

function handleKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    if (isOpen.value) closePalette()
    else openPalette()
    return
  }

  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closePalette()
    return
  }

  if (event.key === 'Tab') trapFocus(event)
}

function handleExternalOpen() {
  openPalette()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('open-command-palette', handleExternalOpen)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('open-command-palette', handleExternalOpen)
})
</script>

<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-ink/80 px-4 pt-24 backdrop-blur"
      @click.self="closePalette"
    >
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        class="w-full max-w-xl overflow-hidden rounded-2xl border border-line/60 bg-surface shadow-2xl"
      >
        <div class="border-b border-line/60 p-3">
          <input
            ref="input"
            v-model="query"
            type="search"
            placeholder="Jump to a section or case study…"
            class="w-full rounded-xl border border-line/60 bg-ink px-4 py-3 text-sm text-bone outline-none placeholder:text-muted focus:border-amber"
          />
        </div>

        <ul role="listbox" class="max-h-80 overflow-y-auto p-2">
          <li v-for="item in filtered" :key="item.href">
            <a
              :href="item.href"
              role="option"
              class="flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-ink"
              @click="closePalette"
            >
              <span class="text-sm text-bone">{{ item.label }}</span>
              <span class="font-mono text-xs uppercase tracking-widest text-muted">
                {{ item.section }}
              </span>
            </a>
          </li>
        </ul>

        <p v-if="filtered.length === 0" class="px-4 pb-5 pt-2 font-mono text-xs text-muted">
          No results.
        </p>

        <div class="flex items-center justify-between border-t border-line/60 px-4 py-2">
          <p class="font-mono text-xs uppercase tracking-widest text-muted">Esc to close</p>
          <p class="font-mono text-xs uppercase tracking-widest text-muted">⌘K</p>
        </div>
      </div>
    </div>
  </div>
</template>
