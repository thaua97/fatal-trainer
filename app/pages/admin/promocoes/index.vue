<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-only',
})

useSeoMeta({ title: 'Promoções — Admin Fatal Trainer' })
</script>

<template>
  <FTAdminShell title="Promoções">
    <FTAdminPromotionsTable />
  </FTAdminShell>
</template>
