<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = withDefaults(defineProps<{
  trainer: PersonalTrainer | null
  variant?: 'default' | 'profile'
}>(), {
  variant: 'default',
})

const trainerRef = toRef(props, 'trainer')
const {
  gallery,
  displayGallery,
  photoUrl,
  canUpload,
  uploadPending,
  deletePending,
  coverPending,
  removeImage,
  setCover,
  onFileInputChange,
} = useFTTrainerGalleryManager(trainerRef)

const { t } = useI18n()
const fileInputRef = ref<HTMLInputElement | null>(null)

function openFilePicker() {
  fileInputRef.value?.click()
}
</script>

<template>
  <div data-testid="trainer-gallery-manager">
    <div
      v-if="gallery.length === 0"
      class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/30 px-6 py-14 text-center"
      data-testid="trainer-gallery-empty"
    >
      <UIcon
        name="i-lucide-image-plus"
        class="mb-3 size-10 text-violet-400"
        aria-hidden="true"
      />
      <p class="text-sm font-medium text-slate-700">
        {{ t('dashboard.gallery.emptyTitle') }}
      </p>
      <p class="mt-1 max-w-sm text-sm text-slate-500">
        {{ t('dashboard.gallery.emptyDescription') }}
      </p>
    </div>

    <div
      v-else
      class="grid gap-2 sm:grid-cols-3"
      :class="variant === 'profile' ? 'grid-cols-2' : 'grid-cols-2 gap-3 md:grid-cols-3'"
      data-testid="trainer-gallery-grid"
    >
      <div
        v-for="(image, index) in displayGallery"
        :key="`${gallery[index]}-${index}`"
        class="group relative overflow-hidden bg-slate-50"
        :class="variant === 'profile' ? 'aspect-square rounded-lg' : 'aspect-4/3 rounded-2xl border border-slate-100'"
      >
        <img
          v-if="variant === 'profile'"
          :src="image"
          :alt="t('dashboard.gallery.imageAlt', { index: index + 1 })"
          class="size-full object-cover"
        >
        <img
          v-else
          :src="image"
          :alt="t('dashboard.gallery.imageAlt', { index: index + 1 })"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        >

        <div
          class="absolute inset-0 flex items-end justify-between gap-2 bg-linear-to-t from-slate-900/70 via-slate-900/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <UButton
            v-if="photoUrl !== gallery[index]"
            size="xs"
            color="neutral"
            variant="solid"
            class="rounded-full"
            :loading="coverPending"
            data-testid="trainer-gallery-set-cover"
            @click="setCover(gallery[index]!)"
          >
            {{ t('dashboard.gallery.setCover') }}
          </UButton>
          <span
            v-else
            class="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
          >
            {{ t('dashboard.gallery.coverBadge') }}
          </span>

          <UButton
            size="xs"
            color="error"
            variant="solid"
            icon="i-lucide-trash-2"
            class="rounded-full"
            :loading="deletePending"
            :aria-label="t('dashboard.gallery.remove')"
            data-testid="trainer-gallery-remove"
            @click="removeImage(index)"
          />
        </div>
      </div>
    </div>

    <div class="mt-6">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="sr-only"
        data-testid="trainer-gallery-file-input"
        @change="onFileInputChange"
      >

      <UButton
        color="primary"
        :variant="variant === 'profile' ? 'outline' : 'soft'"
        size="lg"
        block
        class="rounded-full font-semibold"
        icon="i-lucide-upload"
        :loading="uploadPending"
        :disabled="!canUpload"
        data-testid="trainer-gallery-upload"
        @click="openFilePicker"
      >
        {{ canUpload ? t('dashboard.gallery.upload') : t('dashboard.gallery.limitReached') }}
      </UButton>

      <p class="mt-2 text-center text-xs text-slate-500">
        {{ t('dashboard.gallery.uploadHint') }}
      </p>
    </div>
  </div>
</template>
