<script setup lang="ts">
const { isActive, impersonatedName, exitImpersonation } = useImpersonation()
const exiting = ref(false)

async function handleExit() {
  exiting.value = true
  try {
    await exitImpersonation()
  } finally {
    exiting.value = false
  }
}
</script>

<template>
  <div
    v-if="isActive"
    class="relativeinset-x-0 top-0 flex items-center justify-center gap-4 bg-violet-700 px-4 py-2.5 text-sm text-white shadow-lg"
    data-testid="impersonation-banner"
  >
    <UIcon
      name="i-lucide-user-check"
      class="size-4 shrink-0"
    />
    <span>
      Você está acessando como <strong>{{ impersonatedName }}</strong>
    </span>
    <UButton
      size="xs"
      color="neutral"
      variant="solid"
      class="rounded-full bg-white/15 text-white hover:bg-white/25"
      :loading="exiting"
      data-testid="impersonation-exit"
      @click="handleExit"
    >
      Voltar ao admin
    </UButton>
  </div>
</template>
