<script setup lang="ts">
export type FTProfileHireUnavailableReason = 'inactive' | 'noPhone'

defineProps<{
  label: string
  testId: string
  unavailableReason: FTProfileHireUnavailableReason | null
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <UAlert
    v-if="unavailableReason === 'inactive'"
    color="neutral"
    variant="subtle"
    icon="i-lucide-user-x"
    :title="$t('profile.hireUnavailable.inactiveTitle')"
    :description="$t('profile.hireUnavailable.inactiveDescription')"
    class="rounded-2xl"
    :data-testid="`${testId}-inactive-alert`"
  />

  <UAlert
    v-else-if="unavailableReason === 'noPhone'"
    color="warning"
    variant="subtle"
    icon="i-lucide-phone-off"
    :title="$t('profile.hireUnavailable.noPhoneTitle')"
    :description="$t('profile.hireUnavailable.noPhoneDescription')"
    class="rounded-2xl"
    :data-testid="`${testId}-no-phone-alert`"
  />

  <FTProfileHireButton
    v-else
    :label="label"
    :test-id="testId"
    @click="$emit('click')"
  />
</template>
