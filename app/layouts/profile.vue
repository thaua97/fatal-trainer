<template>
  <div class="min-h-screen bg-white">
    <header class="sticky top-0 z-50 border-b border-slate-100 bg-white lg:block">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink
          to="/"
          class="text-lg font-bold"
        >
          <span class="text-violet-600">Fatal</span><span class="text-slate-900">Trainer</span>
        </NuxtLink>

        <FTLocaleSwitcher />
      </div>
    </header>
    <main class="mx-auto max-w-7xl lg:px-6 lg:py-8 xl:px-8">
      <slot />
    </main>
  </div>
</template>
