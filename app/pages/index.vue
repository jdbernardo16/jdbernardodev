<script setup lang="ts">
import { services } from '~/data/services'
import { site } from '~/data/site'
import { workStudies } from '~/data/work'

useSeoMeta({
  title: 'Jaydee Bernardo — Senior AI Engineer & Full-Stack Developer',
  description:
    'AI systems that automate real work. AI agents, assistants, integrations, and secure full-stack delivery.',
  ogTitle: 'Jaydee Bernardo — Senior AI Engineer & Full-Stack Developer',
  ogDescription:
    'AI systems that automate real work. AI agents, assistants, integrations, and secure full-stack delivery.',
  ogImage: '/og-image.png',
  ogImageAlt: 'Jaydee Bernardo — AI systems that automate real work.',
  twitterImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  definePerson({
    name: 'John Dennis Bernardo',
    alternateName: 'Jaydee Bernardo',
    jobTitle: 'Senior AI Engineer & Full-Stack Developer',
    url: site.url,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marilao',
      addressRegion: 'Bulacan',
      addressCountry: 'PH',
    },
    sameAs: [site.linkedin, site.github],
  }),
])

useScrollReveal()
</script>

<template>
  <div>
    <HeroSection />
    <ProofStrip />
    <ServicesSection :services="services" />
    <WorkSection :studies="workStudies" />
    <WebWorkSection />
    <SecuritySection />
    <AboutSection />
    <ContactSection />
  </div>
</template>
