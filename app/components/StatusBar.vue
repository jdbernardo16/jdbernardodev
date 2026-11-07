<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const route = useRoute();
const activeSection = ref("home");
const time = ref("--:--");

const locationLabel = computed(() =>
    route.path === "/" ? `~/${activeSection.value}` : `~${route.path}`,
);

let interval: ReturnType<typeof setInterval> | undefined;
let observer: IntersectionObserver | undefined;

function updateTime() {
    time.value = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date());
}

function openPalette() {
    if (import.meta.client) {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
}

onMounted(() => {
    updateTime();
    interval = setInterval(updateTime, 30_000);

    if (typeof IntersectionObserver === "undefined") return;

    observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible?.target.id) activeSection.value = visible.target.id;
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    document
        .querySelectorAll("section[id]")
        .forEach((section) => observer?.observe(section));
});

onUnmounted(() => {
    if (interval) clearInterval(interval);
    observer?.disconnect();
});
</script>

<template>
    <div
        class="fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-ink/85 backdrop-blur"
    >
        <div
            class="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 font-mono text-xs uppercase tracking-widest text-muted"
        >
            <div class="flex items-center gap-4">
                <span class="flex items-center gap-2">
                    <span
                        class="h-1.5 w-1.5 rounded-full bg-terminal"
                        aria-hidden="true"
                    />
                    agent online
                </span>
                <span class="hidden sm:inline">{{ locationLabel }}</span>
            </div>

            <div class="flex items-center gap-4">
                <span class="hidden sm:inline">{{ time }}</span>
                <button
                    type="button"
                    class="rounded border border-line/60 px-2 py-0.5 text-bone transition-colors hover:border-terminal hover:text-terminal"
                    @click="openPalette"
                >
                    ⌘K
                </button>
            </div>
        </div>
    </div>
</template>
