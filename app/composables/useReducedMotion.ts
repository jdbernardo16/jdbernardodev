import { computed, type Ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

export function useReducedMotion(): Ref<boolean> {
  const preferred = usePreferredReducedMotion()
  return computed(() => preferred.value === 'reduce')
}
