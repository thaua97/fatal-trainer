<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  fallbackTo?: string
}>(), {
  fallbackTo: '/personal-trainers',
  label: undefined,
})

const { t } = useI18n()

const linkLabel = computed(() => props.label ?? t('profile.backToCatalog'))

const router = useRouter()

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back()
  }
  else {
    navigateTo(props.fallbackTo)
  }
}
</script>

<template>
  <UButton
    variant="ghost"
    size="sm"
    class="rounded-full"
    data-testid="back-link"
    @click="goBack"
  >
    <UIcon
      name="i-lucide-arrow-left"
      class="size-4"
    />
    {{ linkLabel }}
  </UButton>
</template>
