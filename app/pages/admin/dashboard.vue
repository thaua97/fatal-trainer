<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-only',
})

await navigateTo('/admin/usuarios')
</script>

<template>
  <div />
</template>
