import { computed, ref, type ComputedRef, type Ref } from 'vue'

export interface CommandItem {
  label: string
  href: string
  section: string
}

export interface CommandPaletteState {
  isOpen: Ref<boolean>
  query: Ref<string>
  filtered: ComputedRef<CommandItem[]>
  open: () => void
  close: () => void
  toggle: () => void
}

export function useCommandPalette(items: CommandItem[]): CommandPaletteState {
  const isOpen = ref(false)
  const query = ref('')

  const filtered = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return items

    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(term) || item.section.toLowerCase().includes(term),
    )
  })

  function open() {
    query.value = ''
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    if (isOpen.value) close()
    else open()
  }

  return { isOpen, query, filtered, open, close, toggle }
}
