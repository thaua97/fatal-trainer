<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer | null
}>()

const trainerRef = toRef(props, 'trainer')
const {
  templates,
  templatesPending,
  selectedTemplateId,
  selectedTemplate,
  pending,
  previewServicePrice,
  previewPromoPrice,
  previewDiscountPercent,
  redemptionSummary,
  formatPromotionPeriod,
  activateTemplate,
  deactivatePromotion,
} = useFTTrainerPromotionPicker(trainerRef)

const { t } = useI18n()
</script>

<template>
  <div data-testid="trainer-promotion-picker">
    <div
      class="rounded-3xl border border-[rgb(var(--ft-promo-rgb)/0.25)] bg-[rgb(var(--ft-promo-rgb)/0.06)] p-5"
      data-testid="trainer-promotion-preview"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.15em] text-(--ft-promo-strong)">
            {{ t('dashboard.promotion.previewLabel') }}
          </p>
          <div class="mt-2 flex items-center gap-3">
            <FTPriceLabel
              :price="previewServicePrice"
              :promo-price="selectedTemplate ? previewPromoPrice : undefined"
              :show-discount="!!selectedTemplate"
              size="lg"
            />
            <FTPromoBadge
              v-if="selectedTemplate && previewDiscountPercent"
              :percent="previewDiscountPercent"
              :label="selectedTemplate.label"
            />
          </div>
        </div>
        <p
          v-if="selectedTemplate"
          class="text-sm text-slate-600"
        >
          {{ redemptionSummary }}
        </p>
      </div>
    </div>

    <div
      v-if="templatesPending"
      class="mt-6 rounded-2xl border border-slate-200/80 bg-white/90 p-8 text-center text-slate-500"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin"
      />
    </div>

    <FTEmptyState
      v-else-if="!templates.length"
      title="Nenhuma promoção disponível no momento"
      variant="search"
      class="mt-6"
    />

    <div
      v-else
      class="mt-6 grid gap-3"
    >
      <button
        v-for="template in templates"
        :key="template.id"
        type="button"
        class="rounded-2xl border p-4 text-left transition-all"
        :class="selectedTemplateId === template.id
          ? 'border-violet-400 bg-violet-50/70 shadow-sm ring-2 ring-violet-200'
          : 'border-slate-200/80 bg-white/90 hover:border-violet-200 hover:bg-violet-50/30'"
        :disabled="pending"
        :data-testid="`trainer-promotion-template-${template.id}`"
        @click="activateTemplate(template.id)"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-slate-900">
              {{ template.label }}
            </p>
            <p class="mt-1 text-sm text-slate-500">
              {{ template.name }}
            </p>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ template.discountPercent }}% off
          </UBadge>
        </div>

        <div class="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{{ formatPromotionPeriod(template.startsAt, template.endsAt) }}</span>
          <span>
            {{ template.maxRedemptions ? `${template.maxRedemptions} resgates` : 'Resgates ilimitados' }}
          </span>
        </div>
      </button>
    </div>

    <div
      v-if="selectedTemplateId"
      class="mt-4"
    >
      <UButton
        variant="outline"
        color="neutral"
        class="rounded-full"
        :loading="pending"
        data-testid="trainer-promotion-deactivate"
        @click="deactivatePromotion"
      >
        Desativar promoção
      </UButton>
    </div>
  </div>
</template>
