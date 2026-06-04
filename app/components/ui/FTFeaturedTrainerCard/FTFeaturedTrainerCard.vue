<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { getInitialsFromName } from '#shared/utils/get-initials-from-name'

const props = defineProps<{
  trainer: PersonalTrainer
  activeIndex: number
  slideCount: number
}>()

const emit = defineEmits<{
  dotSelect: [index: number]
}>()

const profilePath = computed(() => `/personal-trainers/${props.trainer.id}`)

const specialtyLine = computed(
  () => props.trainer.specialties?.[0] ?? props.trainer.profession,
)

const headline = computed(() => {
  const match = props.trainer.description.match(/^[^.!?]+[.!?]?/)
  return match?.[0]?.trim() ?? props.trainer.description
})

const reviewAuthors = computed(() => props.trainer.reviews?.slice(0, 3) ?? [])

const statsPrimary = computed(() => {
  if (props.trainer.reviewCount != null && props.trainer.reviewCount > 0) {
    return `${props.trainer.reviewCount}+`
  }
  if (props.trainer.rating != null) {
    return props.trainer.rating.toFixed(1).replace('.', ',')
  }
  return null
})

const statsSecondary = computed(() => {
  if (props.trainer.reviewCount != null && props.trainer.reviewCount > 0) {
    return 'Avaliações'
  }
  if (props.trainer.rating != null) {
    return 'Estrelas'
  }
  return null
})
</script>

<template>
  <article
    :class="[$style.cardGradient, 'relative aspect-4/5 max-h-[420px] w-full overflow-hidden rounded-3xl']"
    data-testid="featured-trainer-card"
  >
    <img
      :src="trainer.photoUrl"
      :alt="`Foto de ${trainer.name}`"
      :class="$style.cardPhoto"
      loading="lazy"
    >
    <div
      :class="$style.cardBlend"
      aria-hidden="true"
    />

    <div class="relative flex h-full flex-col justify-between p-6 text-white">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h2 class="truncate text-lg font-bold">
            {{ trainer.name }}
          </h2>
          <p class="mt-0.5 truncate text-sm text-white/80">
            {{ specialtyLine }}
          </p>
        </div>
        <FTCarouselDots
          :count="slideCount"
          :active-index="activeIndex"
          class="shrink-0"
          @select="emit('dotSelect', $event)"
        />
      </div>

      <div
        v-if="statsPrimary"
        class="mt-auto flex items-center gap-3"
      >
        <div
          v-if="reviewAuthors.length"
          class="flex -space-x-2"
        >
          <span
            v-for="review in reviewAuthors"
            :key="review.author"
            class="inline-flex size-8 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 text-xs font-semibold text-white"
            :aria-label="`Avaliação de ${review.author}`"
          >
            {{ getInitialsFromName(review.author) }}
          </span>
        </div>
        <div>
          <p class="text-sm font-bold">
            {{ statsPrimary }}
          </p>
          <p
            v-if="statsSecondary"
            class="text-xs text-white/75"
          >
            {{ statsSecondary }}
          </p>
        </div>
      </div>

      <div class="mt-4 flex items-end justify-between gap-4">
        <p class="line-clamp-3 max-w-[70%] text-xl font-bold leading-snug">
          {{ headline }}
        </p>
        <NuxtLink
          :to="profilePath"
          :class="[$style.cardCta, 'shrink-0']"
          :aria-label="`Ver perfil de ${trainer.name}`"
          data-testid="featured-trainer-cta"
        >
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-5"
          />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<style module>
.cardGradient {
  background: linear-gradient(135deg, rgb(var(--ft-primary-rgb) / 0.96) 0%, rgb(167 139 250 / 0.92) 42%, rgb(56 189 248 / 0.88) 100%);
}

.cardPhoto {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 64%;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgb(0 0 0 / 0.08) 10%,
    rgb(0 0 0 / 0.35) 22%,
    rgb(0 0 0 / 0.72) 36%,
    rgb(0 0 0 / 0.95) 48%,
    #000 58%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgb(0 0 0 / 0.08) 10%,
    rgb(0 0 0 / 0.35) 22%,
    rgb(0 0 0 / 0.72) 36%,
    rgb(0 0 0 / 0.95) 48%,
    #000 58%
  );
}

.cardBlend {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      102deg,
      rgb(var(--ft-primary-rgb) / 0.55) 0%,
      rgb(139 92 246 / 0.42) 18%,
      rgb(167 139 250 / 0.22) 34%,
      rgb(56 189 248 / 0.08) 50%,
      transparent 68%
    ),
    linear-gradient(
      to top,
      rgb(var(--ft-primary-rgb) / 0.35) 0%,
      rgb(var(--ft-primary-rgb) / 0.12) 28%,
      transparent 55%
    );
}

.cardCta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid rgb(255 255 255 / 0.6);
  border-radius: 9999px;
  color: #fff;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.cardCta:hover {
  background: rgb(255 255 255 / 0.12);
  border-color: rgb(255 255 255 / 0.85);
}
</style>
