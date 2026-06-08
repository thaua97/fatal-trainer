<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-only',
})

useSeoMeta({ title: 'Usuários — Admin Fatal Trainer' })
</script>

<template>
  <FTAdminShell title="Usuários">
    <FTAdminUsersTable />
  </FTAdminShell>
</template>
