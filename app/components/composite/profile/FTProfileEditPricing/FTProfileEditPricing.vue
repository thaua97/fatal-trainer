<script setup lang="ts">
const servicePrice = defineModel<number>('servicePrice', { required: true })

defineProps<{
  error?: string
}>()

const { t } = useI18n()
const { priceUi, inputSize } = useFTFormFieldUi()
const {
  priceViewOptions,
  displayPrice,
  periodLabel,
  priceHint,
  selectPriceView,
  isPriceViewSelected,
} = useFTProfilePriceInput(servicePrice)
</script>

<template>
  <div
    class="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
    data-testid="profile-edit-pricing"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm font-medium text-slate-700">
        {{ t('dashboard.edit.pricingTitle') }}
      </p>
      <div
        class="inline-flex rounded-full bg-white p-0.5 shadow-sm ring-1 ring-slate-200"
        role="group"
        :aria-label="t('catalog.priceViewTitle')"
      >
        <button
          v-for="option in priceViewOptions"
          :key="option.value"
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
          :class="isPriceViewSelected(option.value)
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-600 hover:bg-violet-50 hover:text-primary'"
          :aria-pressed="isPriceViewSelected(option.value)"
          :data-testid="`profile-edit-price-view-${option.value}`"
          @click="selectPriceView(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <UFormField
      class="mt-3 w-full"
      :error="error"
    >
      <div class="flex w-full items-end gap-2">
        <span class="shrink-0 pb-2 text-lg font-bold text-primary lg:text-xl">R$</span>
        <UInput
          v-model.number="displayPrice"
          class="min-w-0 w-full flex-1"
          type="number"
          min="1"
          step="1"
          :ui="priceUi"
          :size="inputSize"
          data-testid="trainer-info-price"
        />
        <span class="shrink-0 pb-2 text-sm text-slate-500">{{ periodLabel }}</span>
      </div>
    </UFormField>

    <p class="mt-2 text-xs text-slate-400">
      {{ priceHint }}
    </p>
  </div>
</template>
