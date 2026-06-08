<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

defineProps<{
  trainer: PersonalTrainer | null
  pending?: boolean
}>()

const { t } = useI18n()

const activeTab = ref('info')

const tabItems = computed(() => [
  {
    label: t('dashboard.tabs.info'),
    icon: 'i-lucide-user',
    value: 'info',
    slot: 'info',
  },
  {
    label: t('dashboard.tabs.gallery'),
    icon: 'i-lucide-images',
    value: 'gallery',
    slot: 'gallery',
  },
  {
    label: t('dashboard.tabs.promotion'),
    icon: 'i-lucide-tag',
    value: 'promotion',
    slot: 'promotion',
  },
])
</script>

<template>
  <div data-testid="trainer-dashboard">
    <div
      v-if="pending"
      class="space-y-4"
      data-testid="trainer-dashboard-loading"
    >
      <USkeleton class="h-10 w-full rounded-2xl" />
      <USkeleton class="h-64 w-full rounded-3xl" />
    </div>

    <UTabs
      v-else
      v-model="activeTab"
      :items="tabItems"
      color="primary"
      variant="pill"
      class="w-full"
      :ui="{
        list: 'rounded-2xl bg-slate-100/80 p-1',
        trigger: 'rounded-xl data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm',
      }"
      data-testid="trainer-dashboard-tabs"
    >
      <template #info="{ item }">
        <div
          :key="item.value"
          class="mt-6 transition-opacity duration-200"
        >
          <FTTrainerInfoForm :trainer="trainer" />
        </div>
      </template>

      <template #gallery="{ item }">
        <div
          :key="item.value"
          class="mt-6 transition-opacity duration-200"
        >
          <FTTrainerGalleryManager :trainer="trainer" />
        </div>
      </template>

      <template #promotion="{ item }">
        <div
          :key="item.value"
          class="mt-6 transition-opacity duration-200"
        >
          <FTTrainerPromotionPicker :trainer="trainer" />
        </div>
      </template>
    </UTabs>
  </div>
</template>
