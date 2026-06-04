import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTAvatar from './FTAvatar.vue'

describe('FTAvatar', () => {
  it('renders image when src is provided', () => {
    const wrapper = mountFT(FTAvatar, {
      props: { name: 'Ana Silva', src: 'https://example.com/photo.jpg' },
    })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('span[role="img"]').exists()).toBe(false)
  })

  it('renders initials when src is missing', () => {
    const wrapper = mountFT(FTAvatar, {
      props: { name: 'Ana Silva' },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('span[role="img"]').text()).toBe('AS')
  })

  it('falls back to initials when image fails to load', async () => {
    const wrapper = mountFT(FTAvatar, {
      props: { name: 'Marcos Oliveira', src: 'https://example.com/broken.jpg' },
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('span[role="img"]').text()).toBe('MO')
  })
})
