<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerInfoPayload } from '#shared/domain/catalog/entities/trainer-profile-payloads'

const form = defineModel<TrainerInfoPayload>('form', { required: true })

defineProps<{
  trainer: PersonalTrainer
  fieldErrors: Partial<Record<string, string | undefined>>
}>()

const { t } = useI18n()
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
        <FTPhoneInput
          v-model="form.contactPhone"
          :placeholder="t('dashboard.info.placeholders.contactPhone')"
          test-id="trainer-info-phone"
        />
      </UFormField>

      <FTCityPicker
        v-model:city="form.city"
        v-model:state="form.state"
        test-id="trainer-info-city"
        :error="fieldErrors.city || fieldErrors.state"
      />
    </div>
  </FTProfileSection>
</template>
