<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerInfoPayload } from '#shared/domain/catalog/entities/trainer-profile-payloads'

defineProps<{
  trainer: PersonalTrainer
  form: TrainerInfoPayload
  fieldErrors: Partial<Record<string, string | undefined>>
}>()

const { t } = useI18n()
const { fieldUi } = useFTProfileEditFieldUi()
</script>

<template>
  <FTProfileSection
    :title="t('dashboard.edit.locationTitle')"
    test-id="profile-edit-location"
    :bordered="false"
  >
    <div class="w-full space-y-4">
      <UFormField
        class="w-full"
        :label="t('dashboard.info.fields.contactPhone')"
        :error="fieldErrors.contactPhone"
      >
        <UInput
          v-model="form.contactPhone"
          class="w-full"
          type="tel"
          :placeholder="t('dashboard.info.placeholders.contactPhone')"
          :ui="fieldUi"
          data-testid="trainer-info-phone"
        />
      </UFormField>

      <FTCityPicker
        v-model:city="form.city"
        v-model:state="form.state"
        :error="fieldErrors.city || fieldErrors.state"
      />
    </div>
  </FTProfileSection>
</template>
