<script setup lang="ts">
import { site } from "~/data/site";
</script>

<template>
    <section id="contact" class="border-b border-line/40" data-reveal>
        <div
            class="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:py-24"
        >
            <div class="md:col-span-5">
                <SectionHeading
                    eyebrow="Contact"
                    title="Have a workflow that needs an agent?"
                    description="Tell me what you're trying to automate, integrate, or secure. I'll reply with the next step."
                />

                <div
                    class="mt-8 space-y-3 font-mono text-xs uppercase tracking-widest"
                >
                    <a
                        :href="`mailto:${site.email}`"
                        class="block text-bone transition-colors hover:text-terminal"
                    >
                        {{ site.email }}
                    </a>
                    <a
                        :href="site.linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block text-muted transition-colors hover:text-terminal"
                    >
                        LinkedIn
                    </a>
                    <a
                        :href="site.github"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block text-muted transition-colors hover:text-terminal"
                    >
                        GitHub
                    </a>
                </div>
            </div>

            <div class="md:col-span-7">
                <ContactForm />
            </div>
        </div>
    </section>
</template>
