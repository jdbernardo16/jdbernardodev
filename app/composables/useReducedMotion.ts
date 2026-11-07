import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useReducedMotion(): Ref<boolean> {
  const reduced = ref(false)
  let media: MediaQueryList | undefined
  let handler: ((event: MediaQueryListEvent) => void) | undefined

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = media.matches
    handler = (event) => {
      reduced.value = event.matches
    }
    media.addEventListener('change', handler)
  })

  onUnmounted(() => {
    if (media && handler) media.removeEventListener('change', handler)
  })

  return reduced
}
