<script setup lang="ts">
const { homeTo } = useFTAppHeader()
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
      <NuxtLink
        :to="homeTo"
        class="text-lg font-bold"
        data-testid="app-header-logo"
      >
        <span class="text-violet-600">Fatal</span><span class="text-slate-900">Trainer</span>
      </NuxtLink>

      <FTLocaleSwitcher />
    </div>
  </header>
</template>
