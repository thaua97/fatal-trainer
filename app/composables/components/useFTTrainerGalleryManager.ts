import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { trainerProfileService } from '~/services/dashboard/trainer-profile.service'
import { extractApiErrors } from '~/services/api/extract-api-errors'

const MAX_GALLERY_IMAGES = 12

export function useFTTrainerGalleryManager(trainer: Ref<PersonalTrainer | null>) {
  const { setTrainer } = useMyTrainerProfile()
  const { t } = useI18n()
  const { toMediaUrl } = useMediaUrl()

  const uploadPending = ref(false)
  const deletePending = ref(false)
  const coverPending = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const gallery = computed(() => trainer.value?.gallery ?? [])
  const displayGallery = computed(() => gallery.value.map((url) => toMediaUrl(url)))
  const photoUrl = computed(() => trainer.value?.photoUrl ?? '')
  const displayPhotoUrl = computed(() => toMediaUrl(photoUrl.value))
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

      const response = await trainerProfileService.uploadGallery(formData)

      if (trainer.value) {
        setTrainer({
          ...trainer.value,
          gallery: response.gallery,
          photoUrl: options?.setAsCover ? response.url : (trainer.value.photoUrl || response.url),
        })
      }

      if (options?.setAsCover) {
        const coverResponse = await trainerProfileService.setCover(response.url)
        setTrainer(coverResponse.trainer)
      }

      success.value = true
      return response.url
    } catch (err: unknown) {
      const data = extractApiErrors<Record<string, string>>(err)
      const code = data.file ?? data.gallery
      error.value = code ? t(`dashboard.gallery.errors.${code}`) : t('dashboard.gallery.errors.uploadFailed')
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
      const response = await trainerProfileService.deleteGallery(index)
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
      const response = await trainerProfileService.setCover(url)
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
    displayGallery,
    photoUrl,
    displayPhotoUrl,
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
