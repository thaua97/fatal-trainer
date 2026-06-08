<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-only',
})

useSeoMeta({ title: 'Denúncias — Admin Fatal Trainer' })
</script>

<template>
  <FTAdminShell title="Denúncias">
    <FTAdminReportsTable />
  </FTAdminShell>
</template>
