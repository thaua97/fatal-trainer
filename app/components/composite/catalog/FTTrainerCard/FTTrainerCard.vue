<script setup lang="ts">
import type { PersonalTrainer } from "#shared/domain/catalog/entities/personal-trainer";

const props = defineProps<{
  trainer: PersonalTrainer;
}>();

const {
  servicePrice,
  promoPrice,
  hasPromotion,
  discountPercent,
  priceView,
} = useFTTrainerPrice(toRef(props, "trainer"));

const subtitle = computed(() => props.trainer.specialties?.[0] ?? "");

const hasMetadata = computed(
  () =>
    !!props.trainer.city ||
    (props.trainer.modalities?.length ?? 0) > 0,
);
</script>

<template>
  <NuxtLink
    :to="`/personal-trainers/${trainer.id}`"
    class="group flex w-full min-h-[120px] items-start gap-4 border-b border-slate-100/50 py-5 transition-[colors,box-shadow,border-color] duration-200 hover:bg-slate-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/40 focus-visible:ring-offset-2 lg:min-h-[140px] lg:gap-6 lg:py-6 lg:hover:shadow-sm xl:border-b-0"
    data-testid="trainer-card"
    :aria-label="$t('catalog.viewProfile', { name: trainer.name })"
  >
    <figure
      class="m-0 size-16 shrink-0 overflow-hidden rounded-2xl lg:size-24 lg:rounded-3xl"
    >
      <FTAvatar :src="trainer.photoUrl" :name="trainer.name" size="fill" />
    </figure>

    <article class="relative min-w-0 w-full flex-1 items-start">
      <header class="flex items-start justify-between gap-3 lg:gap-4">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2
              class="mt-0.5 truncate text-base font-bold text-slate-900 lg:text-lg"
            >
              {{ trainer.name }}
            </h2>
            <FTPromoBadge
              v-if="hasPromotion"
              :percent="discountPercent"
              :label="trainer.promotion?.label"
              size="sm"
            />
          </div>
          <p
            v-if="subtitle"
            class="mt-0.5 truncate text-xs text-slate-400 lg:text-sm"
          >
            {{ subtitle }}
          </p>
        </div>
        <FTRatingBadge
          v-if="trainer.rating"
          class="shrink-0"
          :rating="trainer.rating"
          :review-count="trainer.reviewCount"
        />
      </header>

      <FTPriceLabel
        :price="servicePrice"
        :promo-price="promoPrice"
        :price-view="priceView"
        show-discount
        size="responsive"
        class="mt-2 lg:mt-3"
      />

      <ul
        v-if="hasMetadata"
        class="mt-2 flex flex-wrap items-center gap-2 lg:mt-3 lg:gap-2.5"
      >
        <li
          v-if="trainer.city"
          class="inline-flex"
        >
          <FTDistanceLabel
            :city="trainer.city"
            :state="trainer.state"
          />
        </li>
        <li
          v-for="modality in trainer.modalities"
          :key="modality"
          class="inline-flex"
        >
          <FTModalityBadge :modality="modality" />
        </li>
      </ul>
    </article>
  </NuxtLink>
</template>
