<template>
    <section id="about" class="border-b border-line/40" data-reveal>
        <div
            class="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:py-24"
        >
            <div class="md:col-span-4">
                <div
                    class="flex aspect-square max-w-xs items-center justify-center rounded-2xl border border-line/60 bg-surface/30"
                    aria-hidden="true"
                >
                    <span class="font-display text-8xl text-terminal">JB</span>
                </div>
                <p
                    class="mt-4 font-mono text-xs uppercase tracking-widest text-muted"
                >
                    Marilao, Bulacan, Philippines
                </p>
            </div>

            <div class="md:col-span-8">
                <SectionHeading
                    eyebrow="About"
                    title="Senior developer. Independent AI engineer."
                />

                <div
                    class="mt-6 space-y-4 text-base leading-relaxed text-muted"
                >
                    <p>
                        I'm Jaydee, a Senior Developer at Praxxys and an
                        independent AI engineer. At Praxxys, I set tooling
                        direction, build internal tools and workflows, and make
                        key technical decisions for the development team.
                    </p>
                    <p>
                        Outside work, I build AI agents for clients: a grading
                        assistant for a teacher, an MT5 operations agent for a
                        trader, an order-monitoring agent for an e-commerce
                        seller, and a CRM-aware property assistant for a real
                        estate business.
                    </p>
                    <p>
                        I care about systems that keep working after the demo —
                        maintainable, observable, and secure. That's why I also
                        do VAPT and incident response: I've cleaned up a live
                        SQL injection breach on a government agency website, and
                        I'd rather build things that don't need cleaning up.
                    </p>
                </div>

                <div class="mt-8 flex flex-wrap gap-2">
                    <span
                        v-for="skill in [
                            'JavaScript',
                            'Vue 3',
                            'Nuxt',
                            'Tailwind CSS',
                            'Node.js',
                            'Laravel',
                            'PHP',
                            'Silverstripe',
                            'MariaDB',
                            'AI agents',
                            'VAPT',
                            'Scrum',
                        ]"
                        :key="skill"
                        class="rounded-full border border-line/60 px-3 py-1 font-mono text-xs text-muted"
                    >
                        {{ skill }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>
