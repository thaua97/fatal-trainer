<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer | null
}>()

const trainerRef = toRef(props, 'trainer')
const {
  form,
  specialtyItems,
  modalityItems,
  fieldErrors,
  pending,
  success,
  submitError,
  handleSubmit,
} = useFTTrainerInfoForm(trainerRef)

const { t } = useI18n()

const { fieldUi, selectUi, inputNumberUi } = useFTProfileEditFieldUi()
</script>

<template>
  <div data-testid="trainer-info-form">
    <UAlert
      v-if="success"
      color="success"
      variant="subtle"
      icon="i-lucide-circle-check"
      :title="t('dashboard.info.success')"
      class="mb-6 rounded-2xl"
      data-testid="trainer-info-success"
    />

    <UAlert
      v-else-if="submitError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('dashboard.info.errors.submitFailed')"
      class="mb-6 rounded-2xl"
      data-testid="trainer-info-error"
    />

    <form
      class="flex flex-col gap-5"
      data-testid="trainer-info-form-fields"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField
          class="w-full sm:col-span-2"
          :label="t('dashboard.info.fields.name')"
          :error="fieldErrors.name"
          required
        >
          <UInput
            v-model="form.name"
            class="w-full"
            :ui="fieldUi"
            data-testid="trainer-info-name"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.contactPhone')"
          :error="fieldErrors.contactPhone"
          required
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

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.servicePrice')"
          :error="fieldErrors.servicePrice"
          required
        >
          <UInput
            v-model.number="form.servicePrice"
            class="w-full"
            type="number"
            min="1"
            step="1"
            :ui="fieldUi"
            data-testid="trainer-info-price"
          />
        </UFormField>

        <UFormField
          class="w-full sm:col-span-2"
          :label="t('dashboard.info.fields.profession')"
          :error="fieldErrors.profession"
          required
        >
          <UInput
            v-model="form.profession"
            class="w-full"
            :ui="fieldUi"
            data-testid="trainer-info-profession"
          />
        </UFormField>

        <UFormField
          class="w-full sm:col-span-2"
          :label="t('dashboard.info.fields.description')"
          :error="fieldErrors.description"
          :hint="t('dashboard.info.hints.description')"
          required
        >
          <UTextarea
            v-model="form.description"
            class="w-full"
            :rows="4"
            :ui="fieldUi"
            data-testid="trainer-info-description"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.specialties')"
          :error="fieldErrors.specialties"
          required
        >
          <USelect
            v-model="form.specialties"
            class="w-full"
            multiple
            :items="specialtyItems"
            :ui="selectUi"
            data-testid="trainer-info-specialties"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.modalities')"
          :error="fieldErrors.modalities"
          required
        >
          <USelect
            v-model="form.modalities"
            class="w-full"
            multiple
            :items="modalityItems"
            :ui="selectUi"
            data-testid="trainer-info-modalities"
          />
        </UFormField>

        <div class="w-full sm:col-span-2">
          <FTCityPicker
            v-model:city="form.city"
            v-model:state="form.state"
            :error="fieldErrors.city || fieldErrors.state"
          />
        </div>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.cref')"
          :error="fieldErrors.cref"
          required
        >
          <UInput
            v-model="form.cref"
            class="w-full"
            :ui="fieldUi"
            data-testid="trainer-info-cref"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.experienceYears')"
          :error="fieldErrors.experienceYears"
          required
        >
          <UInputNumber
            v-model="form.experienceYears"
            class="w-full"
            :min="0"
            :max="60"
            :step="1"
            :ui="inputNumberUi"
            data-testid="trainer-info-experience"
          />
        </UFormField>

        <div class="w-full sm:col-span-2">
          <FTAvailabilityPicker
            v-model="form.availability"
            :error="fieldErrors.availability"
          />
        </div>
      </div>

      <div class="pt-2">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          class="rounded-full font-semibold"
          :loading="pending"
          data-testid="trainer-info-submit"
        >
          {{ pending ? t('dashboard.info.submitting') : t('dashboard.info.submit') }}
        </UButton>
      </div>
    </form>
  </div>
</template>
