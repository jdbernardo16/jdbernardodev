<script setup lang="ts">
import { services } from '~/data/services'
import { workStudies } from '~/data/work'
</script>

<template>
  <div>
    <HeroSection />
    <ProofStrip />
    <ServicesSection :services="services" />
    <WorkSection :studies="workStudies" />
    <SecuritySection />
    <AboutSection />
  </div>
</template>
