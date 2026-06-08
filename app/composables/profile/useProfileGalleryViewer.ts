import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export function useProfileGalleryViewer(trainer: Ref<PersonalTrainer | undefined | null>) {
  const viewerOpen = useState('profile-gallery-viewer-open', () => false)
  const activeIndex = useState('profile-gallery-viewer-index', () => 0)

  const { images, trainerName, hasGallery } = useFTProfileGallery(trainer)

  const total = computed(() => images.value.length)
  const currentImage = computed(() => images.value[activeIndex.value])
  const canGoPrev = computed(() => activeIndex.value > 0)
  const canGoNext = computed(() => activeIndex.value < total.value - 1)
  const hasMultipleImages = computed(() => total.value > 1)

  function openAt(index: number) {
    if (index < 0 || index >= total.value) {
      return
    }

    activeIndex.value = index
    viewerOpen.value = true
  }

  function closeViewer() {
    viewerOpen.value = false
  }

  function goNext() {
    if (!canGoNext.value) {
      return
    }

    activeIndex.value += 1
  }

  function goPrev() {
    if (!canGoPrev.value) {
      return
    }

    activeIndex.value -= 1
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!viewerOpen.value) {
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  return {
    viewerOpen,
    activeIndex,
    images,
    trainerName,
    hasGallery,
    total,
    currentImage,
    canGoPrev,
    canGoNext,
    hasMultipleImages,
    openAt,
    closeViewer,
    goNext,
    goPrev,
    handleKeydown,
  }
}
