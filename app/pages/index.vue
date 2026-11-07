<script setup lang="ts">
import { services } from '~/data/services'
</script>

<template>
  <div>
    <HeroSection />
    <ProofStrip />
    <ServicesSection :services="services" />
    <SecuritySection />
    <AboutSection />
  </div>
</template>
