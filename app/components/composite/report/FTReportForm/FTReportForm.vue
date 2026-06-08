<script setup lang="ts">
const {
  form,
  errors,
  errorMessage,
  typeItems,
  pending,
  handleSubmit,
} = useFTReportForm()

const { t } = useI18n()

const { fieldUi, textareaUi, selectUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <div
    class="w-full"
    data-testid="report-form"
  >
    <form
      class="flex w-full flex-col gap-5"
      data-testid="report-form-fields"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        class="w-full"
        :label="t('report.fields.type')"
        :error="errorMessage('type', errors.type)"
        required
      >
        <USelect
          v-model="form.type"
          class="w-full"
          :items="typeItems"
          :placeholder="t('report.placeholders.type')"
          data-testid="report-type-select"
          :ui="selectUi"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('report.fields.occurredAt')"
        :error="errorMessage('occurredAt', errors.occurredAt)"
        required
      >
        <FTDatePicker
          v-model="form.occurredAt"
          test-id="report-date-picker"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('report.fields.trainer')"
        :error="errorMessage('trainerId', errors.trainerId)"
        required
      >
        <FTTrainerSelectMenu v-model="form.trainerId" />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('report.fields.description')"
        :hint="t('report.hints.description')"
        :error="errorMessage('description', errors.description)"
        required
      >
        <UTextarea
          v-model="form.description"
          class="w-full"
          :rows="5"
          :placeholder="t('report.placeholders.description')"
          data-testid="report-description"
          :ui="textareaUi"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('report.fields.contactEmail')"
        :error="errorMessage('contactEmail', errors.contactEmail)"
        required
      >
        <UInput
          v-model="form.contactEmail"
          class="w-full"
          type="email"
          autocomplete="email"
          :placeholder="t('report.placeholders.contactEmail')"
          data-testid="report-email-input"
          :ui="fieldUi"
          :size="inputSize"
        />
        <p class="text-xs mt-2 text-slate-500">
          {{ t('report.hints.contactEmail') }}
        </p>
      </UFormField>

      <div class="pt-2">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          class="rounded-full font-semibold"
          :loading="pending"
          data-testid="report-submit-button"
        >
          {{ pending ? t('report.submitting') : t('report.submit') }}
        </UButton>
      </div>
    </form>
  </div>
</template>
