<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const trainerRef = toRef(props, 'trainer')

const {
  modalOpen,
  showContactCta,
  showLoginCta,
  loginPath,
  canContact,
  handleContact,
} = useProfileHireModal(trainerRef)
</script>

<template>
  <FTModal
    v-model:open="modalOpen"
    compact-on-mobile
    :tile="$t('hireModal.tile')"
    :title="$t('hireModal.title')"
    :subtitle="$t('hireModal.subtitle')"
    test-id="hire-trainer-modal"
    title-id="hire-trainer-modal-title"
    :dismissible="true"
  >
    <div class="flex w-full flex-col gap-3">
      <UButton
        v-if="showContactCta"
        type="button"
        color="success"
        size="xl"
        class="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold lg:min-h-20 lg:gap-3 lg:px-10 lg:py-5 lg:text-lg"
        data-testid="hire-modal-contact"
        :disabled="!canContact"
        :aria-describedby="'hire-trainer-modal-title'"
        @click="handleContact"
      >
        <UIcon name="i-lucide-message-circle" class="size-5 shrink-0 text-white lg:size-6" />
        {{ $t('hireModal.contact') }}
      </UButton>

      <UButton
        v-if="showLoginCta"
        :to="loginPath"
        color="primary"
        variant="outline"
        class="w-full justify-center rounded-full px-5 py-2.5 text-sm font-bold lg:px-6 lg:py-3 lg:text-base"
        data-testid="hire-modal-login"
        :aria-describedby="'hire-trainer-modal-title'"
      >
        {{ $t('hireModal.login') }}
      </UButton>
    </div>
  </FTModal>
</template>
