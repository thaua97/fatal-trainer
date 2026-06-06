<script setup lang="ts">
const modelValue = defineModel<string>({ default: '' })

const { t } = useI18n()
const { search, items, pending, selectedAvatar } = useFTTrainerSelectMenu(modelValue)
</script>

<template>
  <USelectMenu
    v-model="modelValue"
    v-model:search-term="search"
    class="w-full"
    :items="items"
    value-key="value"
    label-key="label"
    :avatar="selectedAvatar"
    :loading="pending"
    :placeholder="t('placeholder')"
    :search-input="{ placeholder: t('searchPlaceholder') }"
    data-testid="report-trainer-select"
    :ui="{ base: 'w-full rounded-2xl' }"
  >
    <template #item-label="{ item }">
      <div class="min-w-0">
        <p class="truncate font-medium text-slate-900">
          {{ item.label }}
        </p>
        <p class="truncate text-xs text-slate-500">
          {{ item.profession }}
        </p>
      </div>
    </template>

    <template #item-leading="{ item }">
      <FTAvatar
        :src="item.avatar.src"
        :name="item.label"
        size="sm"
      />
    </template>
  </USelectMenu>
</template>
