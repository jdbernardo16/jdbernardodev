<template>
  <section id="security" class="border-b border-line/40 bg-surface/20" data-reveal>
    <div class="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
      <div class="md:col-span-5">
        <SectionHeading
          eyebrow="Security"
          title="I build AI systems — and I harden them."
          description="Most AI freelancers can ship a demo. Most pentesters can find a flaw. I do both."
        />
      </div>

      <div class="space-y-6 md:col-span-7">
        <article class="rounded-2xl border border-line/60 bg-ink p-6">
          <p class="font-mono text-xs uppercase tracking-widest text-terminal">
            Incident response
          </p>
          <h3 class="mt-3 font-display text-2xl text-bone">
            Live SQL injection breach, contained.
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-muted">
            Detected and remediated a live SQL injection breach through a contact form on a
            government agency website. I traced the entry point, contained the access,
            secured the server, and closed the vulnerability. Agency names are withheld.
          </p>
        </article>

        <article class="rounded-2xl border border-line/60 bg-ink p-6">
          <p class="font-mono text-xs uppercase tracking-widest text-terminal">
            VAPT
          </p>
          <h3 class="mt-3 font-display text-2xl text-bone">
            Scoped assessment and penetration testing.
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-muted">
            Formal VAPT engagements with scanning, exploitation attempts, written findings,
            and remediation guidance — so the fix is as clear as the risk.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
