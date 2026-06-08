<template>
  <UApp :toaster="{ position: 'top-right' }">
    <FTImpersonationBanner />
    <FTProfileCompletionPrompt />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
