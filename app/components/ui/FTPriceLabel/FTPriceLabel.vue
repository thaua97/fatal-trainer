<script setup lang="ts">
const props = withDefaults(defineProps<{
  price: number
  originalPrice?: number
  promoPrice?: number
  showDiscount?: boolean
  priceView?: 'session' | 'monthly'
  size?: 'md' | 'lg' | 'responsive'
}>(), {
  size: 'md',
  showDiscount: false,
  priceView: 'session',
})

const priceSizeClass = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'text-2xl'
    case 'responsive':
      return 'text-base lg:text-xl'
    default:
      return 'text-base'
  }
})

const originalSizeClass = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'text-base'
    case 'responsive':
      return 'text-sm lg:text-base'
    default:
      return 'text-sm'
  }
})

const { locale, t } = useI18n()

const periodLabel = computed(() =>
  props.priceView === 'monthly' ? t('profile.perMonth') : t('profile.perSession'),
)

const hasPromotion = computed(() => props.promoPrice != null && props.promoPrice < props.price)

const displayPrice = computed(() => {
  const value = hasPromotion.value ? props.promoPrice! : props.price
  return formatPrice(value, locale.value)
})

const formattedOriginal = computed(() => {
  const original = props.originalPrice ?? props.price
  return formatPrice(original, locale.value)
})

const discountPercent = computed(() => {
  if (!hasPromotion.value) {
    return null
  }

  const original = props.originalPrice ?? props.price
  if (original <= 0) {
    return null
  }

  return Math.round(((original - props.promoPrice!) / original) * 100)
})
</script>

<template>
  <div class="inline-flex flex-col gap-1">
    <p class="inline-flex flex-wrap items-baseline gap-1.5">
      <span
        v-if="hasPromotion"
        class="text-slate-400 line-through"
        :class="originalSizeClass"
      >
        {{ formattedOriginal }}
      </span>
      <span
        class="font-bold"
        :class="[priceSizeClass, hasPromotion ? $style.promoPrice : 'text-violet-600']"
      >
        {{ displayPrice }}
      </span>
      <span class="text-xs text-slate-400">
        {{ periodLabel }}
      </span>
      <FTPromoBadge
        v-if="showDiscount && discountPercent"
        :percent="discountPercent"
        size="sm"
      />
    </p>
  </div>
</template>

<style module>
.promoPrice {
  color: var(--ft-promo);
}
</style>
