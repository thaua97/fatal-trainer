import { computed, ref } from 'vue'

export const storyGalleryViewerOpen = ref(true)
export const storyGalleryActiveIndex = ref(0)

const gallery = [
  'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1533829/pexels-photo-1533829.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/17840/pexels-photo-17840.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/416475/pexels-photo-416475.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
]

export function useProfileGalleryViewer() {
  const images = ref(gallery)

  return {
    viewerOpen: storyGalleryViewerOpen,
    activeIndex: storyGalleryActiveIndex,
    images,
    trainerName: ref('Ana Silva'),
    hasGallery: computed(() => images.value.length > 0),
    total: computed(() => images.value.length),
    currentImage: computed(() => images.value[storyGalleryActiveIndex.value]),
    canGoPrev: computed(() => storyGalleryActiveIndex.value > 0),
    canGoNext: computed(() => storyGalleryActiveIndex.value < images.value.length - 1),
    hasMultipleImages: computed(() => images.value.length > 1),
    openAt: (index: number) => {
      storyGalleryActiveIndex.value = index
      storyGalleryViewerOpen.value = true
    },
    closeViewer: () => {
      storyGalleryViewerOpen.value = false
    },
    goNext: () => {
      if (storyGalleryActiveIndex.value < images.value.length - 1) {
        storyGalleryActiveIndex.value += 1
      }
    },
    goPrev: () => {
      if (storyGalleryActiveIndex.value > 0) {
        storyGalleryActiveIndex.value -= 1
      }
    },
    handleKeydown: () => {},
  }
}
