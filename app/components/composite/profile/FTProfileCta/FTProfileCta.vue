<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const trainerRef = toRef(props, 'trainer')
const { label, openModal, hireUnavailableReason } = useFTProfileCta(trainerRef)
const { servicePrice, promoPrice, hasPromotion, priceView } = useFTTrainerPrice(toRef(props, 'trainer'))
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
    data-testid="trainer-profile-cta"
  >
    <div
      v-if="hasPromotion"
      class="mb-3 flex items-center justify-center"
    >
      <FTPriceLabel
        :price="servicePrice"
        :promo-price="promoPrice"
        :price-view="priceView"
        show-discount
        size="md"
      />
    </div>
    <FTProfileHireAction
      :label="label"
      test-id="trainer-profile-hire-button"
      :unavailable-reason="hireUnavailableReason"
      @click="openModal"
    />
  </div>
</template>
