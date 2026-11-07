import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-07',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxtjs/seo', '@nuxt/test-utils/module'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'three'],
    },
  },
  fonts: {
    families: [
      { name: 'Instrument Serif', provider: 'google' },
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },
  site: {
    url: 'https://jdbernardodev.site',
    name: 'Jaydee Bernardo',
    description: 'AI systems that automate real work.',
    defaultLocale: 'en',
  },
  runtimeConfig: {
    public: {
      formspreeEndpoint: '',
    },
  },
  app: {
    head: {
      titleTemplate: '%s',
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
