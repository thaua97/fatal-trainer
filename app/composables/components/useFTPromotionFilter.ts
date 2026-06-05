export function useFTPromotionFilter() {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()

  const onPromotion = computed({
    get: () => filters.value.onPromotion === true,
    set: (value: boolean) => {
      updateFilters({
        onPromotion: value ? true : undefined,
        page: 1,
      })
    },
  })

  const label = computed(() => t('catalog.onPromotionOnly'))

  return {
    onPromotion,
    label,
  }
}
