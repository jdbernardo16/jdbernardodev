import { onMounted, onUnmounted } from 'vue'
import { useReducedMotion } from './useReducedMotion'

export function useScrollReveal(selector = '[data-reveal]') {
  const reduced = useReducedMotion()
  let context: { revert: () => void; refresh?: () => void } | undefined

  onMounted(async () => {
    if (reduced.value || typeof window === 'undefined') return

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])

    gsap.registerPlugin(ScrollTrigger)

    context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(selector)
      for (const element of elements) {
        gsap.from(element, {
          y: 16,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        })
      }
    })

    context.refresh?.()
  })

  onUnmounted(() => context?.revert())

  return {
    refresh: () => context?.refresh?.(),
  }
}
