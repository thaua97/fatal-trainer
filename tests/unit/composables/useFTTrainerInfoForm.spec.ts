// @vitest-environment nuxt
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { useFTTrainerInfoForm } from '~/composables/components/useFTTrainerInfoForm'

describe('useFTTrainerInfoForm', () => {
  it('keeps unsaved edits when trainer is updated externally', async () => {
    const trainer = ref(mockTrainer({
      id: 'trainer-1',
      name: 'Ana Silva',
      cref: '123456-G/SP',
      availability: 'Seg–Sex, 7h–20h',
      experienceYears: 5,
    }))

    let api!: ReturnType<typeof useFTTrainerInfoForm>

    const TestComponent = defineComponent({
      setup() {
        api = useFTTrainerInfoForm(trainer)
        return () => null
      },
    })

    await mountSuspended(TestComponent)

    api.form.name = 'Nome editado'
    await nextTick()

    trainer.value = {
      ...trainer.value,
      promotion: {
        discountPercent: 20,
        promoPrice: 96,
        label: 'Promo',
        startsAt: '2026-01-01',
        endsAt: '2026-12-31',
      },
    }
    await nextTick()

    expect(api.form.name).toBe('Nome editado')
  })
})
