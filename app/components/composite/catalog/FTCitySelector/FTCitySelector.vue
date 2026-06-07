<script setup lang="ts">
const props = defineProps<{
  label?: string
  placeholder?: string
  testId?: string
}>()

const { t } = useI18n()
const { city, state, detecting, geoError, onDetect } = useFTCitySelector()

const fieldLabel = computed(() => props.label ?? t('cityFilter.label'))
const fieldPlaceholder = computed(
  () => props.placeholder ?? t('cityFilter.placeholder'),
)
</script>

<template>
  <FTCityPicker
    v-model:city="city"
    v-model:state="state"
    with-geolocation
    :detecting="detecting"
    :geo-error="geoError"
    :label="fieldLabel"
    :placeholder="fieldPlaceholder"
    :test-id="testId"
    @detect="onDetect"
  />
</template>
