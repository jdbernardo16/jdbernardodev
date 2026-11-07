<script setup lang="ts">
import { site } from '~/data/site'

useSeoMeta({
  title: 'Privacy — Jaydee Bernardo',
  description: 'How this site handles contact form data.',
  ogImage: '/og-image.svg',
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16 md:py-24">
    <p class="font-mono text-xs uppercase tracking-widest text-amber">Privacy</p>
    <h1 class="mt-4 font-display text-5xl leading-none text-bone md:text-7xl">Privacy</h1>

    <div class="mt-10 space-y-10 text-base leading-relaxed text-muted">
      <section>
        <h2 class="font-display text-2xl text-bone">What I collect</h2>
        <p class="mt-3">
          Only the information you submit through the contact form: your name, email, project
          type, optional budget range, and message.
        </p>
      </section>

      <section>
        <h2 class="font-display text-2xl text-bone">Why I collect it</h2>
        <p class="mt-3">
          To reply to your inquiry, understand what you need, and scope the work. I do not sell
          or share your information.
        </p>
      </section>

      <section>
        <h2 class="font-display text-2xl text-bone">How long I keep it</h2>
        <p class="mt-3">
          Inquiry data is kept for up to 12 months, then deleted. You can ask for earlier
          deletion at any time.
        </p>
      </section>

      <section>
        <h2 class="font-display text-2xl text-bone">Your choices</h2>
        <p class="mt-3">
          Email
          <a :href="`mailto:${site.email}`" class="text-amber underline">{{ site.email }}</a>
          to request access, correction, or deletion of your data.
        </p>
      </section>

      <section>
        <h2 class="font-display text-2xl text-bone">Analytics</h2>
        <p class="mt-3">
          This site does not use analytics or tracking cookies at launch.
        </p>
      </section>
    </div>
  </div>
</template>
