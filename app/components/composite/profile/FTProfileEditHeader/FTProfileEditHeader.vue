<script setup lang="ts">
import type { PersonalTrainer } from "#shared/domain/catalog/entities/personal-trainer";

const props = defineProps<{
  trainer: PersonalTrainer;
}>();

const trainerRef = toRef(props, "trainer");
const { t } = useI18n();
const { fieldUi, textareaUi, selectUi, inputNumberUi } =
  useFTProfileEditFieldUi();
const { specialtyItems } = useFTTrainerFieldOptions();

const {
  form,
  fieldErrors,
  pending: infoPending,
  success: infoSuccess,
  submitError: infoSubmitError,
  handleSubmit: handleInfoSubmit,
} = useFTTrainerInfoForm(trainerRef);

const { uploadPending, uploadCoverPhoto } =
  useFTTrainerGalleryManager(trainerRef);

async function handleHeroPhotoChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    await uploadCoverPhoto(file);
  }
  input.value = "";
}
</script>

<template>
  <div data-testid="profile-edit-header">
    <UAlert
      v-if="infoSuccess"
      color="success"
      variant="subtle"
      icon="i-lucide-circle-check"
      :title="t('dashboard.info.success')"
      class="mx-5 mb-4 rounded-2xl lg:mx-0"
      data-testid="trainer-info-success"
    />

    <UAlert
      v-else-if="infoSubmitError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('dashboard.info.errors.submitFailed')"
      class="mx-5 mb-4 rounded-2xl lg:mx-0"
      data-testid="trainer-info-error"
    />

    <form
      data-testid="trainer-info-form-fields"
      @submit.prevent="handleInfoSubmit"
    >
      <FTProfileEditHero
        :trainer="trainer"
        :form="form"
        :field-errors="fieldErrors"
        :photo-upload-pending="uploadPending"
        @change-photo="handleHeroPhotoChange"
      />

      <FTProfileEditLocationRow
        :trainer="trainer"
        :form="form"
        :field-errors="fieldErrors"
      />

      <FTProfileSection :title="t('profile.about')">
        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.description')"
          :hint="t('dashboard.info.hints.description')"
          :error="fieldErrors.description"
        >
          <UTextarea
            v-model="form.description"
            class="w-full"
            :rows="4"
            :placeholder="t('dashboard.info.hints.description')"
            :ui="textareaUi"
            data-testid="trainer-info-description"
          />
        </UFormField>
      </FTProfileSection>

      <FTProfileSection :title="t('profile.specialties')">
        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.specialties')"
          :error="fieldErrors.specialties"
        >
          <USelect
            v-model="form.specialties"
            class="w-full"
            multiple
            :items="specialtyItems"
            :placeholder="t('dashboard.info.fields.specialties')"
            :ui="selectUi"
            data-testid="trainer-info-specialties-section"
          />
        </UFormField>
      </FTProfileSection>

      <FTProfileSection :title="t('profile.certification')">
        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.cref')"
          :error="fieldErrors.cref"
        >
          <UInput
            v-model="form.cref"
            class="w-full"
            :placeholder="t('dashboard.edit.crefPlaceholder')"
            :ui="fieldUi"
            data-testid="trainer-info-cref"
          />
        </UFormField>
      </FTProfileSection>

      <FTProfileSection :title="t('dashboard.edit.availabilityTitle')">
        <FTAvailabilityPicker
          v-model="form.availability"
          :error="fieldErrors.availability"
        />
      </FTProfileSection>

      <FTProfileSection :title="t('dashboard.edit.experienceTitle')">
        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.experienceYears')"
          :error="fieldErrors.experienceYears"
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
      </FTProfileSection>

      <div class="px-5 py-6 lg:px-0">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          class="rounded-full font-semibold"
          :loading="infoPending"
          data-testid="trainer-info-submit"
        >
          {{
            infoPending
              ? t("dashboard.info.submitting")
              : t("dashboard.info.submit")
          }}
        </UButton>
      </div>
    </form>

    <FTProfileSection :title="t('dashboard.tabs.gallery')">
      <FTTrainerGalleryManager :trainer="trainer" variant="profile" />
    </FTProfileSection>

    <FTProfileSection :title="t('dashboard.tabs.promotion')">
      <FTTrainerPromotionForm :trainer="trainer" variant="profile" />
    </FTProfileSection>
  </div>
</template>
