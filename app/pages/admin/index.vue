<script setup lang="ts">
definePageMeta({
  layout: 'admin-auth',
  middleware: 'admin-guest',
})

useSeoMeta({ title: 'Admin — Fatal Trainer' })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-violet-500/5">
      <div class="mb-8 text-center">
        <div class="mb-4 flex justify-center">
          <FTLogo size="lg" />
        </div>
        <h1 class="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Painel Admin
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Acesso restrito à equipe Fatal Trainer
        </p>
      </div>

      <FTAdminLoginForm />
    </div>
  </div>
</template>
