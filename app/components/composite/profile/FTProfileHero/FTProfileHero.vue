<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const trainerRef = toRef(props, 'trainer')
const { specialtyLine, carouselCount } = useFTProfileHero(trainerRef)
const trainerId = computed(() => props.trainer.id)
const { isFavorited, toggle, pending: favoritePending } = useFTFavoriteTrainer(trainerId)
const {
  sessionServicePrice,
  sessionPromoPrice,
  monthlyServicePrice,
  monthlyPromoPrice,
  hasPromotion,
  discountPercent,
  promotionLabel,
  promotionEndsAt,
} = useFTTrainerPrice(trainerRef)

const { openChat, canContact } = useWhatsApp({
  phone: computed(() => props.trainer.contactPhone),
  trainerName: computed(() => props.trainer.name),
})

const { t, locale } = useI18n()

const promotionValidity = computed(() => {
  if (!promotionEndsAt.value) {
    return null
  }

  const date = new Date(`${promotionEndsAt.value}T12:00:00`)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return t('profile.promotionValidUntil', {
    date: new Intl.DateTimeFormat(locale.value, {
      day: '2-digit',
      month: '2-digit',
    }).format(date),
  })
})
</script>

<template>
  <div>
    <div class="relative lg:hidden">
      <div class="relative h-80 overflow-hidden">
        <FTAvatar
          :src="trainer.photoUrl"
          :name="trainer.name"
          size="hero"
          :monochrome="false"
        />
        <FTIconButton
          to="/personal-trainers"
          class="absolute left-4 top-4"
          :ariaLabel="$t('profile.backToCatalog')"
        >
          <UIcon name="i-lucide-arrow-left" class="size-5 text-slate-900" />
        </FTIconButton>
        <div class="absolute right-4 top-4 flex gap-2">
          <FTIconButton
            :ariaLabel="$t('profile.message')"
            :disabled="!canContact"
            data-testid="profile-message-button"
            @click="openChat"
          >
            <UIcon name="i-lucide-message-circle" class="size-5 text-slate-900" />
          </FTIconButton>
          <FTIconButton
            :ariaLabel="isFavorited ? $t('profile.unfavorite') : $t('profile.favorite')"
            :aria-pressed="isFavorited"
            :disabled="favoritePending"
            data-testid="profile-favorite-button"
            @click="toggle"
          >
            <UIcon
              name="i-lucide-heart"
              class="size-5 transition-colors duration-200"
              :class="isFavorited ? 'fill-violet-600 text-violet-600' : 'text-slate-900'"
            />
          </FTIconButton>
        </div>
        <div
          v-if="carouselCount > 1"
          class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5"
        >
          <span
            v-for="index in carouselCount"
            :key="index"
            class="size-2 rounded-full"
            :class="index === 1 ? 'bg-white' : 'bg-white/40'"
          />
        </div>
      </div>

      <div :class="[$style.sheetTop, 'relative -mt-10 px-5 pb-6 pt-5']">
        <div class="flex items-start justify-between gap-4">
          <p class="text-xs text-slate-400">
            {{ trainer.profession }}
          </p>
          <FTRatingBadge
            v-if="trainer.rating"
            class="shrink-0"
            :rating="trainer.rating"
            :review-count="trainer.reviewCount"
          />
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900">
            {{ trainer.name }}
          </h1>
          <FTPromoBadge
            v-if="hasPromotion"
            :percent="discountPercent"
            :label="promotionLabel"
          />
        </div>
        <p
          v-if="specialtyLine"
          class="mt-1 text-sm text-slate-500"
        >
          {{ specialtyLine }}
        </p>
        <div class="mt-3 flex flex-col gap-0.5">
          <FTPriceLabel
            :price="sessionServicePrice"
            :promo-price="sessionPromoPrice"
            price-view="session"
            show-discount
            size="lg"
          />
          <FTPriceLabel
            :price="monthlyServicePrice"
            :promo-price="monthlyPromoPrice"
            price-view="monthly"
            show-discount
            size="md"
          />
        </div>
        <p
          v-if="promotionLabel || promotionValidity"
          class="mt-2 text-sm"
          :class="$style.promoNote"
        >
          <span v-if="promotionLabel">{{ promotionLabel }}</span>
          <span v-if="promotionLabel && promotionValidity"> · </span>
          <span v-if="promotionValidity">{{ promotionValidity }}</span>
        </p>
      </div>
    </div>

    <header class="hidden gap-8 lg:flex lg:flex-row lg:items-start">
      <FTAvatar
        :src="trainer.photoUrl"
        :name="trainer.name"
        size="xl"
        :monochrome="false"
        class="shrink-0"
      />
      <div class="flex-1 pt-2">
        <div class="mb-4 flex gap-2">
          <FTIconButton
            to="/personal-trainers"
            :ariaLabel="$t('profile.backToCatalog')"
          >
            <UIcon name="i-lucide-arrow-left" class="size-5 text-slate-900" />
          </FTIconButton>
          <FTIconButton
            :ariaLabel="$t('profile.message')"
            :disabled="!canContact"
            data-testid="profile-message-button"
            @click="openChat"
          >
            <UIcon name="i-lucide-message-circle" class="size-5 text-slate-900" />
          </FTIconButton>
          <FTIconButton
            :ariaLabel="isFavorited ? $t('profile.unfavorite') : $t('profile.favorite')"
            :aria-pressed="isFavorited"
            :disabled="favoritePending"
            data-testid="profile-favorite-button"
            @click="toggle"
          >
            <UIcon
              name="i-lucide-heart"
              class="size-5 transition-colors duration-200"
              :class="isFavorited ? 'fill-violet-600 text-violet-600' : 'text-slate-900'"
            />
          </FTIconButton>
        </div>
        <div class="flex items-start justify-between gap-4">
          <p class="text-xs text-slate-400">
            {{ trainer.profession }}
          </p>
          <FTRatingBadge
            v-if="trainer.rating"
            class="shrink-0"
            :rating="trainer.rating"
            :review-count="trainer.reviewCount"
          />
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-2">
          <h1 class="text-3xl font-bold text-slate-900">
            {{ trainer.name }}
          </h1>
          <FTPromoBadge
            v-if="hasPromotion"
            :percent="discountPercent"
            :label="promotionLabel"
          />
        </div>
        <p
          v-if="specialtyLine"
          class="mt-1 text-sm text-slate-500"
        >
          {{ specialtyLine }}
        </p>
        <div class="mt-4 flex flex-col gap-0.5">
          <FTPriceLabel
            :price="sessionServicePrice"
            :promo-price="sessionPromoPrice"
            price-view="session"
            show-discount
            size="lg"
          />
          <FTPriceLabel
            :price="monthlyServicePrice"
            :promo-price="monthlyPromoPrice"
            price-view="monthly"
            show-discount
            size="md"
          />
        </div>
        <p
          v-if="promotionLabel || promotionValidity"
          class="mt-2 text-sm"
          :class="$style.promoNote"
        >
          <span v-if="promotionLabel">{{ promotionLabel }}</span>
          <span v-if="promotionLabel && promotionValidity"> · </span>
          <span v-if="promotionValidity">{{ promotionValidity }}</span>
        </p>
      </div>
    </header>
  </div>
</template>

<style module>
.sheetTop {
  background: #fff;
  border-radius: 1.5rem 1.5rem 0 0;
}

.promoNote {
  color: var(--ft-promo-strong);
}
</style>
