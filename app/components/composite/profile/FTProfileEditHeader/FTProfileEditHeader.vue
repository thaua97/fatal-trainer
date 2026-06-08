<script setup lang="ts">
import type { PersonalTrainer } from "#shared/domain/catalog/entities/personal-trainer";

const props = defineProps<{
  trainer: PersonalTrainer;
}>();

const trainerRef = toRef(props, "trainer");
const { t } = useI18n();
const { textareaUi, selectUi, inputNumberUi } =
  useFTFormFieldUi();
const { specialtyItems } = useFTTrainerFieldOptions();

const {
  form,
  errors,
  errorMessage,
  pending: infoPending,
  handleSubmit: handleInfoSubmit,
} = useFTTrainerInfoForm(trainerRef);

const { uploadPending, uploadCoverPhoto } =
  useFTTrainerGalleryManager(trainerRef);

const fieldErrors = computed(() => ({
  name: errorMessage('name', errors.value.name),
  profession: errorMessage('profession', errors.value.profession),
  contactPhone: errorMessage('contactPhone', errors.value.contactPhone),
  city: errorMessage('city', errors.value.city),
  state: errorMessage('state', errors.value.state),
  description: errorMessage('description', errors.value.description),
  specialties: errorMessage('specialties', errors.value.specialties),
  cref: errorMessage('cref', errors.value.cref),
  availability: errorMessage('availability', errors.value.availability),
  experienceYears: errorMessage('experienceYears', errors.value.experienceYears),
}));

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
        >
          <FTCrefInput
            v-model="form.cref"
            :placeholder="t('dashboard.edit.crefPlaceholder')"
            test-id="trainer-info-cref"
          />
        </UFormField>
      </FTProfileSection>

      <FTProfileSection :title="t('dashboard.edit.availabilityTitle')">
        <FTAvailabilityPicker
          v-model="form.availability"
        />
      </FTProfileSection>

      <FTProfileSection :title="t('dashboard.edit.experienceTitle')">
        <UFormField
          class="w-full"
          :label="t('dashboard.info.fields.experienceYears')"
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
      <FTTrainerPromotionPicker :trainer="trainer" />
    </FTProfileSection>
  </div>
</template>
