<script setup lang="ts">
import type { WorkStudy } from "~/types/content";

defineProps<{ studies: WorkStudy[] }>();
</script>

<template>
    <section id="work" class="border-b border-line/40" data-reveal>
        <div class="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <SectionHeading
                eyebrow="Selected work"
                title="Agents that run real operations."
                description="Four systems built for real clients. Client names are withheld where confidentiality applies; the outcomes are not."
            />

            <div class="mt-10 grid gap-4 md:grid-cols-2">
                <WorkCard
                    v-for="study in studies"
                    :key="study.slug"
                    :study="study"
                />
            </div>

            <div class="mt-12">
                <AgentConsole :studies="studies" />
            </div>
        </div>
    </section>
</template>
