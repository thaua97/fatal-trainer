<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const { label, disabled } = useFTProfileCta()
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
    <button
      type="button"
      :class="$style.ctaPill"
      :disabled="disabled"
      :aria-label="$t('profile.comingSoon', { label })"
    >
      {{ label }}
    </button>
  </div>
</template>

<style module>
.ctaPill {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--ft-primary);
  padding: 1rem 1.5rem;
  font-weight: 700;
  color: var(--ft-primary-foreground);
  transition: background-color 0.15s ease;
}

.ctaPill:hover:not(:disabled) {
  background: var(--ft-primary-hover);
}

.ctaPill:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
