import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../../tests/helpers/mount-ft'
import FTTrainerCard from './FTTrainerCard.vue'
import { mockTrainer } from '../../../../../tests/helpers/mock-trainer'

describe('FTTrainerCard', () => {
  it('renders', () => {
    const wrapper = mountFT(FTTrainerCard, { props: { trainer: mockTrainer() } })
    expect(wrapper.exists()).toBe(true)
  })
})
