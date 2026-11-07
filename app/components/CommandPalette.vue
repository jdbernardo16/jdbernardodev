<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useCommandPalette, type CommandItem } from '~/composables/useCommandPalette'
import { parseCommand, runCommand } from '~/utils/commands'
import { site } from '~/data/site'
import { workStudies } from '~/data/work'

const props = defineProps<{ items: CommandItem[] }>()

const { isOpen, query, filtered, open, close } = useCommandPalette(props.items)

const dialog = ref<HTMLDivElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const output = ref<string[]>([
  'jaydee terminal v1.0.0',
  'type "help" to list commands, or use the quick links below.',
])
const history = ref<string[]>([])
const historyIndex = ref(-1)

let previousFocus: HTMLElement | null = null

const context = {
  workSlugs: workStudies.map((study) => study.slug),
  email: site.email,
}

function openPalette() {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  open()
  nextTick(() => input.value?.focus())
}

function closePalette() {
  close()
  nextTick(() => previousFocus?.focus())
}

function execute() {
  const raw = query.value.trim()
  if (!raw) return

  history.value.push(raw)
  historyIndex.value = -1

  const result = runCommand(parseCommand(raw), context)

  if (result.clear) {
    output.value = []
  } else {
    output.value = [...output.value, `$ ${raw}`, ...result.output]
  }

  query.value = ''

  if (result.navigate) {
    navigateTo(result.navigate)
    closePalette()
    return
  }

  if (result.close) {
    closePalette()
    return
  }

  nextTick(() => {
    const target = dialog.value?.querySelector<HTMLElement>('[data-terminal-output]')
    target?.scrollTo({ top: target.scrollHeight })
  })
}

function historyUp() {
  if (!history.value.length) return
  historyIndex.value = Math.min(history.value.length - 1, historyIndex.value + 1)
  query.value = history.value[history.value.length - 1 - historyIndex.value] ?? ''
}

function historyDown() {
  if (historyIndex.value <= 0) {
    historyIndex.value = -1
    query.value = ''
    return
  }
  historyIndex.value -= 1
  query.value = history.value[history.value.length - 1 - historyIndex.value] ?? ''
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
      class="fixed inset-0 z-50 flex items-start justify-center bg-ink/85 px-4 pt-20 backdrop-blur"
      @click.self="closePalette"
    >
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        class="w-full max-w-2xl overflow-hidden rounded-2xl border border-line/60 bg-surface shadow-2xl"
      >
        <div class="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
          <div class="flex items-center gap-2 font-mono text-xs text-muted">
            <span class="text-terminal">●</span>
            ~/jaydee/terminal
          </div>
          <span class="font-mono text-xs text-muted">⌘K</span>
        </div>

        <div
          data-terminal-output
          class="max-h-64 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
          aria-live="polite"
        >
          <p
            v-for="(line, index) in output"
            :key="`${line}-${index}`"
            :class="line.startsWith('$') ? 'text-terminal' : 'text-muted'"
          >
            {{ line }}
          </p>

          <form class="mt-3 flex items-center gap-2" @submit.prevent="execute">
            <span class="text-terminal">$</span>
            <input
              ref="input"
              v-model="query"
              type="text"
              autocomplete="off"
              spellcheck="false"
              aria-label="Terminal command"
              placeholder="type help…"
              class="min-w-0 flex-1 bg-transparent font-mono text-xs text-bone outline-none placeholder:text-muted"
              @keydown.up.prevent="historyUp"
              @keydown.down.prevent="historyDown"
            />
          </form>
        </div>

        <div class="border-t border-line/60 p-3">
          <p class="font-mono text-xs uppercase tracking-widest text-muted">quick links</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <a
              v-for="item in filtered.slice(0, 6)"
              :key="item.href"
              :href="item.href"
              role="option"
              class="rounded-lg border border-line/60 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-terminal hover:text-terminal"
              @click="closePalette"
            >
              {{ item.label }}
            </a>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-line/60 px-4 py-2">
          <p class="font-mono text-xs uppercase tracking-widest text-muted">Esc to close</p>
          <p class="font-mono text-xs uppercase tracking-widest text-muted">help · ls · open · whoami</p>
        </div>
      </div>
    </div>
  </div>
</template>
