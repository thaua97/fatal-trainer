import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { UploadGalleryResponse } from '#shared/types/api'

const MAX_GALLERY_IMAGES = 12

export function useFTTrainerGalleryManager(trainer: Ref<PersonalTrainer | null>) {
  const { setTrainer } = useMyTrainerProfile()
  const { t } = useI18n()

  const uploadPending = ref(false)
  const deletePending = ref(false)
  const coverPending = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const gallery = computed(() => trainer.value?.gallery ?? [])
  const photoUrl = computed(() => trainer.value?.photoUrl ?? '')
  const canUpload = computed(() => gallery.value.length < MAX_GALLERY_IMAGES)

  function resetStatus() {
    error.value = null
    success.value = false
  }

  async function uploadFile(file: File, options?: { setAsCover?: boolean }) {
    if (!trainer.value || !canUpload.value) {
      return null
    }

    resetStatus()
    uploadPending.value = true

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch<UploadGalleryResponse>('/api/personal-trainers/me/gallery', {
        method: 'POST',
        body: formData,
      })

      if (trainer.value) {
        setTrainer({
          ...trainer.value,
          gallery: response.gallery,
          photoUrl: options?.setAsCover ? response.url : (trainer.value.photoUrl || response.url),
        })
      }

      if (options?.setAsCover) {
        const coverResponse = await $fetch<{ trainer: PersonalTrainer }>('/api/personal-trainers/me/gallery/cover', {
          method: 'PATCH',
          body: { url: response.url },
        })
        setTrainer(coverResponse.trainer)
      }

      success.value = true
      return response.url
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const data = (err as { data?: { errors?: Record<string, string> } }).data
        const code = data?.errors?.file ?? data?.errors?.gallery
        error.value = code ? t(`dashboard.gallery.errors.${code}`) : t('dashboard.gallery.errors.uploadFailed')
      } else {
        error.value = t('dashboard.gallery.errors.uploadFailed')
      }
      return null
    } finally {
      uploadPending.value = false
    }
  }

  async function uploadCoverPhoto(file: File) {
    return uploadFile(file, { setAsCover: true })
  }

  async function removeImage(index: number) {
    if (!trainer.value) {
      return
    }

    resetStatus()
    deletePending.value = true

    try {
      const response = await $fetch<{ trainer: PersonalTrainer }>(`/api/personal-trainers/me/gallery/${index}`, {
        method: 'DELETE',
      })
      setTrainer(response.trainer)
      success.value = true
    } catch {
      error.value = t('dashboard.gallery.errors.deleteFailed')
    } finally {
      deletePending.value = false
    }
  }

  async function setCover(url: string) {
    if (!trainer.value) {
      return
    }

    resetStatus()
    coverPending.value = true

    try {
      const response = await $fetch<{ trainer: PersonalTrainer }>('/api/personal-trainers/me/gallery/cover', {
        method: 'PATCH',
        body: { url },
      })
      setTrainer(response.trainer)
      success.value = true
    } catch {
      error.value = t('dashboard.gallery.errors.coverFailed')
    } finally {
      coverPending.value = false
    }
  }

  function onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      uploadFile(file)
    }
    input.value = ''
  }

  return {
    gallery,
    photoUrl,
    canUpload,
    uploadPending,
    deletePending,
    coverPending,
    error,
    success,
    uploadFile,
    uploadCoverPhoto,
    removeImage,
    setCover,
    onFileInputChange,
    resetStatus,
  }
}
