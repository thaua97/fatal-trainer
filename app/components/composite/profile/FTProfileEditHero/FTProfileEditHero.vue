<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerInfoPayload, TrainerInfoValidationErrors } from '#shared/domain/catalog/entities/trainer-profile-payloads'

const props = defineProps<{
  trainer: PersonalTrainer
  form: TrainerInfoPayload
  fieldErrors: Partial<Record<keyof TrainerInfoValidationErrors, string | undefined>>
  photoUploadPending?: boolean
}>()

const emit = defineEmits<{
  changePhoto: [event: Event]
}>()

const { t } = useI18n()
const { professionUi, nameUi, selectUi, inputSize } = useFTFormFieldUi()

const { modalityItems } = useFTTrainerFieldOptions()

const previewTrainer = computed(() => ({
  ...props.trainer,
  name: props.form.name || props.trainer.name,
  photoUrl: props.trainer.photoUrl,
}))

const fileInputRef = ref<HTMLInputElement | null>(null)

function openPhotoPicker() {
  fileInputRef.value?.click()
}

function onPhotoSelected(event: Event) {
  emit('changePhoto', event)
}
</script>

<template>
  <div data-testid="profile-edit-hero">
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="sr-only"
      data-testid="profile-edit-photo-input"
      @change="onPhotoSelected"
    >

    <!-- Mobile -->
    <div class="relative lg:hidden">
      <div class="group relative h-80 overflow-hidden">
        <FTAvatar
          :src="previewTrainer.photoUrl"
          :name="previewTrainer.name"
          size="hero"
          :monochrome="false"
        />
        <button
          type="button"
          class="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors group-hover:bg-slate-900/40 group-focus-within:bg-slate-900/40"
          :aria-label="t('dashboard.edit.changePhoto')"
          data-testid="profile-edit-change-photo-mobile"
          @click="openPhotoPicker"
        >
          <span
            class="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <UIcon
              name="i-lucide-camera"
              class="size-4"
              aria-hidden="true"
            />
            {{ photoUploadPending ? t('dashboard.edit.uploadingPhoto') : t('dashboard.edit.changePhoto') }}
          </span>
        </button>
        <FTIconButton
          to="/"
          class="absolute left-4 top-4"
          :ariaLabel="t('dashboard.edit.back')"
        >
          <UIcon name="i-lucide-arrow-left" class="size-5 text-slate-900" />
        </FTIconButton>
        <FTIconButton
          v-if="trainer.id"
          :to="`/personal-trainers/${trainer.id}`"
          class="absolute right-4 top-4"
          :ariaLabel="t('dashboard.edit.viewPublic')"
        >
          <UIcon name="i-lucide-external-link" class="size-5 text-slate-900" />
        </FTIconButton>
      </div>

      <div :class="[$style.sheetTop, 'relative -mt-10 space-y-4 px-5 pb-6 pt-5']">
        <UFormField
          :label="t('dashboard.info.fields.profession')"
          :error="fieldErrors.profession"
          class="w-full"
        >
          <UInput
            v-model="form.profession"
            class="w-full"
            :placeholder="t('dashboard.info.fields.profession')"
            :ui="professionUi"
            :size="inputSize"
            data-testid="trainer-info-profession"
          />
        </UFormField>

        <UFormField
          :label="t('dashboard.info.fields.name')"
          :error="fieldErrors.name"
          class="w-full"
        >
          <UInput
            v-model="form.name"
            class="w-full"
            :placeholder="t('dashboard.info.fields.name')"
            :ui="nameUi"
            :size="inputSize"
            data-testid="trainer-info-name"
          />
        </UFormField>

        <UFormField
          :label="t('dashboard.info.fields.modalities')"
          :error="fieldErrors.modalities"
          class="w-full"
        >
          <USelect
            v-model="form.modalities"
            class="w-full"
            multiple
            :items="modalityItems"
            :placeholder="t('dashboard.info.fields.modalities')"
            :ui="selectUi"
            data-testid="trainer-info-modalities"
          />
        </UFormField>

        <FTProfileEditPricing
          v-model:service-price="form.servicePrice"
          :error="fieldErrors.servicePrice"
        />
      </div>
    </div>

    <!-- Desktop -->
    <header class="hidden gap-8 lg:flex lg:flex-row lg:items-start">
      <div class="group relative shrink-0">
        <FTAvatar
          :src="previewTrainer.photoUrl"
          :name="previewTrainer.name"
          size="xl"
          :monochrome="false"
        />
        <button
          type="button"
          class="absolute inset-0 flex items-center justify-center rounded-3xl bg-slate-900/0 transition-colors group-hover:bg-slate-900/45"
          :aria-label="t('dashboard.edit.changePhoto')"
          data-testid="profile-edit-change-photo-desktop"
          @click="openPhotoPicker"
        >
          <span class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <UIcon name="i-lucide-camera" class="size-4" aria-hidden="true" />
            {{ t('dashboard.edit.changePhoto') }}
          </span>
        </button>
      </div>

      <div class="min-w-0 flex-1 space-y-4 pt-2">
        <div class="mb-1 flex gap-2">
          <FTIconButton
            to="/"
            :ariaLabel="t('dashboard.edit.back')"
          >
            <UIcon name="i-lucide-arrow-left" class="size-5 text-slate-900" />
          </FTIconButton>
          <FTIconButton
            v-if="trainer.id"
            :to="`/personal-trainers/${trainer.id}`"
            :ariaLabel="t('dashboard.edit.viewPublic')"
          >
            <UIcon name="i-lucide-external-link" class="size-5 text-slate-900" />
          </FTIconButton>
        </div>

        <div class="w-full space-y-4">
          <UFormField
            class="w-full"
            :label="t('dashboard.info.fields.profession')"
            :error="fieldErrors.profession"
          >
            <UInput
              v-model="form.profession"
              class="w-full"
              :placeholder="t('dashboard.info.fields.profession')"
              :ui="professionUi"
              :size="inputSize"
            />
          </UFormField>

          <UFormField
            class="w-full"
            :label="t('dashboard.info.fields.name')"
            :error="fieldErrors.name"
          >
            <UInput
              v-model="form.name"
              class="w-full"
              :placeholder="t('dashboard.info.fields.name')"
              :ui="nameUi"
              :size="inputSize"
            />
          </UFormField>

          <UFormField
            class="w-full"
            :label="t('dashboard.info.fields.modalities')"
            :error="fieldErrors.modalities"
          >
            <USelect
              v-model="form.modalities"
              class="w-full"
              multiple
              :items="modalityItems"
              :placeholder="t('dashboard.info.fields.modalities')"
              :ui="selectUi"
            />
          </UFormField>

          <FTProfileEditPricing
            v-model:service-price="form.servicePrice"
            :error="fieldErrors.servicePrice"
          />
        </div>
      </div>
    </header>
  </div>
</template>

<style module>
.sheetTop {
  background: #fff;
  border-radius: 1.5rem 1.5rem 0 0;
}
</style>
