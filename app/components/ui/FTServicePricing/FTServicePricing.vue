<script setup lang="ts">
import { SESSIONS_PER_MONTH } from '#shared/domain/catalog/services/trainer-pricing'

const props = withDefaults(defineProps<{
  sessionPrice: number
  sessionPromoPrice?: number
  monthlyPrice: number
  monthlyPromoPrice?: number
  discountPercent?: number | null
  promotionLabel?: string
  promotionValidity?: string | null
}>(), {
  discountPercent: null,
  promotionLabel: undefined,
  promotionValidity: null,
})

const { locale, t } = useI18n()

const monthlyHint = computed(() =>
  t('servicePricing.monthlyHint', { count: SESSIONS_PER_MONTH }),
)

function hasPromo(price: number, promoPrice?: number) {
  return promoPrice != null && promoPrice < price
}

function format(value: number) {
  return formatPrice(value, locale.value)
}

const sessionHasPromo = computed(() => hasPromo(props.sessionPrice, props.sessionPromoPrice))
const monthlyHasPromo = computed(() => hasPromo(props.monthlyPrice, props.monthlyPromoPrice))

const sessionDisplay = computed(() =>
  format(sessionHasPromo.value ? props.sessionPromoPrice! : props.sessionPrice),
)
const monthlyDisplay = computed(() =>
  format(monthlyHasPromo.value ? props.monthlyPromoPrice! : props.monthlyPrice),
)

const hasAnyPromotion = computed(() => sessionHasPromo.value || monthlyHasPromo.value)
</script>

<template>
  <div
    :class="$style.pricing"
    data-testid="service-pricing"
  >
    <div :class="$style.grid">
      <article
        :class="[$style.tile, sessionHasPromo && $style.tilePromo]"
        data-testid="service-pricing-session"
      >
        <div :class="$style.tileHeader">
          <span :class="[$style.iconBadge, sessionHasPromo ? $style.iconBadgePromo : $style.iconBadgePrimary]">
            <UIcon
              name="i-lucide-dumbbell"
              class="size-4"
            />
          </span>
          <div class="min-w-0">
            <p :class="$style.tileTitle">
              {{ $t('servicePricing.sessionTitle') }}
            </p>
            <p :class="$style.tileHint">
              {{ $t('servicePricing.sessionHint') }}
            </p>
          </div>
        </div>
        <div :class="$style.priceBlock">
          <p
            v-if="sessionHasPromo"
            :class="$style.originalPrice"
          >
            {{ format(sessionPrice) }}
          </p>
          <p :class="[$style.price, sessionHasPromo ? $style.pricePromo : $style.pricePrimary]">
            {{ sessionDisplay }}
          </p>
          <FTPromoBadge
            v-if="sessionHasPromo && discountPercent"
            :percent="discountPercent"
            size="sm"
            class="mt-1.5"
          />
        </div>
      </article>

      <article
        :class="[$style.tile, monthlyHasPromo && $style.tilePromo]"
        data-testid="service-pricing-monthly"
      >
        <div :class="$style.tileHeader">
          <span :class="[$style.iconBadge, monthlyHasPromo ? $style.iconBadgePromo : $style.iconBadgePrimary]">
            <UIcon
              name="i-lucide-calendar-days"
              class="size-4"
            />
          </span>
          <div class="min-w-0">
            <p :class="$style.tileTitle">
              {{ $t('servicePricing.monthlyTitle') }}
            </p>
            <p :class="$style.tileHint">
              {{ monthlyHint }}
            </p>
          </div>
        </div>
        <div :class="$style.priceBlock">
          <p
            v-if="monthlyHasPromo"
            :class="$style.originalPrice"
          >
            {{ format(monthlyPrice) }}
          </p>
          <p :class="[$style.price, monthlyHasPromo ? $style.pricePromo : $style.pricePrimary]">
            {{ monthlyDisplay }}
          </p>
          <FTPromoBadge
            v-if="monthlyHasPromo && discountPercent"
            :percent="discountPercent"
            size="sm"
            class="mt-1.5"
          />
        </div>
      </article>
    </div>

    <p
      v-if="hasAnyPromotion && (promotionLabel || promotionValidity)"
      :class="$style.promoFooter"
    >
      <UIcon
        name="i-lucide-sparkles"
        class="size-3.5 shrink-0"
      />
      <span>
        <span v-if="promotionLabel">{{ promotionLabel }}</span>
        <span v-if="promotionLabel && promotionValidity"> · </span>
        <span v-if="promotionValidity">{{ promotionValidity }}</span>
      </span>
    </p>
  </div>
</template>

<style module>
.pricing {
  border-radius: 1rem;
  background: rgb(var(--ft-primary-rgb) / 0.05);
  padding: 1rem 1.125rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

@media (width >= 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
  }

  .tile + .tile {
    border-left: 1px solid rgb(var(--ft-primary-rgb) / 0.1);
    padding-left: 1.125rem;
  }

  .tile:first-child {
    padding-right: 1.125rem;
  }
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.125rem 0;
}

.tilePromo {
  border-radius: 0.75rem;
  background: rgb(var(--ft-promo-rgb) / 0.06);
  padding: 0.625rem;
}

.tileHeader {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
}

.iconBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.625rem;
  flex-shrink: 0;
}

.iconBadgePrimary {
  background: var(--ft-primary-subtle);
  color: var(--ft-primary);
}

.iconBadgePromo {
  background: var(--ft-promo-subtle);
  color: var(--ft-promo-strong);
}

.tileTitle {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ui-text-highlighted);
  line-height: 1.25;
}

.tileHint {
  margin-top: 0.125rem;
  font-size: 0.6875rem;
  color: var(--ui-text-dimmed);
  line-height: 1.3;
}

.priceBlock {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.originalPrice {
  font-size: 0.8125rem;
  color: var(--ui-text-dimmed);
  text-decoration: line-through;
  line-height: 1.2;
}

.price {
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

@media (width >= 1024px) {
  .price {
    font-size: 1.5rem;
  }
}

.pricePrimary {
  color: var(--ft-primary);
}

.pricePromo {
  color: var(--ft-promo-strong);
}

.promoFooter {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.875rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgb(var(--ft-promo-rgb) / 0.12);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ft-promo-strong);
  line-height: 1.35;
}
</style>
