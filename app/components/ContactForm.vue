<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { site } from '~/data/site'
import { validateContact, type ContactErrors, type ContactPayload } from '~/utils/contact'

const props = defineProps<{ endpoint?: string }>()
const config = useRuntimeConfig()
const endpoint = computed(() => props.endpoint ?? String(config.public.formspreeEndpoint ?? ''))

const form = reactive<ContactPayload>({
  name: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
  consent: false,
})

const errors = ref<ContactErrors>({})
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const gotcha = ref('')

const projectTypes = ['AI agent', 'AI assistant', 'AI integration', 'VAPT', 'Web development', 'Other']
const budgets = ['Under 5k', '5k–10k', '10k–25k', '25k+', 'Not sure']

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`Project inquiry: ${form.projectType || 'AI / web'}`)
  const body = encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\nProject: ${form.projectType}\nBudget: ${form.budget}\n\n${form.message}`,
  )
  return `mailto:${site.email}?subject=${subject}&body=${body}`
})

async function submit() {
  if (status.value === 'sending') return

  errors.value = validateContact(form)
  if (Object.keys(errors.value).length > 0) return
  if (!endpoint.value) return

  status.value = 'sending'

  try {
    await $fetch(endpoint.value, {
      method: 'POST',
      body: { ...form, _gotcha: gotcha.value },
      headers: { Accept: 'application/json' },
    })
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="rounded-2xl border border-line/60 bg-surface/30 p-6 md:p-8">
    <div
      v-if="status === 'success'"
      class="rounded-xl border border-terminal/40 bg-terminal/10 p-5"
      role="status"
    >
      <p class="font-display text-2xl text-bone">Thanks — I'll reply within 1–2 business days.</p>
      <p class="mt-2 text-sm text-muted">
        If you'd rather email directly, use
        <a :href="`mailto:${site.email}`" class="text-terminal underline">{{ site.email }}</a>.
      </p>
    </div>

    <form v-else class="space-y-5" novalidate @submit.prevent="submit">
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="name" class="font-mono text-xs uppercase tracking-widest text-muted">Name</label>
          <input
            id="name"
            v-model="form.name"
            name="name"
            type="text"
            autocomplete="name"
            :aria-invalid="Boolean(errors.name)"
            :aria-describedby="errors.name ? 'name-error' : undefined"
            class="mt-2 w-full rounded-xl border border-line/60 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-terminal"
          />
          <p v-if="errors.name" id="name-error" class="mt-1 font-mono text-xs text-magenta">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label for="email" class="font-mono text-xs uppercase tracking-widest text-muted">Email</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            :aria-invalid="Boolean(errors.email)"
            :aria-describedby="errors.email ? 'email-error' : undefined"
            class="mt-2 w-full rounded-xl border border-line/60 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-terminal"
          />
          <p v-if="errors.email" id="email-error" class="mt-1 font-mono text-xs text-magenta">
            {{ errors.email }}
          </p>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="projectType" class="font-mono text-xs uppercase tracking-widest text-muted">
            Project type
          </label>
          <select
            id="projectType"
            v-model="form.projectType"
            name="projectType"
            :aria-invalid="Boolean(errors.projectType)"
            :aria-describedby="errors.projectType ? 'project-type-error' : undefined"
            class="mt-2 w-full rounded-xl border border-line/60 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-terminal"
          >
            <option value="">Select one</option>
            <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <p v-if="errors.projectType" id="project-type-error" class="mt-1 font-mono text-xs text-magenta">
            {{ errors.projectType }}
          </p>
        </div>

        <div>
          <label for="budget" class="font-mono text-xs uppercase tracking-widest text-muted">
            Budget <span class="normal-case">(optional)</span>
          </label>
          <select
            id="budget"
            v-model="form.budget"
            name="budget"
            class="mt-2 w-full rounded-xl border border-line/60 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-terminal"
          >
            <option value="">Select a range</option>
            <option v-for="range in budgets" :key="range" :value="range">{{ range }}</option>
          </select>
        </div>
      </div>

      <div>
        <label for="message" class="font-mono text-xs uppercase tracking-widest text-muted">
          What are you trying to build?
        </label>
        <textarea
          id="message"
          v-model="form.message"
          name="message"
          rows="5"
          :aria-invalid="Boolean(errors.message)"
          :aria-describedby="errors.message ? 'message-error' : undefined"
          class="mt-2 w-full rounded-xl border border-line/60 bg-ink px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-terminal"
        />
        <p v-if="errors.message" id="message-error" class="mt-1 font-mono text-xs text-magenta">
          {{ errors.message }}
        </p>
      </div>

      <div>
        <label class="flex items-start gap-3 text-sm text-muted">
          <input
            v-model="form.consent"
            name="consent"
            type="checkbox"
            :aria-invalid="Boolean(errors.consent)"
            :aria-describedby="errors.consent ? 'consent-error' : undefined"
            class="mt-1 h-4 w-4 rounded border-line bg-ink"
          />
          <span>
            I agree to the
            <NuxtLink to="/privacy" class="text-terminal underline">privacy notice</NuxtLink>
            and to being contacted about this inquiry.
          </span>
        </label>
        <p v-if="errors.consent" id="consent-error" class="mt-1 font-mono text-xs text-magenta">
          {{ errors.consent }}
        </p>
      </div>

      <input
        v-model="gotcha"
        type="text"
        name="_gotcha"
        class="hidden"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />

      <p v-if="!endpoint" class="rounded-xl border border-line/60 bg-ink p-4 font-mono text-xs leading-relaxed text-muted">
        The form endpoint is not configured yet. Email
        <a :href="mailtoHref" class="text-terminal underline">{{ site.email }}</a>
        directly and I'll reply within 1–2 business days.
      </p>

      <a
        v-if="!endpoint"
        :href="mailtoHref"
        data-testid="contact-mailto"
        class="inline-flex items-center rounded-full bg-terminal px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
      >
        Send via email
      </a>
      <button
        v-else
        type="submit"
        :disabled="status === 'sending'"
        class="inline-flex items-center rounded-full bg-terminal px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ status === 'sending' ? 'Sending…' : 'Send inquiry' }}
      </button>

      <p v-if="status === 'error'" role="alert" class="font-mono text-xs text-magenta">
        Something went wrong. Email
        <a :href="`mailto:${site.email}`" class="underline">{{ site.email }}</a>
        instead.
      </p>
    </form>
  </div>
</template>
