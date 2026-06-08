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
  pending,
  handleSubmit,
} = useFTTrainerInfoForm(trainerRef)

const { t } = useI18n()

const { fieldUi, selectUi, inputNumberUi, inputSize, textareaUi } = useFTFormFieldUi()
</script>

<template>
  <div data-testid="trainer-info-form">
    <form
      class="flex flex-col gap-5"
      data-testid="trainer-info-form-fields"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField
          class="w-full sm:col-span-2"
          :label="t('dashboard.info.fields.name')"
          required
        >
          <UInput
            v-model="form.name"
            class="w-full"
            :ui="fieldUi"
            :size="inputSize"
            data-testid="trainer-info-name"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.contactPhone')"
          required
        >
          <FTPhoneInput
            v-model="form.contactPhone"
            :placeholder="t('dashboard.info.placeholders.contactPhone')"
            test-id="trainer-info-phone"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.servicePrice')"
          required
        >
          <UInput
            v-model.number="form.servicePrice"
            class="w-full"
            type="number"
            min="1"
            step="1"
            :ui="fieldUi"
            :size="inputSize"
            data-testid="trainer-info-price"
          />
        </UFormField>

        <UFormField
          class="w-full sm:col-span-2"
          :label="t('dashboard.info.fields.profession')"
          required
        >
          <UInput
            v-model="form.profession"
            class="w-full"
            :ui="fieldUi"
            :size="inputSize"
            data-testid="trainer-info-profession"
          />
        </UFormField>

        <UFormField
          class="w-full sm:col-span-2"
          :label="t('dashboard.info.fields.description')"
          :hint="t('dashboard.info.hints.description')"
          required
        >
          <UTextarea
            v-model="form.description"
            class="w-full"
            :rows="4"
            :ui="textareaUi"
            data-testid="trainer-info-description"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.specialties')"
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
            test-id="trainer-info-city"
          />
        </div>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.cref')"
          required
        >
          <FTCrefInput
            v-model="form.cref"
            test-id="trainer-info-cref"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.experienceYears')"
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
