import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { trainerProfileService } from '~/services/dashboard/trainer-profile.service'
import { extractApiErrors } from '~/services/api/extract-api-errors'

const MAX_GALLERY_IMAGES = 12

export function useFTTrainerGalleryManager(trainer: Ref<PersonalTrainer | null>) {
  const { setTrainer } = useMyTrainerProfile()
  const { t } = useI18n()
  const toast = useFTToast()
  const { toMediaUrl } = useMediaUrl()

  const uploadPending = ref(false)
  const deletePending = ref(false)
  const coverPending = ref(false)

  const gallery = computed(() => trainer.value?.gallery ?? [])
  const displayGallery = computed(() => gallery.value.map(url => toMediaUrl(url)))
  const photoUrl = computed(() => trainer.value?.photoUrl ?? '')
  const displayPhotoUrl = computed(() => toMediaUrl(photoUrl.value))
  const canUpload = computed(() => gallery.value.length < MAX_GALLERY_IMAGES)

  async function uploadFile(file: File, options?: { setAsCover?: boolean }) {
    if (!trainer.value || !canUpload.value) {
      return null
    }

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

      toast.success(t('dashboard.gallery.success'))
      return response.url
    } catch (err: unknown) {
      const data = extractApiErrors<Record<string, string>>(err)
      const code = data.file ?? data.gallery
      const message = code
        ? t(`dashboard.gallery.errors.${code}`)
        : t('dashboard.gallery.errors.uploadFailed')
      toast.error(message)
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

    deletePending.value = true

    try {
      const response = await trainerProfileService.deleteGallery(index)
      setTrainer(response.trainer)
      toast.success(t('dashboard.gallery.success'))
    } catch {
      toast.error(t('dashboard.gallery.errors.deleteFailed'))
    } finally {
      deletePending.value = false
    }
  }

  async function setCover(url: string) {
    if (!trainer.value) {
      return
    }

    coverPending.value = true

    try {
      const response = await trainerProfileService.setCover(url)
      setTrainer(response.trainer)
      toast.success(t('dashboard.gallery.success'))
    } catch {
      toast.error(t('dashboard.gallery.errors.coverFailed'))
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
    uploadFile,
    uploadCoverPhoto,
    removeImage,
    setCover,
    onFileInputChange,
  }
}
