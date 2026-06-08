<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = withDefaults(defineProps<{
  trainer: PersonalTrainer | null
  variant?: 'default' | 'profile'
}>(), {
  variant: 'default',
})

const trainerRef = toRef(props, 'trainer')
const {
  form,
  unlimitedRedemptions,
  labelItems,
  pending,
  previewServicePrice,
  previewPromoPrice,
  previewDiscountPercent,
  redemptionSummary,
  handleSubmit,
} = useFTTrainerPromotionForm(trainerRef)

const { t } = useI18n()
const { fieldUi, selectUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <div data-testid="trainer-promotion-form">
    <form
      class="flex flex-col gap-5"
      data-testid="trainer-promotion-form-fields"
      @submit.prevent="handleSubmit"
    >
      <div
        class="rounded-3xl border border-[rgb(var(--ft-promo-rgb)/0.25)] bg-[rgb(var(--ft-promo-rgb)/0.06)] p-5"
        data-testid="trainer-promotion-preview"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ft-promo-strong)]">
              {{ t('dashboard.promotion.previewLabel') }}
            </p>
            <div class="mt-2 flex items-center gap-3">
              <FTPriceLabel
                :price="previewServicePrice"
                :promo-price="form.active ? previewPromoPrice : undefined"
                :show-discount="form.active"
                size="lg"
              />
              <FTPromoBadge
                v-if="form.active && previewDiscountPercent"
                :percent="previewDiscountPercent"
                :label="form.label || undefined"
              />
            </div>
          </div>
          <p class="text-sm text-slate-600">
            {{ redemptionSummary }}
          </p>
        </div>
      </div>

      <UFormField
        :label="t('dashboard.promotion.fields.active')"
      >
        <UCheckbox
          v-model="form.active"
          :label="t('dashboard.promotion.fields.activeHint')"
          data-testid="trainer-promotion-active"
        />
      </UFormField>

      <template v-if="form.active">
        <UFormField
          :label="t('dashboard.promotion.fields.discountPercent')"
          required
        >
          <div class="flex items-center gap-4">
            <input
              v-model.number="form.discountPercent"
              type="range"
              min="5"
              max="80"
              step="1"
              class="h-2 w-full cursor-pointer accent-violet-600"
              data-testid="trainer-promotion-discount-range"
            >
            <span class="min-w-12 text-right text-sm font-semibold text-violet-700">
              {{ form.discountPercent }}%
            </span>
          </div>
        </UFormField>

        <UFormField
          :label="t('dashboard.promotion.fields.label')"
          required
        >
          <USelect
            v-model="form.label"
            class="w-full"
            :items="labelItems"
            :ui="selectUi"
            data-testid="trainer-promotion-label"
          />
        </UFormField>

        <div class="grid gap-5 sm:grid-cols-2">
          <UFormField
            :label="t('dashboard.promotion.fields.startsAt')"
            required
          >
            <FTDatePicker
              v-model="form.startsAt"
              test-id="trainer-promotion-starts"
              :aria-label="t('dashboard.promotion.fields.startsAt')"
              :max-date="form.endsAt || '2099-12-31'"
            />
          </UFormField>

          <UFormField
            :label="t('dashboard.promotion.fields.endsAt')"
            required
          >
            <FTDatePicker
              v-model="form.endsAt"
              test-id="trainer-promotion-ends"
              :aria-label="t('dashboard.promotion.fields.endsAt')"
              :min-date="form.startsAt || undefined"
              max-date="2099-12-31"
            />
          </UFormField>
        </div>

        <UFormField
          :label="t('dashboard.promotion.fields.maxRedemptions')"
        >
          <div class="flex flex-col gap-3">
            <UCheckbox
              v-model="unlimitedRedemptions"
              :label="t('dashboard.promotion.fields.unlimitedRedemptions')"
              data-testid="trainer-promotion-unlimited"
            />
            <UInput
              v-if="!unlimitedRedemptions"
              v-model.number="form.maxRedemptions"
              class="w-full"
              type="number"
              min="1"
              :ui="fieldUi"
              :size="inputSize"
              data-testid="trainer-promotion-max-redemptions"
            />
          </div>
        </UFormField>
      </template>

      <div class="pt-2">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          class="rounded-full font-semibold"
          :loading="pending"
          data-testid="trainer-promotion-submit"
        >
          {{ pending ? t('dashboard.promotion.submitting') : t('dashboard.promotion.submit') }}
        </UButton>
      </div>
    </form>
  </div>
</template>
